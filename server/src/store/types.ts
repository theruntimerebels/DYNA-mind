import type { UserDoc, ConversationDoc, Message, AssessmentDoc, CheckInDoc, FollowUpDoc } from '../types.ts';

export interface Store {
  mode: 'mongo' | 'memory';
  createUser(displayName: string): Promise<UserDoc>;
  getUser(id: string): Promise<UserDoc | null>;
  touchUser(id: string): Promise<void>;
  listUsers(): Promise<UserDoc[]>;
  appendMessages(sessionId: string, userId: string, msgs: Message[], source: 'text' | 'voice'): Promise<void>;
  getConversation(sessionId: string): Promise<ConversationDoc | null>;
  listSessions(userId: string): Promise<{ sessionId: string; updatedAt: string; messageCount: number }[]>;
  /** One assessment per (userId, sessionKey): chat turns in a session replace each other. */
  upsertAssessment(a: AssessmentDoc): Promise<void>;
  listAssessments(userId: string, limit?: number): Promise<AssessmentDoc[]>; // oldest -> newest
  latestAssessments(): Promise<AssessmentDoc[]>; // newest per user
  addCheckIn(c: CheckInDoc): Promise<void>;
  listCheckIns(userId: string, limit?: number): Promise<CheckInDoc[]>; // newest first
  recentCheckIns(limit: number): Promise<CheckInDoc[]>;
  getOpenFollowUp(userId: string): Promise<FollowUpDoc | null>;
  saveFollowUp(f: FollowUpDoc): Promise<void>;
  listFollowUps(onlyActive: boolean): Promise<FollowUpDoc[]>;
  listFollowUpsForUser(userId: string): Promise<FollowUpDoc[]>;
  deleteUserData(userId: string): Promise<void>;
  close(): Promise<void>;
}
