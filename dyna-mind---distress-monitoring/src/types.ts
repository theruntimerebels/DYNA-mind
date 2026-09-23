export type NavigationTab =
  | 'home'
  | 'companion'
  | 'checkin'
  | 'insights'
  | 'timeline'
  | 'resources'
  | 'emergency-support'
  | 'settings';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'companion';
  text: string;
  time: string;
  status?: string;
  contextTag?: string;
}

export interface CheckinRecord {
  id: string;
  timestamp: string;
  emotions: string[];
  somatic: {
    chest: number; // 0-10
    jaw: number; // 0-10
    sleep: number; // 0-10
  };
  trigger: string;
  notes: string;
}

export interface BiometricIndicators {
  distressIndex: number; // 0-100
  sleepHours: number;
  stabilityQuotient: number; // e.g. 82%
  deviationVariance: number; // e.g. +14%
  stabilityState: string; // 'Anchored'
  calibratedLogs: number;
  stressResponse: number; // e.g. 72%
  sleepIntegrity: number; // e.g. 58%
  wellbeingScore: number; // e.g. 64%
}
