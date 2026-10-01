/** Thin client for the DYNA MIND backend. Holds only a session token issued by the server; no secrets. */
const KEY = 'dynamind.session.v1';

export interface Session { userId: string; token: string; sessionId: string; displayName: string }

export class ApiError extends Error {
  status: number; code: string;
  constructor(status: number, code: string, message: string) { super(message); this.status = status; this.code = code; }
}

function readStored(): Partial<Session> {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
}
function store(s: Session) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage unavailable: session lives for this page only */ } }

let current: Session | null = null;
let pending: Promise<Session> | null = null;

async function raw<T>(path: string, init: RequestInit & { token?: string } = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (init.token) headers.Authorization = `Bearer ${init.token}`;
  let res: Response;
  try { res = await fetch(`/api${path}`, { ...init, headers }); }
  catch { throw new ApiError(0, 'NETWORK_ERROR', 'Cannot reach the server. Check your connection and try again.'); }
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.success) throw new ApiError(res.status, body?.error?.code ?? 'HTTP_' + res.status, body?.error?.message ?? 'Request failed');
  return body.data as T;
}

/** Create (or resume after refresh) the pseudonymous session. Safe to call repeatedly. */
export function ensureSession(): Promise<Session> {
  if (current) return Promise.resolve(current);
  if (!pending) {
    const saved = readStored();
    const sessionId = saved.sessionId ?? crypto.randomUUID();
    pending = raw<Session & { resumed: boolean }>('/session', { method: 'POST', body: JSON.stringify({ token: saved.token, sessionId, displayName: saved.displayName }) })
      .then((d) => { current = { userId: d.userId, token: d.token, sessionId: d.sessionId, displayName: d.displayName }; store(current); return current; })
      .finally(() => { pending = null; });
  }
  return pending;
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const s = await ensureSession();
  try { return await raw<T>(path, { ...init, token: s.token }); }
  catch (e) {
    // Token no longer valid (e.g. server DB was reset): drop it and start a fresh session once.
    if (e instanceof ApiError && (e.status === 401 || e.code === 'USER_NOT_FOUND')) {
      current = null; try { localStorage.removeItem(KEY); } catch { /* ignore */ }
      const s2 = await ensureSession();
      return raw<T>(path, { ...init, token: s2.token });
    }
    throw e;
  }
}

export function startNewConversation(): Session {
  if (!current) throw new Error('No session');
  current = { ...current, sessionId: crypto.randomUUID() }; store(current); return current;
}
export const getSession = () => current;
