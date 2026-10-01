/**
 * Deterministic safety scan. Runs on every user text independently of the LLM, so the
 * model can never downgrade a crisis statement. Pattern lists are a prototype and will
 * miss paraphrases; they are a floor, not a guarantee.
 */
import type { SafetyLevel } from '../types.ts';

const CRITICAL: RegExp[] = [
  /\b(kill|end|take)\s+(myself|my\s+own\s+life|my\s+life)\b/i,
  /\bsuicid(e|al)\b/i,
  /\bwant(ed)?\s+to\s+die\b/i,
  /\b(better|easier)\s+(off\s+)?(if\s+i\s+(was|were)\s+)?dead\b/i,
  /\bno\s+reason\s+to\s+(live|go\s+on)\b/i,
  /\b(hurt|harm|cut)\s+myself\b/i,
  /\bself[-\s]?harm\b/i,
  /\bdon'?t\s+want\s+to\s+(be\s+here|live|exist)\b/i,
  /\bend\s+it\s+all\b/i,
];
const ELEVATED: RegExp[] = [
  /\b(threat(en(ed|ing)?)?|intimidat\w*)\b/i,
  /\b(afraid|scared|fear)\b.{0,40}\b(for\s+my\s+(life|safety)|they\s+will\s+(hurt|find|attack))/i,
  /\b(following|stalking|watching)\s+me\b/i,
  /\bnot\s+safe\b/i,
  /\bunsafe\b/i,
  /\bthey\s+(know|found)\s+where\s+i\s+live\b/i,
];

export function scanSafety(text: string): { level: SafetyLevel; matched: string[] } {
  if (CRITICAL.some((re) => re.test(text))) return { level: 'critical', matched: ['self_harm_or_immediate_safety'] };
  if (ELEVATED.some((re) => re.test(text))) return { level: 'elevated', matched: ['personal_safety_concern'] };
  return { level: 'none', matched: [] };
}
