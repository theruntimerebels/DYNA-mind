export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';
export type Trend = 'improving' | 'stable' | 'deteriorating' | 'rapid_deterioration';
export type SafetyLevel = 'none' | 'elevated' | 'critical';

/** All values normalised 0..1 (higher = more distress). Missing = not observed. */
export interface Signals {
  somatic?: number;
  stress?: number;
  sleepDifficulty?: number;
  emotionalIntensity?: number;
  negativeSentiment?: number;
  fearSafety?: number;
  engagementDrop?: number;
}

export interface UserDoc { id: string; displayName: string; createdAt: string; lastActiveAt: string; }
export interface Message { id: string; sender: 'user' | 'companion'; text: string; timestamp: string; contextTag?: string; }
export interface ConversationDoc {
  sessionId: string; userId: string; messages: Message[];
  metadata: { source: 'text' | 'voice' | 'mixed'; messageCount: number };
  createdAt: string; updatedAt: string;
}
export interface AssessmentDoc {
  id: string; userId: string; sessionKey: string; source: 'chat' | 'checkin';
  timestamp: string; score: number; previousScore: number | null; delta: number | null;
  rollingAverage: number | null; baseline: number | null; baselineDeviation: number | null;
  trend: Trend; consecutiveDeteriorating: number; suddenChange: boolean; coldStart: boolean;
  confidence: number; riskLevel: RiskLevel; signals: Signals; contributing: { signal: string; contribution: number }[];
  triggers: string[]; escalationReasons: string[]; safetyLevel: SafetyLevel;
}
export interface CheckInDoc {
  id: string; userId: string; timestamp: string;
  responses: { emotions: string[]; somatic: { chest: number; jaw: number; sleep: number }; trigger: string; notes: string };
  assessmentId: string; distressScore: number; riskLevel: RiskLevel; triggers: string[];
  changeFromPrevious: number | null; requiresFollowUp: boolean; followUpRecommendation: string | null;
}
export type FollowUpStatus = 'open' | 'acknowledged' | 'in_progress' | 'resolved';
export interface FollowUpDoc {
  id: string; userId: string; status: FollowUpStatus; severity: RiskLevel; reason: string;
  signalSummary: string; createdAt: string; updatedAt: string;
  notificationSent: false; // no outbound channel is implemented; never claim otherwise
  history: { at: string; status: FollowUpStatus; note: string; by: string }[];
}
