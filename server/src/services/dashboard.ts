import type { Store } from '../store/types.ts';
import type { FollowUpStatus, RiskLevel } from '../types.ts';
import { monitoringFor } from './monitoring.ts';
import { AppError, notFound } from '../utils/errors.ts';

export async function overview(store: Store) {
  const [users, latest, active, recent] = await Promise.all([store.listUsers(), store.latestAssessments(), store.listFollowUps(true), store.recentCheckIns(10)]);
  const name = new Map(users.map((u) => [u.id, u.displayName]));
  const byRisk: Record<RiskLevel, number> = { low: 0, moderate: 0, high: 0, critical: 0 };
  for (const a of latest) byRisk[a.riskLevel]++;
  return {
    storeMode: store.mode, totalMonitored: users.length, byRisk, requiringFollowUp: active.length,
    recentCheckIns: recent.map((c) => ({ id: c.id, userId: c.userId, displayName: name.get(c.userId) ?? 'Unknown', timestamp: c.timestamp, distressScore: c.distressScore, riskLevel: c.riskLevel, change: c.changeFromPrevious })),
    recentAlerts: active.slice(0, 10).map((f) => ({ id: f.id, userId: f.userId, displayName: name.get(f.userId) ?? 'Unknown', severity: f.severity, status: f.status, reason: f.reason, updatedAt: f.updatedAt, notificationSent: f.notificationSent })),
  };
}

export async function cases(store: Store) {
  const [users, latest, active] = await Promise.all([store.listUsers(), store.latestAssessments(), store.listFollowUps(true)]);
  const la = new Map(latest.map((a) => [a.userId, a])); const fu = new Map(active.map((f) => [f.userId, f]));
  const rank: Record<string, number> = { critical: 3, high: 2, moderate: 1, low: 0, none: -1 };
  return users.map((u) => {
    const a = la.get(u.id); const f = fu.get(u.id);
    return {
      userId: u.id, displayName: u.displayName, lastActiveAt: u.lastActiveAt,
      riskLevel: a?.riskLevel ?? null, distressScore: a?.score ?? null, trend: a?.trend ?? null, delta: a?.delta ?? null,
      baseline: a?.baseline ?? null, coldStart: a ? a.coldStart : true, lastAssessmentAt: a?.timestamp ?? null,
      followUp: f ? { id: f.id, status: f.status, severity: f.severity } : null,
    };
  }).sort((x, y) => (rank[y.riskLevel ?? 'none'] - rank[x.riskLevel ?? 'none']) || ((y.distressScore ?? 0) - (x.distressScore ?? 0)));
}

/** Individual view. Deliberately omits conversation text and free-text check-in notes. */
export async function caseDetail(store: Store, userId: string) {
  const user = await store.getUser(userId);
  if (!user) throw notFound('Case');
  const [m, checkIns, followUps] = await Promise.all([monitoringFor(store, userId), store.listCheckIns(userId, 30), store.listFollowUpsForUser(userId)]);
  return {
    user: { userId, displayName: user.displayName, createdAt: user.createdAt, lastActiveAt: user.lastActiveAt },
    monitoring: m,
    recentCheckIns: checkIns.map((c) => ({ id: c.id, timestamp: c.timestamp, distressScore: c.distressScore, riskLevel: c.riskLevel, change: c.changeFromPrevious, emotions: c.responses.emotions, somatic: c.responses.somatic, trigger: c.responses.trigger })),
    followUps,
  };
}

export async function updateFollowUp(store: Store, userId: string, status: FollowUpStatus, note: string, by: string) {
  const all = await store.listFollowUpsForUser(userId);
  const f = all.find((x) => x.status !== 'resolved') ?? null;
  if (!f) throw new AppError(404, 'NO_ACTIVE_FOLLOW_UP', 'No active follow-up for this case.');
  const t = new Date().toISOString();
  f.status = status; f.updatedAt = t; f.history.push({ at: t, status, note, by });
  await store.saveFollowUp(f);
  return f;
}
