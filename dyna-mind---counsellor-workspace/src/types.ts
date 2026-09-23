export type AssessmentStatus = 'REVIEWED' | 'NEEDS_REVIEW' | 'FLAGGED' | 'OVERDUE' | 'PENDING';

export type ScaleType = 'PHQ-9' | 'GAD-7' | 'WELLBEING' | 'PSS';

export interface AssessmentItemResponse {
  questionNumber: number;
  questionText: string;
  responseScore: number;
  responseLabel: string;
  isCriticalAlert?: boolean;
}

export interface AssessmentRecord {
  id: string;
  caseId: string;
  clientName: string;
  clientAge?: number;
  clientGender?: string;
  scaleType: ScaleType;
  scaleName: string;
  scaleSubtitle: string;
  badgeCode: string;
  badgeBg: string;
  badgeColor: string;
  completedAt: string;
  scoreText: string;
  rawScore?: number;
  maxScore?: number;
  deltaText?: string;
  scoreTag: string;
  scoreTagStyle: 'mild' | 'delta' | 'elevated' | 'optimal' | 'pending';
  indicationText: string;
  status: AssessmentStatus;
  statusLabel: string;
  actionType: 'view_full' | 'review' | 'clinical_review' | 'view_summary' | 'send_reminder';
  actionLabel: string;
  actionStyle: 'default' | 'primary' | 'error' | 'reminder';
  historyTrajectory?: number[];
  responses?: AssessmentItemResponse[];
  clinicalNotes?: string;
  assignedBy?: string;
  reminderSent?: boolean;
}

export type NavTab = 
  | 'overview'
  | 'my-cases'
  | 'assessments'
  | 'risk-monitoring'
  | 'interventions'
  | 'appointments'
  | 'reports'
  | 'messages'
  | 'team'
  | 'resources'
  | 'settings';
