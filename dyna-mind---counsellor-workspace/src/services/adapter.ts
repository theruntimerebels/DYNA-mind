import type { AssessmentRecord } from '../types';
import { getCases, getCase, getOverview, type CaseRow, type CaseDetail, type Overview } from './api';

const LABEL: Record<string, string> = {
  somatic: 'Physical tension (self-reported)', stress: 'Stress', sleepDifficulty: 'Sleep difficulty',
  emotionalIntensity: 'Emotional intensity', negativeSentiment: 'Negative sentiment', fearSafety: 'Fear / safety concern', engagementDrop: 'Engagement change',
};
const shortId = (id: string) => '#DM-' + id.replace(/-/g, '').slice(0, 4).toUpperCase();

/** Maps backend cases onto the existing AssessmentRecord shape so current table/modals work unchanged. */
export function toRecord(c: CaseRow, d?: CaseDetail): AssessmentRecord {
  const has = c.distressScore !== null;
  const risk = c.riskLevel ?? 'low';
  const fu = c.followUp;
  const hot = risk === 'high' || risk === 'critical';
  const status: AssessmentRecord['status'] = !has ? 'PENDING'
    : fu && hot && fu.status === 'open' ? 'FLAGGED'
    : fu && fu.status === 'open' ? 'NEEDS_REVIEW'
    : 'REVIEWED';
  const statusLabel = !has ? 'No data yet' : status === 'FLAGGED' ? 'Flagged for Review' : status === 'NEEDS_REVIEW' ? 'Needs Review'
    : fu ? 'Follow-up ' + fu.status.replace('_', ' ') : 'No follow-up needed';
  const cur = d?.monitoring.current;
  return {
    id: c.userId, caseId: shortId(c.userId), clientName: c.displayName,
    scaleType: 'WELLBEING', scaleName: 'DYNA Distress Index', scaleSubtitle: 'Longitudinal, personal-baseline monitoring',
    badgeCode: 'DM', badgeBg: hot ? 'bg-[#ffdad6]' : 'bg-[#e3e1ec]', badgeColor: hot ? 'text-[#93000a]' : 'text-[#780037]',
    completedAt: c.lastAssessmentAt ? new Date(c.lastAssessmentAt).toLocaleString() : '—',
    scoreText: has ? `${Math.round(c.distressScore!)}/100` : '—', rawScore: has ? c.distressScore! : undefined, maxScore: 100,
    deltaText: c.delta !== null ? `${c.delta >= 0 ? '+' : ''}${Math.round(c.delta)} pt change` : undefined,
    scoreTag: !has ? 'No data' : c.delta !== null && c.delta >= 5 ? `+${Math.round(c.delta)} pt change` : risk === 'low' ? 'Within range' : risk[0].toUpperCase() + risk.slice(1),
    scoreTagStyle: !has ? 'pending' : hot ? 'elevated' : c.delta !== null && c.delta >= 5 ? 'delta' : risk === 'moderate' ? 'mild' : 'optimal',
    indicationText: !has ? 'Awaiting first check-in' : `${(c.trend ?? 'stable').replace('_', ' ')} trend; ${c.coldStart ? 'building personal baseline' : `personal baseline ${c.baseline}`}`,
    status, statusLabel,
    actionType: status === 'FLAGGED' ? 'clinical_review' : status === 'NEEDS_REVIEW' ? 'review' : status === 'PENDING' ? 'send_reminder' : 'view_summary',
    actionLabel: status === 'FLAGGED' ? 'Clinical Review' : status === 'NEEDS_REVIEW' ? 'Review' : status === 'PENDING' ? 'Send Reminder' : 'View Summary',
    actionStyle: status === 'FLAGGED' ? 'error' : status === 'NEEDS_REVIEW' ? 'primary' : status === 'PENDING' ? 'reminder' : 'default',
    historyTrajectory: d?.monitoring.history.slice(-8).map((h) => Math.round(h.score)),
    responses: cur?.contributing.map((s, i) => ({ questionNumber: i + 1, questionText: LABEL[s.signal] ?? s.signal, responseScore: Math.round(s.contribution), responseLabel: `${s.contribution} points of the score`, isCriticalAlert: s.signal === 'fearSafety' && cur.safetyLevel !== 'none' })),
    clinicalNotes: d ? [
      cur?.escalationReasons.length ? `Rule-based flags: ${cur.escalationReasons.join('; ')}.` : 'No escalation rules triggered.',
      d.monitoring.recurringStressors.length ? `Recurring stressors: ${d.monitoring.recurringStressors.map((s) => `${s.trigger} (${s.count}x)`).join(', ')}.` : '',
      d.monitoring.insufficientData ? 'Insufficient history for a personal baseline (cold start).' : '',
      'Prototype decision-support output, not a diagnosis.',
    ].filter(Boolean).join(' ') : undefined,
  };
}

export interface DashboardData { records: AssessmentRecord[]; overview: Overview }

export async function loadDashboard(): Promise<DashboardData> {
  const [cases, overview] = await Promise.all([getCases(), getOverview()]);
  const details = await Promise.all(cases.map((c) => (c.distressScore !== null ? getCase(c.userId) : Promise.resolve(undefined))));
  return { records: cases.map((c, i) => toRecord(c, details[i])), overview };
}
