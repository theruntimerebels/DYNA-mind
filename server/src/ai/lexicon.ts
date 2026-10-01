/** Deterministic text analysis used (a) when no Gemini key/AI failure and (b) for check-in free text. */
const NEG: Record<string, number> = {
  overwhelmed: 0.8, hopeless: 0.9, terrified: 0.9, panic: 0.85, anxious: 0.7, afraid: 0.7, scared: 0.7, dread: 0.7,
  exhausted: 0.6, tired: 0.4, worried: 0.55, stressed: 0.6, tense: 0.5, tight: 0.4, sad: 0.55, alone: 0.5, angry: 0.5,
  numb: 0.6, foggy: 0.4, helpless: 0.8, crying: 0.6, awful: 0.6, terrible: 0.6, worse: 0.5, trapped: 0.8,
};
const POS: Record<string, number> = { calm: 0.6, better: 0.5, relieved: 0.6, steady: 0.5, grounded: 0.6, okay: 0.3, fine: 0.3, good: 0.5, hopeful: 0.6, rested: 0.5 };
const SLEEP = /\b(can'?t sleep|couldn'?t sleep|insomnia|no sleep|barely slept|woke up|nightmares?|sleepless|restless night)\b/i;
const STRESS = /\b(stress(ed)?|pressure|overwhelm(ed)?|too much|can'?t cope|on edge|tense)\b/i;
const TRIGGERS: [RegExp, string][] = [
  [/\b(court|hearing|trial|judge|testif\w*|cross[-\s]?exam\w*)\b/i, 'court proceedings'],
  [/\b(delay|postpone\w*|adjourn\w*|waiting|no update|uncertain\w*)\b/i, 'delays or uncertainty'],
  [/\b(threat\w*|intimidat\w*|following me|stalk\w*)\b/i, 'threats or intimidation'],
  [/\b(money|rent|bills?|financ\w*|job|income|debt)\b/i, 'financial strain'],
  [/\b(family|neighbou?rs?|community|friends?|ostraci\w*|judged|blamed|stigma)\b/i, 'social pressure'],
  [/\b(sleep|insomnia|nightmares?)\b/i, 'sleep disruption'],
];

export interface LexAnalysis { emotionalIntensity: number; sentiment: number; stress: number | null; sleepDifficulty: number | null; triggers: string[]; emotion: string }

export function analyseText(text: string): LexAnalysis {
  const words = text.toLowerCase().match(/[a-z']+/g) ?? [];
  let neg = 0, pos = 0, topNeg = '', topW = 0;
  for (const w of words) {
    if (NEG[w]) { neg += NEG[w]; if (NEG[w] > topW) { topW = NEG[w]; topNeg = w; } }
    if (POS[w]) pos += POS[w];
  }
  const emotionalIntensity = Math.min(1, neg / 2);
  const sentiment = Math.max(-1, Math.min(1, (pos - neg) / Math.max(1, pos + neg)));
  return {
    emotionalIntensity, sentiment,
    stress: STRESS.test(text) ? Math.max(0.5, emotionalIntensity) : null,
    sleepDifficulty: SLEEP.test(text) ? 0.7 : null,
    triggers: TRIGGERS.filter(([re]) => re.test(text)).map(([, n]) => n),
    emotion: topNeg || (pos > 0 ? 'settled' : 'neutral'),
  };
}

export const NEGATIVE_CHECKIN_EMOTIONS: Record<string, number> = { 'Court Stress': 0.7, Overwhelmed: 0.9, 'Somatic Tension': 0.6, Foggy: 0.5 };
export const POSITIVE_CHECKIN_EMOTIONS = ['Grounded', 'Steady', 'Relieved'];
