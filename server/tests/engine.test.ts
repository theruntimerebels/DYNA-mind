import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreSignals, analyseTemporal, classifyRisk } from '../src/distress/engine.ts';
import { scanSafety } from '../src/safety/safety.ts';

test('score renormalises over observed signals only', () => {
  const a = scoreSignals({ somatic: 0.5 });
  assert.equal(a.score, 50);
  const b = scoreSignals({ somatic: 1, stress: 1, sleepDifficulty: 1, emotionalIntensity: 1, negativeSentiment: 1, fearSafety: 1, engagementDrop: 1 });
  assert.equal(b.score, 100);
  assert.equal(scoreSignals({}).score, 0);
});

test('35,38,42 -> 58 is flagged as rapid deterioration', () => {
  const t = analyseTemporal(58, [35, 38, 42]);
  assert.equal(t.delta, 16);
  assert.equal(t.suddenChange, true);
  assert.equal(t.trend, 'rapid_deterioration');
  assert.equal(t.coldStart, true);
  assert.equal(t.consecutiveDeteriorating, 3);
  const r = classifyRisk({ score: 58, temporal: t, safetyLevel: 'none' });
  assert.equal(r.riskLevel, 'high');
  assert.equal(r.requiresFollowUp, true);
});

test('personal baseline: same score is normal for a high-baseline person, abnormal for a low one', () => {
  const lowHist = [30, 32, 31, 29, 33, 30];
  const highHist = [62, 60, 64, 61, 63, 62];
  const lo = analyseTemporal(62, lowHist);
  const hi = analyseTemporal(62, highHist);
  assert.equal(lo.coldStart, false);
  assert.ok(lo.baselineDeviation! >= 3);
  assert.ok(Math.abs(hi.baselineDeviation!) < 1);
  assert.equal(classifyRisk({ score: 62, temporal: lo, safetyLevel: 'none' }).riskLevel, 'high');
  assert.equal(classifyRisk({ score: 62, temporal: hi, safetyLevel: 'none' }).riskLevel, 'moderate'); // rolling avg >= 55
});

test('first ever check-in is cold start with no delta', () => {
  const t = analyseTemporal(40, []);
  assert.equal(t.coldStart, true);
  assert.equal(t.delta, null);
  assert.equal(t.trend, 'stable');
});

test('improving and stable trends', () => {
  assert.equal(analyseTemporal(40, [50]).trend, 'improving');
  assert.equal(analyseTemporal(41, [40]).trend, 'stable');
});

test('critical safety statements override everything', () => {
  const t = analyseTemporal(10, [10, 10, 10, 10, 10]);
  assert.equal(classifyRisk({ score: 10, temporal: t, safetyLevel: 'critical' }).riskLevel, 'critical');
  assert.equal(scanSafety('I want to kill myself').level, 'critical');
  assert.equal(scanSafety('I feel like there is no reason to go on').level, 'critical');
  assert.equal(scanSafety('someone is following me and I feel unsafe').level, 'elevated');
  assert.equal(scanSafety('Tuesday hearing is making me tense').level, 'none');
});
