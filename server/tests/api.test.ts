// HTTP-level tests. Requires `npm install` (express, zod, helmet, ...). Uses the in-memory store and a stub AI.
import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import type { Server } from 'node:http';
import { loadEnv } from '../src/config/env.ts';
import { createMemoryStore } from '../src/store/memory.ts';
import { createApp } from '../src/app.ts';

const env = loadEnv({ NODE_ENV: 'test', DEMO_MODE: 'true', SESSION_SECRET: 'test-secret', COUNSELLOR_ACCESS_CODE: 'letmein' } as any);
const ai: any = {
  available: true,
  respond: async () => ({ source: 'gemini', turn: { message: 'Thanks for sharing. How did you sleep?', emotion: 'tense', emotionalIntensity: 0.4, sentiment: -0.3, stress: 0.4, sleepDifficulty: null, fearSafety: null, triggers: [] } }),
  tts: async () => null,
};
let server: Server; let base = '';
before(async () => { const app = createApp({ env, store: createMemoryStore(), ai }); await new Promise<void>((r) => { server = app.listen(0, () => r()); }); base = `http://127.0.0.1:${(server.address() as any).port}/api`; });
after(() => server.close());
const j = (path: string, init: RequestInit = {}) => fetch(base + path, { ...init, headers: { 'Content-Type': 'application/json', ...(init.headers as any) } }).then(async (r) => ({ status: r.status, body: await r.json() }));

test('health reports store mode', async () => {
  const r = await j('/health'); assert.equal(r.status, 200); assert.equal(r.body.data.storeMode, 'memory'); assert.equal(r.body.data.persistent, false);
});
test('chat requires a session token and validates input', async () => {
  assert.equal((await j('/chat', { method: 'POST', body: '{}' })).status, 401);
  const s = await j('/session', { method: 'POST', body: JSON.stringify({ displayName: 'Asha' }) });
  assert.equal(s.status, 201);
  const auth = { Authorization: `Bearer ${s.body.data.token}` };
  assert.equal((await j('/chat', { method: 'POST', headers: auth, body: JSON.stringify({ sessionId: 'nope', message: 'hi' }) })).status, 400);
  assert.equal((await j('/chat', { method: 'POST', headers: auth, body: JSON.stringify({ sessionId: s.body.data.sessionId, message: 'x'.repeat(2001) }) })).status, 400);
  const ok = await j('/chat', { method: 'POST', headers: auth, body: JSON.stringify({ sessionId: s.body.data.sessionId, message: 'Tense about Tuesday' }) });
  assert.equal(ok.status, 200); assert.ok(ok.body.data.monitoring); assert.ok(ok.body.data.analysis);
  const conv = await j(`/conversations/${s.body.data.sessionId}`, { headers: auth });
  assert.equal(conv.body.data.messages.length, 2);
});
test('tampered token rejected; dashboard needs access code', async () => {
  assert.equal((await j('/monitoring/11111111-1111-4111-8111-111111111111', { headers: { Authorization: 'Bearer x.y' } })).status, 401);
  assert.equal((await j('/dashboard/overview')).status, 401);
  assert.equal((await j('/dashboard/overview', { headers: { 'x-access-code': 'letmein' } })).status, 200);
});
test('errors do not leak internals', async () => {
  const r = await j('/nope'); assert.equal(r.status, 404); assert.equal(r.body.success, false); assert.ok(!JSON.stringify(r.body).includes('stack'));
});
