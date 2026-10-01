import mongoose, { Schema } from 'mongoose';

const opts = { versionKey: false, _id: false } as const;
const idField = { _id: { type: String, required: true } };

export const UserModel = mongoose.model('User', new Schema({
  ...idField, displayName: { type: String, required: true, maxlength: 80 },
  createdAt: String, lastActiveAt: String,
}, opts));

export const ConversationModel = mongoose.model('Conversation', new Schema({
  _id: { type: String, required: true }, // sessionId
  userId: { type: String, required: true, index: true },
  messages: [{ _id: false, id: String, sender: { type: String, enum: ['user', 'companion'] }, text: String, timestamp: String, contextTag: String }],
  metadata: { source: String, messageCount: Number },
  createdAt: String, updatedAt: { type: String, index: true },
}, opts));

export const AssessmentModel = mongoose.model('DistressAssessment', (() => {
  const s = new Schema({
    ...idField, userId: { type: String, required: true }, sessionKey: { type: String, required: true },
    source: { type: String, enum: ['chat', 'checkin'] }, timestamp: { type: String, required: true },
    score: Number, previousScore: Number, delta: Number, rollingAverage: Number, baseline: Number, baselineDeviation: Number,
    trend: { type: String, enum: ['improving', 'stable', 'deteriorating', 'rapid_deterioration'] },
    consecutiveDeteriorating: Number, suddenChange: Boolean, coldStart: Boolean, confidence: Number,
    riskLevel: { type: String, enum: ['low', 'moderate', 'high', 'critical'] },
    signals: Schema.Types.Mixed, contributing: Schema.Types.Mixed, triggers: [String],
    escalationReasons: [String], safetyLevel: String,
  }, opts);
  s.index({ userId: 1, timestamp: 1 });
  s.index({ userId: 1, sessionKey: 1 }, { unique: true });
  return s;
})());

export const CheckInModel = mongoose.model('CheckIn', (() => {
  const s = new Schema({
    ...idField, userId: { type: String, required: true }, timestamp: { type: String, required: true },
    responses: Schema.Types.Mixed, assessmentId: String, distressScore: Number,
    riskLevel: String, triggers: [String], changeFromPrevious: Number,
    requiresFollowUp: Boolean, followUpRecommendation: String,
  }, opts);
  s.index({ userId: 1, timestamp: -1 });
  s.index({ timestamp: -1 });
  return s;
})());

/** Minimal case context: only what the dashboard needs to track follow-up. No case facts are stored. */
export const FollowUpModel = mongoose.model('CaseContext', (() => {
  const s = new Schema({
    ...idField, userId: { type: String, required: true },
    status: { type: String, enum: ['open', 'acknowledged', 'in_progress', 'resolved'] },
    severity: String, reason: String, signalSummary: String, createdAt: String, updatedAt: String,
    notificationSent: { type: Boolean, default: false },
    history: [{ _id: false, at: String, status: String, note: String, by: String }],
  }, opts);
  s.index({ userId: 1, status: 1 });
  s.index({ updatedAt: -1 });
  return s;
})());
