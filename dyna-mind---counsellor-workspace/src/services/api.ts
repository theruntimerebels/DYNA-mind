/** Counsellor API client. The access code is entered by the counsellor and kept in sessionStorage only. */
const KEY = 'dynamind.counsellor.code';

export class ApiError extends Error {
  status: number; code: string;
  constructor(status: number, code: string, message: string) { super(message); this.status = status; this.code = code; }
}

async function call<T>(path: string, init: RequestInit = {}, retried = false): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const code = sessionStorage.getItem(KEY);
  if (code) headers['x-access-code'] = code;
  let res: Response;
  try { res = await fetch(`/api${path}`, { ...init, headers }); }
  catch { throw new ApiError(0, 'NETWORK_ERROR', 'Cannot reach the DYNA MIND server.'); }
  const body = await res.json().catch(() => null);
  if (res.status === 401 && !retried) {
    const entered = window.prompt('Counsellor access code');
    if (entered) { sessionStorage.setItem(KEY, entered); return call<T>(path, init, true); }
  }
  if (!res.ok || !body?.success) throw new ApiError(res.status, body?.error?.code ?? 'HTTP_' + res.status, body?.error?.message ?? 'Request failed');
  return body.data as T;
}

export interface CaseRow {
  userId: string; displayName: string; lastActiveAt: string; riskLevel: 'low' | 'moderate' | 'high' | 'critical' | null;
  distressScore: number | null; trend: string | null; delta: number | null; baseline: number | null; coldStart: boolean;
  lastAssessmentAt: string | null; followUp: { id: string; status: string; severity: string } | null;
}
export interface CaseDetail {
  user: { userId: string; displayName: string };
  monitoring: {
    current: { score: number; riskLevel: string; escalationReasons: string[]; contributing: { signal: string; contribution: number }[]; safetyLevel: string } | null;
    history: { timestamp: string; score: number }[]; recurringStressors: { trigger: string; count: number }[]; insufficientData: boolean;
  };
  followUps: { status: string; reason: string; signalSummary: string }[];
}
export interface Overview { storeMode: string; totalMonitored: number; byRisk: Record<string, number>; requiringFollowUp: number; recentCheckIns: unknown[]; recentAlerts: { userId: string; displayName: string; severity: string; reason: string; updatedAt: string }[] }

export const getOverview = () => call<Overview>('/dashboard/overview');
export const getCases = () => call<CaseRow[]>('/dashboard/cases');
export const getCase = (id: string) => call<CaseDetail>(`/dashboard/cases/${id}`);
export const updateFollowUp = (userId: string, status: 'acknowledged' | 'in_progress' | 'resolved', note: string) =>
  call(`/dashboard/cases/${userId}/follow-up`, { method: 'POST', body: JSON.stringify({ status, note, by: 'counsellor' }) });
