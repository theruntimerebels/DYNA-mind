import { randomUUID } from 'node:crypto';
import type { Store } from '../store/types.ts';
import type { CheckInDoc, Signals } from '../types.ts';
import { scanSafety } from '../safety/safety.ts';
import { analyseText, NEGATIVE_CHECKIN_EMOTIONS, POSITIVE_CHECKIN_EMOTIONS } from '../ai/lexicon.ts';
import { assess, engagementDrop } from './monitoring.ts';
import { AppError } from '../utils/errors.ts';

export interface CheckInInput {
  userId: string; emotions: string[]; somatic: { chest: number; jaw: number; sleep: number }; trigger: string; notes: string;
}

export function checkInSignals(i: CheckInInput): { signals: Signals; triggers: string[] } {
  const text = analyseText(i.notes);
  const emoNeg = i.emotions.map((e) => NEGATIVE_CHECKIN_EMOTIONS[e] ?? 0);
  const hasEmotions = i.emotions.length > 0;
  const emoIntensity = hasEmotions ? Math.min(1, Math.max(...emoNeg, 0) * 0.7 + (emoNeg.filter((x) => x > 0).length / 4) * 0.3) : undefined;
  const allPositive = hasEmotions && i.emotions.every((e) => POSITIVE_CHECKIN_EMOTIONS.includes(e));
  const signals: Signals = {
    somatic: (i.somatic.chest + i.somatic.jaw + i.somatic.sleep) / 30,
    sleepDifficulty: i.somatic.sleep / 10,
    ...(emoIntensity !== undefined && { emotionalIntensity: allPositive ? 0 : emoIntensity }),
    ...(i.notes.trim() && { negativeSentiment: (1 - text.sentiment) / 2 }),
    ...(text.stress !== null && { stress: text.stress }),
  };
  return { signals, triggers: [...new Set([i.trigger, ...text.triggers].filter(Boolean))] };
}

export async function recordCheckIn(store: Store, i: CheckInInput) {
  if (!(await store.getUser(i.userId))) throw new AppError(404, 'USER_NOT_FOUND', 'Unknown user. Start a new session.');
  const safety = scanSafety(i.notes);
  const { signals, triggers } = checkInSignals(i);
  if (safety.level !== 'none') signals.fearSafety = safety.level === 'critical' ? 1 : 0.8;
  const prior = await store.listAssessments(i.userId, 200);
  const drop = engagementDrop(prior);
  if (drop !== undefined) signals.engagementDrop = drop;

  const id = randomUUID();
  const r = await assess(store, { userId: i.userId, sessionKey: `checkin:${id}`, source: 'checkin', signals, triggers, safetyLevel: safety.level });
  const a = r.assessment;
  const doc: CheckInDoc = {
    id, userId: i.userId, timestamp: a.timestamp,
    responses: { emotions: i.emotions, somatic: i.somatic, trigger: i.trigger, notes: i.notes },
    assessmentId: a.id, distressScore: a.score, riskLevel: a.riskLevel, triggers,
    changeFromPrevious: a.delta, requiresFollowUp: r.requiresFollowUp,
    followUpRecommendation: r.requiresFollowUp ? 'Human review recommended (prototype rule-based criteria). No automatic notification has been sent.' : null,
  };
  await store.addCheckIn(doc);
  await store.touchUser(i.userId);
  return { checkIn: doc, assessment: a };
}
