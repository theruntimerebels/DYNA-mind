import { randomUUID } from 'node:crypto';
import type { Store } from './types.ts';
import type { UserDoc, ConversationDoc, AssessmentDoc, CheckInDoc, FollowUpDoc } from '../types.ts';

const now = () => new Date().toISOString();

/** DEMO_MODE store. Data lives in process memory and is lost on restart. */
export function createMemoryStore(): Store {
  const users = new Map<string, UserDoc>();
  const convs = new Map<string, ConversationDoc>();
  const assessments: AssessmentDoc[] = [];
  const checkins: CheckInDoc[] = [];
  const followUps = new Map<string, FollowUpDoc>();
  const active = (f: FollowUpDoc) => f.status !== 'resolved';

  return {
    mode: 'memory',
    async createUser(displayName) {
      const u: UserDoc = { id: randomUUID(), displayName, createdAt: now(), lastActiveAt: now() };
      users.set(u.id, u); return u;
    },
    async getUser(id) { return users.get(id) ?? null; },
    async touchUser(id) { const u = users.get(id); if (u) u.lastActiveAt = now(); },
    async listUsers() { return [...users.values()]; },
    async appendMessages(sessionId, userId, msgs, source) {
      let c = convs.get(sessionId);
      if (!c) { c = { sessionId, userId, messages: [], metadata: { source, messageCount: 0 }, createdAt: now(), updatedAt: now() }; convs.set(sessionId, c); }
      if (c.metadata.source !== source) c.metadata.source = 'mixed';
      c.messages.push(...msgs); c.metadata.messageCount = c.messages.length; c.updatedAt = now();
    },
    async getConversation(id) { return convs.get(id) ?? null; },
    async listSessions(userId) {
      return [...convs.values()].filter((c) => c.userId === userId)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .map((c) => ({ sessionId: c.sessionId, updatedAt: c.updatedAt, messageCount: c.messages.length }));
    },
    async upsertAssessment(a) {
      const i = assessments.findIndex((x) => x.userId === a.userId && x.sessionKey === a.sessionKey);
      if (i >= 0) assessments[i] = a; else assessments.push(a);
    },
    async listAssessments(userId, limit = 200) {
      return assessments.filter((a) => a.userId === userId).sort((a, b) => a.timestamp.localeCompare(b.timestamp)).slice(-limit);
    },
    async latestAssessments() {
      const m = new Map<string, AssessmentDoc>();
      for (const a of [...assessments].sort((x, y) => x.timestamp.localeCompare(y.timestamp))) m.set(a.userId, a);
      return [...m.values()];
    },
    async addCheckIn(c) { checkins.push(c); },
    async listCheckIns(userId, limit = 50) {
      return checkins.filter((c) => c.userId === userId).sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, limit);
    },
    async recentCheckIns(limit) { return [...checkins].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, limit); },
    async getOpenFollowUp(userId) { return [...followUps.values()].find((f) => f.userId === userId && active(f)) ?? null; },
    async saveFollowUp(f) { followUps.set(f.id, f); },
    async listFollowUps(onlyActive) {
      return [...followUps.values()].filter((f) => !onlyActive || active(f)).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    },
    async listFollowUpsForUser(userId) {
      return [...followUps.values()].filter((f) => f.userId === userId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    },
    async deleteUserData(userId) {
      users.delete(userId);
      for (const [k, c] of convs) if (c.userId === userId) convs.delete(k);
      for (const arr of [assessments, checkins] as { userId: string }[][]) {
        for (let i = arr.length - 1; i >= 0; i--) if (arr[i].userId === userId) arr.splice(i, 1);
      }
      for (const [k, f] of followUps) if (f.userId === userId) followUps.delete(k);
    },
    async close() {},
  };
}
