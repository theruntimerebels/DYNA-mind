import { randomUUID } from 'node:crypto';
import type { Store } from '../store/types.ts';
import type { AssessmentDoc, FollowUpDoc, RiskLevel, SafetyLevel, Signals } from '../types.ts';
import { scoreSignals, analyseTemporal, classifyRisk, confidenceOf } from '../distress/engine.ts';

const order: RiskLevel[] = ['low', 'moderate', 'high', 'critical'];

export interface AssessInput {
  userId: string; sessionKey: string; source: 'chat' | 'checkin';
  signals: Signals; triggers: string[]; safetyLevel: SafetyLevel; at?: Date;
}

/** Score -> temporal analysis vs this person's own history -> rules -> persist -> sync follow-up. */
export async function assess(store: Store, i: AssessInput) {
  const history = await store.listAssessments(i.userId, 200);
  // Prior points exclude this session's own earlier assessment (it gets replaced).
  const prior = history.filter((h) => h.sessionKey !== i.sessionKey);
  const priorScores = prior.map((h) => h.score);

  const { score, coverage, contributing } = scoreSignals(i.signals);
  const temporal = analyseTemporal(score, priorScores);
  const risk = classifyRisk({ score, temporal, safetyLevel: i.safetyLevel });

  const doc: AssessmentDoc = {
    id: randomUUID(), userId: i.userId, sessionKey: i.sessionKey, source: i.source,
    timestamp: (i.at ?? new Date()).toISOString(), score,
    previousScore: temporal.previousScore, delta: temporal.delta, rollingAverage: temporal.rollingAverage,
    baseline: temporal.baseline, baselineDeviation: temporal.baselineDeviation, trend: temporal.trend,
    consecutiveDeteriorating: temporal.consecutiveDeteriorating, suddenChange: temporal.suddenChange,
    coldStart: temporal.coldStart, confidence: confidenceOf(coverage, priorScores.length),
    riskLevel: risk.riskLevel, signals: i.signals, contributing, triggers: i.triggers,
    escalationReasons: risk.reasons, safetyLevel: i.safetyLevel,
  };
  await store.upsertAssessment(doc);
  const followUp = risk.requiresFollowUp ? await syncFollowUp(store, doc) : null;
  return { assessment: doc, requiresFollowUp: risk.requiresFollowUp, followUp };
}

/** Creates/updates a human follow-up record. Nothing is sent to anyone: notificationSent is always false. */
async function syncFollowUp(store: Store, a: AssessmentDoc): Promise<FollowUpDoc> {
  const t = new Date().toISOString();
  const summary = `score ${a.score}, trend ${a.trend}${a.delta !== null ? ` (${a.delta >= 0 ? '+' : ''}${a.delta})` : ''}` +
    `${a.baseline !== null ? `, baseline ${a.baseline}` : ', cold start'}; top signals: ${a.contributing.slice(0, 3).map((c) => c.signal).join(', ') || 'none'}`;
  const reason = a.escalationReasons.join('; ') || 'Follow-up criteria met';
  const open = await store.getOpenFollowUp(a.userId);
  if (open) {
    if (order.indexOf(a.riskLevel) > order.indexOf(open.severity)) open.severity = a.riskLevel;
    open.reason = reason; open.signalSummary = summary; open.updatedAt = t;
    open.history.push({ at: t, status: open.status, note: `Re-evaluated: ${a.riskLevel} risk`, by: 'system' });
    await store.saveFollowUp(open); return open;
  }
  const f: FollowUpDoc = {
    id: randomUUID(), userId: a.userId, status: 'open', severity: a.riskLevel, reason, signalSummary: summary,
    createdAt: t, updatedAt: t, notificationSent: false,
    history: [{ at: t, status: 'open', note: 'Created by rule-based escalation', by: 'system' }],
  };
  await store.saveFollowUp(f); return f;
}

export function recurringStressors(history: AssessmentDoc[], windowDays = 30) {
  const since = Date.now() - windowDays * 864e5;
  const counts = new Map<string, number>();
  for (const h of history) if (Date.parse(h.timestamp) >= since) for (const t of new Set(h.triggers)) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]).map(([trigger, count]) => ({ trigger, count }));
}

export async function monitoringFor(store: Store, userId: string) {
  const history = await store.listAssessments(userId, 200);
  const latest = history[history.length - 1] ?? null;
  const follow = await store.getOpenFollowUp(userId);
  return {
    userId, assessmentCount: history.length, current: latest,
    baseline: latest?.baseline ?? null, coldStart: latest ? latest.coldStart : true,
    insufficientData: history.length < 5,
    history: history.map((h) => ({ timestamp: h.timestamp, score: h.score, source: h.source, riskLevel: h.riskLevel, trend: h.trend })),
    recurringStressors: recurringStressors(history),
    followUp: follow ? { id: follow.id, status: follow.status, severity: follow.severity } : null,
    disclaimer: 'Prototype decision-support output. Not a diagnosis. Thresholds are not clinically validated.',
  };
}

/** Short summary given to the LLM so it can personalise without receiving raw history. */
export async function summaryForPrompt(store: Store, userId: string) {
  const h = await store.listAssessments(userId, 10);
  if (!h.length) return 'No previous check-ins (first interaction).';
  const l = h[h.length - 1];
  const st = recurringStressors(h).map((s) => s.trigger).join(', ');
  return `${h.length} previous assessments; latest trend: ${l.trend}; recurring stressors: ${st || 'none identified'}.`;
}

/** Engagement signal: current gap since last interaction vs this person's usual gap. Needs >=3 history points. */
export function engagementDrop(history: AssessmentDoc[], now = Date.now()): number | undefined {
  if (history.length < 3) return undefined;
  const ts = history.map((h) => Date.parse(h.timestamp));
  const gaps = ts.slice(1).map((t, i) => t - ts[i]).filter((g) => g > 36e5).sort((a, b) => a - b);
  if (!gaps.length) return undefined;
  const typical = gaps[Math.floor(gaps.length / 2)];
  const gap = now - ts[ts.length - 1];
  return Math.min(1, Math.max(0, (gap / typical - 1) / 3));
}
