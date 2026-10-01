import type { BiometricIndicators } from '../types';

export interface MonitoringSummary {
  current: { score: number; trend: string; delta: number | null; baseline: number | null; coldStart: boolean; signals: Record<string, number | undefined> } | null;
  assessmentCount: number;
}

/** Maps backend monitoring onto the existing BiometricIndicators shape the UI already renders. */
export function toBiometrics(m: MonitoringSummary, prev: BiometricIndicators): BiometricIndicators {
  const c = m.current;
  if (!c) return prev;
  const stateByTrend: Record<string, string> = { improving: 'Settling', stable: c.coldStart ? 'Calibrating' : 'Anchored', deteriorating: 'Rising', rapid_deterioration: 'Sharp rise' };
  return {
    ...prev,
    distressIndex: Math.round(c.score),
    stabilityQuotient: Math.max(0, Math.min(100, Math.round(100 - c.score))),
    wellbeingScore: Math.max(0, Math.min(100, Math.round(100 - c.score))),
    deviationVariance: Math.round(c.delta ?? 0),
    stabilityState: stateByTrend[c.trend] ?? 'Calibrating',
    calibratedLogs: m.assessmentCount,
    stressResponse: c.signals.stress !== undefined ? Math.round(c.signals.stress * 100) : prev.stressResponse,
    sleepIntegrity: c.signals.sleepDifficulty !== undefined ? Math.round(100 - c.signals.sleepDifficulty * 100) : prev.sleepIntegrity,
  };
}
