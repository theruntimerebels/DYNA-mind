import { randomUUID } from 'node:crypto';
import type { Store } from '../store/types.ts';
import type { AiService } from '../ai/gemini.ts';
import type { Env } from '../config/env.ts';
import type { Message, Signals } from '../types.ts';
import { scanSafety } from '../safety/safety.ts';
import { assess, engagementDrop, summaryForPrompt } from './monitoring.ts';
import { AppError } from '../utils/errors.ts';

const CRITICAL_REPLY = (guidance: string) =>
  `I'm really glad you told me, and I'm sorry things feel this heavy. I'm not able to keep you safe myself, and I haven't contacted anyone. ${guidance} If you can, please tell someone near you right now so you are not alone with this.`;

export interface ChatInput { userId: string; sessionId: string; message: string; mode: 'text' | 'voice'; contextTag?: string }

export async function handleChat(deps: { store: Store; ai: AiService; env: Env }, i: ChatInput) {
  const { store, ai, env } = deps;
  const user = await store.getUser(i.userId);
  if (!user) throw new AppError(404, 'USER_NOT_FOUND', 'Unknown user. Start a new session.');
  const existing = await store.getConversation(i.sessionId);
  if (existing && existing.userId !== i.userId) throw new AppError(403, 'FORBIDDEN', 'Session does not belong to this user.');

  const safety = scanSafety(i.message);
  const history = (existing?.messages ?? []).map((m) => ({ sender: m.sender, text: m.text }));
  const prior = await store.listAssessments(i.userId, 200);

  const { turn, source } = await ai.respond(i.message, {
    displayName: user.displayName, mode: i.mode, history, monitoringSummary: await summaryForPrompt(store, i.userId),
  });

  const reply = safety.level === 'critical' ? CRITICAL_REPLY(env.CRISIS_GUIDANCE) : turn.message;
  const fear = Math.max(turn.fearSafety ?? 0, safety.level === 'elevated' ? 0.8 : 0, safety.level === 'critical' ? 1 : 0);
  const signals: Signals = {
    emotionalIntensity: turn.emotionalIntensity,
    negativeSentiment: (1 - turn.sentiment) / 2,
    ...(turn.stress !== null && { stress: turn.stress }),
    ...(turn.sleepDifficulty !== null && { sleepDifficulty: turn.sleepDifficulty }),
    ...(fear > 0 && { fearSafety: fear }),
  };
  const drop = engagementDrop(prior.filter((p) => p.sessionKey !== i.sessionKey));
  if (drop !== undefined) signals.engagementDrop = drop;

  const t = new Date().toISOString();
  const msgs: Message[] = [
    { id: randomUUID(), sender: 'user', text: i.message, timestamp: t, contextTag: i.contextTag },
    { id: randomUUID(), sender: 'companion', text: reply, timestamp: new Date().toISOString() },
  ];
  await store.appendMessages(i.sessionId, i.userId, msgs, i.mode);
  await store.touchUser(i.userId);

  const result = await assess(store, { userId: i.userId, sessionKey: i.sessionId, source: 'chat', signals, triggers: turn.triggers, safetyLevel: safety.level });
  const a = result.assessment;
  return {
    sessionId: i.sessionId, message: reply, messageId: msgs[1].id,
    analysis: { emotion: turn.emotion, distressSignal: a.score, riskLevel: a.riskLevel, triggers: a.triggers, requiresFollowUp: result.requiresFollowUp },
    monitoring: { distressScore: a.score, trend: a.trend, change: a.delta ?? 0, baseline: a.baseline, coldStart: a.coldStart, confidence: a.confidence, rollingAverage: a.rollingAverage },
    safety: safety.level === 'none' ? null : { level: safety.level, guidance: env.CRISIS_GUIDANCE },
    ai: { source },
  };
}
