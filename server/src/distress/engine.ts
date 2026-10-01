/**
 * DYNA MIND distress engine (deterministic, no I/O).
 *
 * PROTOTYPE DECISION-SUPPORT LOGIC. Weights and thresholds below are NOT clinically
 * validated. They exist to make change-over-time visible to a human reviewer.
 */
import type { Signals, Trend, RiskLevel, SafetyLevel } from '../types.ts';

export const WEIGHTS: Record<keyof Signals, number> = {
  somatic: 0.25, stress: 0.15, sleepDifficulty: 0.15, emotionalIntensity: 0.2,
  negativeSentiment: 0.1, fearSafety: 0.1, engagementDrop: 0.05,
};
export const MIN_HISTORY_FOR_BASELINE = 5;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const median = (a: number[]) => {
  const s = [...a].sort((x, y) => x - y); const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const round1 = (n: number) => Math.round(n * 10) / 10;

/** CurrentDistress = 100 * sum(w_i * s_i) / sum(w_i) over the signals actually observed. */
export function scoreSignals(signals: Signals) {
  let num = 0, den = 0, totalW = 0;
  const parts: { signal: string; contribution: number }[] = [];
  const keys = Object.keys(WEIGHTS) as (keyof Signals)[];
  for (const k of keys) {
    totalW += WEIGHTS[k];
    const v = signals[k];
    if (typeof v !== 'number' || Number.isNaN(v)) continue;
    num += WEIGHTS[k] * clamp(v, 0, 1); den += WEIGHTS[k];
  }
  if (den === 0) return { score: 0, coverage: 0, contributing: parts };
  for (const k of keys) {
    const v = signals[k];
    if (typeof v === 'number') parts.push({ signal: k, contribution: round1((100 * WEIGHTS[k] * clamp(v, 0, 1)) / den) });
  }
  parts.sort((a, b) => b.contribution - a.contribution);
  return { score: round1((100 * num) / den), coverage: den / totalW, contributing: parts };
}

export interface TemporalResult {
  previousScore: number | null; delta: number | null; rollingAverage: number | null;
  baseline: number | null; baselineDeviation: number | null; coldStart: boolean;
  consecutiveDeteriorating: number; suddenChange: boolean; trend: Trend;
}

/** `priorScores` are earlier scores, oldest -> newest, NOT including the current one. */
export function analyseTemporal(current: number, priorScores: number[]): TemporalResult {
  const n = priorScores.length;
  const previousScore = n ? priorScores[n - 1] : null;
  const delta = previousScore === null ? null : round1(current - previousScore);
  const recent = priorScores.slice(-4);
  const rollingAverage = recent.length ? round1([...recent, current].reduce((a, b) => a + b, 0) / (recent.length + 1)) : null;

  const coldStart = n < MIN_HISTORY_FOR_BASELINE;
  let baseline: number | null = null, baselineDeviation: number | null = null;
  if (!coldStart) {
    baseline = round1(median(priorScores));
    const mad = median(priorScores.map((s) => Math.abs(s - baseline!)));
    const spread = Math.max(mad * 1.4826, 5); // floor: a very flat history must not make tiny moves look huge
    baselineDeviation = round1((current - baseline) / spread);
  }

  const series = [...priorScores, current];
  let consecutive = 0;
  for (let i = series.length - 1; i > 0 && series[i] - series[i - 1] >= 2; i--) consecutive++;

  const suddenChange = (delta !== null && delta >= 15) || (baselineDeviation !== null && baselineDeviation >= 2.5);
  let trend: Trend = 'stable';
  if (delta === null) trend = 'stable';
  else if (delta >= 15 || (baselineDeviation !== null && baselineDeviation >= 2.5 && delta >= 10)) trend = 'rapid_deterioration';
  else if (delta >= 5 || (consecutive >= 2 && current - series[series.length - 1 - consecutive] >= 6)) trend = 'deteriorating';
  else if (delta <= -5) trend = 'improving';
  return { previousScore, delta, rollingAverage, baseline, baselineDeviation, coldStart, consecutiveDeteriorating: consecutive, suddenChange, trend };
}

export interface RiskInput { score: number; temporal: TemporalResult; safetyLevel: SafetyLevel; }
export interface RiskResult { riskLevel: RiskLevel; reasons: string[]; requiresFollowUp: boolean; }

/** Transparent rules. Categories are decision-support labels, not diagnoses. */
export function classifyRisk({ score, temporal: t, safetyLevel }: RiskInput): RiskResult {
  if (safetyLevel === 'critical') {
    return { riskLevel: 'critical', reasons: ['Explicit self-harm or immediate-safety statement detected (rule-based scan)'], requiresFollowUp: true };
  }
  const reasons: string[] = [];
  const order: RiskLevel[] = ['low', 'moderate', 'high', 'critical'];
  let level: RiskLevel = 'low';
  const raise = (l: RiskLevel, why: string) => {
    if (order.indexOf(l) > order.indexOf(level)) level = l;
    reasons.push(why);
  };
  if (safetyLevel === 'elevated') raise('high', 'User reported fear for personal safety or intimidation');
  if (t.trend === 'rapid_deterioration') raise('high', `Rapid deterioration (change ${t.delta ?? 'n/a'} points)`);
  if (t.consecutiveDeteriorating >= 3 && score >= 50) raise('high', `${t.consecutiveDeteriorating} consecutive increases with elevated score`);
  if (!t.coldStart && t.baselineDeviation !== null && t.baselineDeviation >= 3) raise('high', 'Score far above personal baseline');
  else if (!t.coldStart && t.baselineDeviation !== null && t.baselineDeviation >= 1.5) raise('moderate', 'Score meaningfully above personal baseline');
  if (t.trend === 'deteriorating') raise('moderate', 'Deteriorating trend versus recent check-ins');
  if (t.rollingAverage !== null && t.rollingAverage >= 55) raise('moderate', 'Persistently elevated rolling average');
  if (t.coldStart && score >= 70) raise('high', 'High score during cold start (no personal baseline yet; prototype absolute threshold)');
  else if (t.coldStart && score >= 55) raise('moderate', 'Elevated score during cold start (no personal baseline yet; prototype absolute threshold)');
  return { riskLevel: level, reasons, requiresFollowUp: level !== 'low' };
}

/** Confidence in the assessment: signal coverage x history depth, 0..1. */
export function confidenceOf(coverage: number, historyCount: number) {
  const depth = Math.min(1, historyCount / MIN_HISTORY_FOR_BASELINE);
  return Math.round(clamp(0.6 * coverage + 0.4 * depth, 0, 1) * 100) / 100;
}
