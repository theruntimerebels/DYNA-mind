import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';
import type { Store } from './types.ts';
import { UserModel, ConversationModel, AssessmentModel, CheckInModel, FollowUpModel } from '../models/index.ts';

const now = () => new Date().toISOString();
const conv = (d: any) => { const { _id, ...rest } = d; return { sessionId: _id, ...rest }; };

export async function createMongoStore(uri: string, dbName: string): Promise<Store> {
  await mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 5000 });
  await Promise.all([UserModel, ConversationModel, AssessmentModel, CheckInModel, FollowUpModel].map((m) => m.init()));
  const strip = (a: any) => { const { _id, ...r } = a; return { id: _id, ...r }; };

  return {
    mode: 'mongo',
    async createUser(displayName) {
      const u = { id: randomUUID(), displayName, createdAt: now(), lastActiveAt: now() };
      await UserModel.create({ _id: u.id, ...u } as any); return u;
    },
    async getUser(id) { const d = await UserModel.findById(id).lean(); return d ? (strip(d) as any) : null; },
    async touchUser(id) { await UserModel.updateOne({ _id: id } as any, { lastActiveAt: now() }); },
    async listUsers() { return (await UserModel.find().lean()).map(strip) as any; },
    async appendMessages(sessionId, userId, msgs, source) {
      const t = now();
      await ConversationModel.updateOne(
        { _id: sessionId } as any,
        { $setOnInsert: { userId, createdAt: t, 'metadata.source': source }, $push: { messages: { $each: msgs } }, $set: { updatedAt: t } } as any,
        { upsert: true }
      );
      const c: any = await ConversationModel.findById(sessionId).lean();
      const mixed = c.metadata?.source && c.metadata.source !== source ? 'mixed' : source;
      await ConversationModel.updateOne({ _id: sessionId } as any, { 'metadata.source': mixed, 'metadata.messageCount': c.messages.length } as any);
    },
    async getConversation(id) { const d = await ConversationModel.findById(id).lean(); return d ? (conv(d) as any) : null; },
    async listSessions(userId) {
      const ds: any[] = await ConversationModel.find({ userId }).sort({ updatedAt: -1 }).lean();
      return ds.map((d) => ({ sessionId: d._id, updatedAt: d.updatedAt, messageCount: d.messages.length }));
    },
    async upsertAssessment(a) {
      const { id, ...rest } = a;
      await AssessmentModel.updateOne({ userId: a.userId, sessionKey: a.sessionKey }, { $set: rest, $setOnInsert: { _id: id } } as any, { upsert: true });
    },
    async listAssessments(userId, limit = 200) {
      const ds = await AssessmentModel.find({ userId }).sort({ timestamp: -1 }).limit(limit).lean();
      return ds.reverse().map(strip) as any;
    },
    async latestAssessments() {
      const ds = await AssessmentModel.aggregate([{ $sort: { timestamp: 1 } }, { $group: { _id: '$userId', doc: { $last: '$$ROOT' } } }]);
      return ds.map((g: any) => strip(g.doc)) as any;
    },
    async addCheckIn(c) { const { id, ...rest } = c; await CheckInModel.create({ _id: id, ...rest } as any); },
    async listCheckIns(userId, limit = 50) { return (await CheckInModel.find({ userId }).sort({ timestamp: -1 }).limit(limit).lean()).map(strip) as any; },
    async recentCheckIns(limit) { return (await CheckInModel.find().sort({ timestamp: -1 }).limit(limit).lean()).map(strip) as any; },
    async getOpenFollowUp(userId) {
      const d = await FollowUpModel.findOne({ userId, status: { $ne: 'resolved' } }).lean(); return d ? (strip(d) as any) : null;
    },
    async saveFollowUp(f) { const { id, ...rest } = f; await FollowUpModel.updateOne({ _id: id } as any, { $set: rest } as any, { upsert: true }); },
    async listFollowUps(onlyActive) {
      const q = onlyActive ? { status: { $ne: 'resolved' } } : {};
      return (await FollowUpModel.find(q).sort({ updatedAt: -1 }).lean()).map(strip) as any;
    },
    async listFollowUpsForUser(userId) { return (await FollowUpModel.find({ userId }).sort({ updatedAt: -1 }).lean()).map(strip) as any; },
    async deleteUserData(userId) {
      await Promise.all([UserModel.deleteOne({ _id: userId } as any), ConversationModel.deleteMany({ userId }), AssessmentModel.deleteMany({ userId }), CheckInModel.deleteMany({ userId }), FollowUpModel.deleteMany({ userId })]);
    },
    async close() { await mongoose.disconnect(); },
  };
}
