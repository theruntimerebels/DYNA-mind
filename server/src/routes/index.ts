import { Router } from 'express';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import rateLimit from 'express-rate-limit';
import type { Env } from '../config/env.ts';
import type { Store } from '../store/types.ts';
import type { AiService } from '../ai/gemini.ts';
import { asyncH, validate, userAuth, counsellorAuth, selfOrCounsellor } from '../middleware/index.ts';
import { signUser, verifyToken } from '../utils/session.ts';
import { handleChat } from '../services/chat.ts';
import { recordCheckIn } from '../services/checkin.ts';
import { monitoringFor } from '../services/monitoring.ts';
import * as dash from '../services/dashboard.ts';
import { AppError, notFound } from '../utils/errors.ts';

const ok = (data: unknown) => ({ success: true, data });
const uuid = z.string().uuid();
const slider = z.number().int().min(0).max(10);

const SessionBody = z.object({ displayName: z.string().trim().min(1).max(80).optional(), token: z.string().max(300).optional(), sessionId: uuid.optional() });
const ChatBody = z.object({ sessionId: uuid, message: z.string().trim().min(1).max(2000), mode: z.enum(['text', 'voice']).default('text'), contextTag: z.string().max(60).optional() });
const CheckInBody = z.object({
  userId: uuid.optional(),
  emotions: z.array(z.string().max(40)).max(12).default([]),
  somatic: z.object({ chest: slider, jaw: slider, sleep: slider }),
  trigger: z.string().trim().max(80).default(''),
  notes: z.string().max(2000).default(''),
});
const UserParam = z.object({ userId: uuid });
const SessionParam = z.object({ sessionId: uuid });
const FollowUpBody = z.object({ status: z.enum(['acknowledged', 'in_progress', 'resolved']), note: z.string().trim().max(1000).default(''), by: z.string().trim().max(80).default('counsellor') });
const TtsBody = z.object({ text: z.string().trim().min(1).max(500) });

export function buildRouter(deps: { env: Env; store: Store; ai: AiService }) {
  const { env, store, ai } = deps;
  const r = Router();
  const user = userAuth(env), counsellor = counsellorAuth(env), self = selfOrCounsellor(env);
  const aiLimit = rateLimit({ windowMs: 60_000, limit: 20, standardHeaders: true, legacyHeaders: false,
    handler: (_q, res) => void res.status(429).json({ success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Please wait a moment.' } }) });

  r.get('/health', asyncH(async (_q, res) => {
    res.json(ok({ status: 'ok', storeMode: store.mode, persistent: store.mode === 'mongo', aiConfigured: ai.available, aiMode: ai.available ? 'gemini' : 'fallback', time: new Date().toISOString() }));
  }));

  // Create a pseudonymous user + session, or resume with a previously issued token.
  r.post('/session', validate(SessionBody), asyncH(async (req, res) => {
    const b = req.body as z.infer<typeof SessionBody>;
    const sessionId = b.sessionId ?? randomUUID();
    if (b.token) {
      const uid = verifyToken(b.token, env.SESSION_SECRET);
      const existing = uid ? await store.getUser(uid) : null;
      if (existing) { await store.touchUser(existing.id); return void res.json(ok({ userId: existing.id, displayName: existing.displayName, token: b.token, sessionId, resumed: true })); }
    }
    const u = await store.createUser(b.displayName ?? 'Friend');
    res.status(201).json(ok({ userId: u.id, displayName: u.displayName, token: signUser(u.id, env.SESSION_SECRET), sessionId, resumed: false }));
  }));

  r.post('/chat', aiLimit, user, validate(ChatBody), asyncH(async (req, res) => {
    const b = req.body as z.infer<typeof ChatBody>;
    res.json(ok(await handleChat({ store, ai, env }, { userId: req.userId!, sessionId: b.sessionId, message: b.message, mode: b.mode, contextTag: b.contextTag })));
  }));

  r.get('/sessions', user, asyncH(async (req, res) => { res.json(ok(await store.listSessions(req.userId!))); }));

  r.get('/conversations/:sessionId', user, validate(SessionParam, 'params'), asyncH(async (req, res) => {
    const c = await store.getConversation(req.params.sessionId);
    if (!c) return void res.json(ok({ sessionId: req.params.sessionId, messages: [] })); // a brand-new session has no messages yet
    if (c.userId !== req.userId) throw new AppError(403, 'FORBIDDEN', 'Not allowed to access this conversation.');
    res.json(ok({ sessionId: c.sessionId, messages: c.messages, metadata: c.metadata }));
  }));

  r.post('/checkins', user, validate(CheckInBody), asyncH(async (req, res) => {
    const b = req.body as z.infer<typeof CheckInBody>;
    if (b.userId && b.userId !== req.userId) throw new AppError(403, 'FORBIDDEN', 'Cannot submit for another user.');
    const { checkIn, assessment } = await recordCheckIn(store, { userId: req.userId!, emotions: b.emotions, somatic: b.somatic, trigger: b.trigger, notes: b.notes });
    res.status(201).json(ok({ checkIn, monitoring: await monitoringFor(store, req.userId!), assessment }));
  }));

  r.get('/checkins/:userId', validate(UserParam, 'params'), self, asyncH(async (req, res) => {
    const strip = req.role === 'counsellor';
    const list = await store.listCheckIns(req.params.userId, 100);
    res.json(ok(strip ? list.map((c) => ({ ...c, responses: { ...c.responses, notes: undefined } })) : list));
  }));

  r.get('/monitoring/:userId', validate(UserParam, 'params'), self, asyncH(async (req, res) => {
    if (!(await store.getUser(req.params.userId))) throw notFound('User');
    res.json(ok(await monitoringFor(store, req.params.userId)));
  }));

  // User-initiated deletion of their own data (backs the app's "purge" control).
  r.delete('/me', user, asyncH(async (req, res) => { await store.deleteUserData(req.userId!); res.json(ok({ deleted: true })); }));

  r.post('/tts', aiLimit, user, validate(TtsBody), asyncH(async (req, res) => {
    const audio = await ai.tts((req.body as z.infer<typeof TtsBody>).text);
    if (!audio) throw new AppError(501, 'TTS_UNAVAILABLE', 'Server speech is not configured; use browser speech.');
    res.json(ok(audio));
  }));

  r.get('/dashboard/overview', counsellor, asyncH(async (_q, res) => { res.json(ok(await dash.overview(store))); }));
  r.get('/dashboard/cases', counsellor, asyncH(async (_q, res) => { res.json(ok(await dash.cases(store))); }));
  r.get('/dashboard/cases/:userId', counsellor, validate(UserParam, 'params'), asyncH(async (req, res) => { res.json(ok(await dash.caseDetail(store, req.params.userId))); }));
  r.post('/dashboard/cases/:userId/follow-up', counsellor, validate(UserParam, 'params'), validate(FollowUpBody), asyncH(async (req, res) => {
    const b = req.body as z.infer<typeof FollowUpBody>;
    res.json(ok(await dash.updateFollowUp(store, req.params.userId, b.status, b.note, b.by)));
  }));
  return r;
}
