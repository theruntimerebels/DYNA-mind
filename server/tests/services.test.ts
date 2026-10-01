import test from 'node:test';
import assert from 'node:assert/strict';
import { createMemoryStore } from '../src/store/memory.ts';
import { handleChat } from '../src/services/chat.ts';
import { recordCheckIn } from '../src/services/checkin.ts';
import { monitoringFor } from '../src/services/monitoring.ts';
import * as dash from '../src/services/dashboard.ts';

const env: any = { CRISIS_GUIDANCE: 'Contact local emergency services.' };
const stubAi = (over: Partial<any> = {}): any => ({
  available: true,
  async respond(_t: string) {
    return { source: 'gemini', turn: { message: 'I hear you. How have you been sleeping?', emotion: 'tense', emotionalIntensity: 0.5, sentiment: -0.4, stress: 0.5, sleepDifficulty: null, fearSafety: null, triggers: ['court proceedings'], ...over } };
  },
  async tts() { return null; },
});
const SID = '11111111-1111-4111-8111-111111111111';
const checkin = (store: any, userId: string, chest: number, jaw: number, sleep: number, extra: any = {}) =>
  recordCheckIn(store, { userId, emotions: ['Overwhelmed'], somatic: { chest, jaw, sleep }, trigger: 'Court Correspondence', notes: '', ...extra });

test('chat persists, is retrievable, and produces monitoring output', async () => {
  const store = createMemoryStore(); const u = await store.createUser('Asha');
  const r = await handleChat({ store, ai: stubAi(), env }, { userId: u.id, sessionId: SID, message: 'The hearing is making me tense', mode: 'text' });
  assert.equal(r.ai.source, 'gemini');
  assert.ok(r.monitoring.distressScore > 0);
  assert.equal(r.monitoring.coldStart, true);
  assert.equal(r.analysis.requiresFollowUp, false);
  const conv = await store.getConversation(SID);
  assert.equal(conv!.messages.length, 2);
  await handleChat({ store, ai: stubAi(), env }, { userId: u.id, sessionId: SID, message: 'Slept badly', mode: 'text' });
  assert.equal((await store.getConversation(SID))!.messages.length, 4);
  // chat turns in one session replace each other: still ONE assessment point
  assert.equal((await store.listAssessments(u.id)).length, 1);
});

test('conversation cannot be read/written across users', async () => {
  const store = createMemoryStore(); const a = await store.createUser('A'); const b = await store.createUser('B');
  await handleChat({ store, ai: stubAi(), env }, { userId: a.id, sessionId: SID, message: 'hi', mode: 'text' });
  await assert.rejects(handleChat({ store, ai: stubAi(), env }, { userId: b.id, sessionId: SID, message: 'hi', mode: 'text' }), /does not belong/);
});

test('critical statement: fixed safe reply, critical risk, follow-up created, no claim of notification', async () => {
  const store = createMemoryStore(); const u = await store.createUser('Asha');
  const r = await handleChat({ store, ai: stubAi({ message: 'MODEL TEXT SHOULD NOT BE USED' }), env }, { userId: u.id, sessionId: SID, message: 'I want to kill myself', mode: 'text' });
  assert.equal(r.analysis.riskLevel, 'critical');
  assert.ok(!r.message.includes('MODEL TEXT'));
  assert.match(r.message, /haven't contacted anyone/);
  assert.ok(r.message.includes(env.CRISIS_GUIDANCE));
  const f = await store.getOpenFollowUp(u.id);
  assert.equal(f!.severity, 'critical'); assert.equal(f!.notificationSent, false);
});

test('model cannot downgrade a safety statement (low model signals, critical text)', async () => {
  const store = createMemoryStore(); const u = await store.createUser('Asha');
  const r = await handleChat({ store, ai: stubAi({ emotionalIntensity: 0, sentiment: 1, stress: 0, fearSafety: 0 }), env }, { userId: u.id, sessionId: SID, message: "I don't want to be here anymore", mode: 'text' });
  assert.equal(r.analysis.riskLevel, 'critical');
});

test('longitudinal: stable history then a jump is detected and surfaced on the dashboard', async () => {
  const store = createMemoryStore(); const u = await store.createUser('Asha');
  const lows = [[3, 3, 3], [3, 4, 3], [3, 3, 4], [4, 3, 3], [3, 3, 3], [3, 4, 3]];
  const results = [];
  for (const [c, j, s] of lows) results.push(await checkin(store, u.id, c, j, s));
  const last = results[results.length - 1].assessment;
  assert.equal(last.coldStart, false);           // >=5 prior check-ins -> personal baseline exists
  assert.ok(last.baseline !== null);
  assert.equal(last.riskLevel === 'low' || last.riskLevel === 'moderate', true);

  const jump = await checkin(store, u.id, 9, 9, 9, { emotions: ['Overwhelmed', 'Somatic Tension'] });
  assert.ok(jump.assessment.delta! >= 15);
  assert.equal(jump.assessment.trend, 'rapid_deterioration');
  assert.equal(jump.checkIn.requiresFollowUp, true);
  assert.equal(jump.assessment.suddenChange, true);

  const m = await monitoringFor(store, u.id);
  assert.equal(m.history.length, 7);
  assert.equal(m.insufficientData, false);

  const ov = await dash.overview(store);
  assert.equal(ov.totalMonitored, 1); assert.equal(ov.requiringFollowUp, 1);
  assert.equal(ov.recentAlerts[0].notificationSent, false);
  const cases = await dash.cases(store);
  assert.equal(cases[0].followUp!.status, 'open');
  const detail: any = await dash.caseDetail(store, u.id);
  assert.equal(detail.recentCheckIns.length, 7);
  assert.equal('notes' in detail.recentCheckIns[0], false); // free text not exposed
  const fu = await dash.updateFollowUp(store, u.id, 'acknowledged', 'Reviewing', 'counsellor-1');
  assert.equal(fu.status, 'acknowledged'); assert.equal(fu.history.length, 2);
  await assert.rejects(dash.caseDetail(store, '00000000-0000-4000-8000-000000000000'), /not found/);
});

test('new user: first check-in is cold start and says so', async () => {
  const store = createMemoryStore(); const u = await store.createUser('New');
  const r = await checkin(store, u.id, 5, 5, 5);
  assert.equal(r.assessment.coldStart, true);
  assert.equal(r.assessment.delta, null);
  assert.equal((await monitoringFor(store, u.id)).insufficientData, true);
});

test('deleteUserData removes everything', async () => {
  const store = createMemoryStore(); const u = await store.createUser('X');
  await checkin(store, u.id, 9, 9, 9);
  await store.deleteUserData(u.id);
  assert.equal((await store.listAssessments(u.id)).length, 0);
  assert.equal((await store.listFollowUps(false)).length, 0);
});
