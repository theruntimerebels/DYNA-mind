/**
 * Chat/voice/TTS client. Name kept for compatibility with existing imports, but nothing here
 * talks to Gemini directly: every call goes to the DYNA MIND backend, which holds the API key.
 */
import { ChatMessage, BiometricIndicators } from '../types';
import { api, ensureSession, ApiError } from './api';

export interface ChatResult {
  sessionId: string; message: string;
  analysis: { emotion: string; distressSignal: number; riskLevel: 'low' | 'moderate' | 'high' | 'critical'; triggers: string[]; requiresFollowUp: boolean };
  monitoring: { distressScore: number; trend: string; change: number; baseline: number | null; coldStart: boolean; confidence: number };
  safety: { level: 'elevated' | 'critical'; guidance: string } | null;
  ai: { source: 'gemini' | 'fallback' };
}

let listener: ((r: ChatResult) => void) | null = null;
/** App registers here to refresh distress/trend widgets and react to safety signals after each turn. */
export function onChatResult(cb: ((r: ChatResult) => void) | null) { listener = cb; }

async function turn(message: string, mode: 'text' | 'voice', contextTag?: string): Promise<string> {
  const s = await ensureSession();
  const data = await api<ChatResult>('/chat', { method: 'POST', body: JSON.stringify({ sessionId: s.sessionId, message, mode, contextTag }) });
  listener?.(data);
  return data.message;
}

// Extra parameters are accepted for call-site compatibility; the server owns history and context.
export async function sendChatMessageToGemini(
  _history: ChatMessage[], newMessage: string, _biometrics?: BiometricIndicators, _systemInstruction?: string
): Promise<string> {
  return turn(newMessage, 'text');
}

export async function sendVoiceTurnToGemini(transcript: string, _history: ChatMessage[]): Promise<string> {
  return turn(transcript, 'voice', 'Voice Session');
}

export function describeError(e: unknown): string {
  if (e instanceof ApiError) return e.code === 'AI_SERVICE_UNAVAILABLE' ? 'The assistant is temporarily unavailable. Please try again in a moment.' : e.message;
  return 'Something went wrong. Please try again.';
}

export async function speakVoiceTurn(text: string): Promise<void> {
  try {
    const { audio, sampleRate } = await api<{ audio: string; sampleRate: number }>('/tts', { method: 'POST', body: JSON.stringify({ text }) });
    if (audio) { playPcmAudio(audio, sampleRate || 24000); return; }
  } catch { /* server TTS not configured/unavailable -> browser speech below */ }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.rate = 0.9; window.speechSynthesis.speak(u);
  }
}

function playPcmAudio(base64Data: string, sampleRate: number) {
  try {
    const bin = atob(base64Data); const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const int16 = new Int16Array(bytes.buffer);
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate });
    const buf = ctx.createBuffer(1, int16.length, sampleRate); const ch = buf.getChannelData(0);
    for (let i = 0; i < int16.length; i++) ch[i] = int16[i] / 32768;
    const src = ctx.createBufferSource(); src.buffer = buf; src.connect(ctx.destination); src.start();
  } catch (e) { console.warn('Audio playback failed', e); }
}
