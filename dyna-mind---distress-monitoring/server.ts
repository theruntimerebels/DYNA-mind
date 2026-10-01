import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { MongoClient, Db, Collection, ObjectId } from 'mongodb';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: '2mb' }));

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || 'dyna_mind';

const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;
let db: Db | null = null;
let mongoClient: MongoClient | null = null;

type StoredMessage = {
  id: string;
  sender: 'user' | 'companion';
  text: string;
  time: string;
  status?: string;
  contextTag?: string;
  createdAt: string;
};

type SessionDoc = {
  _id?: ObjectId;
  sessionId: string;
  userId: string;
  messages: StoredMessage[];
  biometrics: Record<string, number | string>;
  createdAt: Date;
  updatedAt: Date;
};

type CheckinDoc = {
  _id?: ObjectId;
  sessionId: string;
  userId: string;
  timestamp: Date;
  emotions: string[];
  somatic: { chest: number; jaw: number; sleep: number };
  trigger: string;
  notes: string;
  distressScore: number;
};

const memorySessions = new Map<string, SessionDoc>();
const memoryCheckins = new Map<string, CheckinDoc[]>();

const DEFAULT_BIOMETRICS = {
  distressIndex: 34,
  sleepHours: 6.8,
  stabilityQuotient: 82,
  deviationVariance: 14,
  stabilityState: 'Anchored',
  calibratedLogs: 14,
  stressResponse: 72,
  sleepIntegrity: 58,
  wellbeingScore: 64,
};

const DEFAULT_MESSAGES: StoredMessage[] = [{
  id: 'msg-welcome',
  sender: 'companion',
  text: 'Hi. I am DYNA MIND. I can help you check in with how you are feeling, notice changes over time, and practise grounding when things feel heavy. What feels most difficult right now?',
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  contextTag: 'DYNA MIND Anchor',
  createdAt: new Date().toISOString(),
}];

const SYSTEM_INSTRUCTION = `You are DYNA MIND, an AI-assisted wellbeing monitoring and grounding companion.
Your role is supportive decision support, not diagnosis, psychotherapy, legal advice, or emergency care.
The user may be an atrocity victim or complainant experiencing prolonged distress around investigation, court proceedings, delays, threats, social pressure, economic hardship, or rehabilitation.

Conversation rules:
- Be warm, calm, respectful and trauma-informed.
- Never blame, interrogate, shame, diagnose, or claim certainty about a person's mental state.
- Do not invent case facts, legal outcomes, medical facts, people, dates, or threats.
- Ask one useful follow-up question when it helps.
- Prefer practical grounding, emotional check-ins, sleep/self-care suggestions, and encouraging contact with an appropriate human professional.
- Never tell a user that an AI assessment proves they are safe or unsafe.
- If the user mentions immediate danger, self-harm, suicide, harming someone, or a medical emergency, prioritize immediate human help and local emergency services. Do not rely on the chatbot.
- Keep normal responses concise: 2 to 4 short paragraphs.
- The distress score is an assistive signal derived from check-ins and conversation, not a diagnosis or clinical score.`;

const analysisSchema = {
  type: 'object',
  properties: {
    reply: { type: 'string' },
    emotion: { type: 'string' },
    distressSignal: { type: 'number' },
    riskLevel: { type: 'string', enum: ['low', 'moderate', 'high', 'crisis'] },
    triggers: { type: 'array', items: { type: 'string' } },
    needsHumanFollowup: { type: 'boolean' }
  },
  required: ['reply', 'emotion', 'distressSignal', 'riskLevel', 'triggers', 'needsHumanFollowup']
};

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function localRisk(text: string) {
  const t = text.toLowerCase();
  const crisis = /(kill myself|suicide|suicidal|self harm|self-harm|end my life|hurt myself|want to die|can't stay safe|immediate danger)/i.test(t);
  const high = /(panic attack|terrified|threatened|threat|unsafe|harass|violence|overwhelmed|hopeless|can't cope|cannot cope)/i.test(t);
  return { crisis, high };
}

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function computeCheckinDistress(s: { chest: number; jaw: number; sleep: number }) {
  return clamp((s.chest * 0.4 + s.jaw * 0.25 + (10 - s.sleep) * 0.35) * 10);
}

async function connectMongo() {
  if (!MONGODB_URI) {
    console.log('MONGODB_URI not set. Using in-memory persistence for demo mode.');
    return;
  }
  try {
    mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
    db = mongoClient.db(DB_NAME);
    await db.collection<SessionDoc>('sessions').createIndex({ sessionId: 1 }, { unique: true });
    await db.collection<CheckinDoc>('checkins').createIndex({ sessionId: 1, timestamp: -1 });
    console.log(`MongoDB connected: ${DB_NAME}`);
  } catch (error) {
    console.error('MongoDB connection failed. Continuing in demo memory mode.', error);
    db = null;
  }
}

async function getSession(sessionId: string): Promise<SessionDoc> {
  if (db) {
    const found = await db.collection<SessionDoc>('sessions').findOne({ sessionId });
    if (found) return found;
  }
  const existing = memorySessions.get(sessionId);
  if (existing) return existing;
  const session: SessionDoc = {
    sessionId,
    userId: 'demo-user',
    messages: DEFAULT_MESSAGES,
    biometrics: { ...DEFAULT_BIOMETRICS },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  memorySessions.set(sessionId, session);
  if (db) {
    await db.collection<SessionDoc>('sessions').updateOne(
      { sessionId },
      { $setOnInsert: session },
      { upsert: true }
    );
  }
  return session;
}

async function saveSession(session: SessionDoc) {
  session.updatedAt = new Date();
  memorySessions.set(session.sessionId, session);
  if (db) {
    await db.collection<SessionDoc>('sessions').updateOne(
      { sessionId: session.sessionId },
      { $set: session },
      { upsert: true }
    );
  }
}

function fallbackReply(message: string) {
  const { crisis, high } = localRisk(message);
  if (crisis) return {
    reply: 'I am really glad you said that. This needs human support right now. Please move toward a trusted person or safe place and contact your local emergency service or crisis service. If you can, tell me whether you are in immediate danger right now.',
    emotion: 'distressed',
    distressSignal: 95,
    riskLevel: 'crisis' as const,
    triggers: ['safety concern'],
    needsHumanFollowup: true
  };
  if (high) return {
    reply: 'That sounds like a heavy amount to carry. For the next minute, put both feet on the floor and take one slow breath out longer than you breathe in. What part of the situation feels hardest right now?',
    emotion: 'distressed',
    distressSignal: 72,
    riskLevel: 'high' as const,
    triggers: ['acute distress'],
    needsHumanFollowup: true
  };
  return {
    reply: 'I hear you. Let us take this one step at a time. What are you noticing most strongly right now: your thoughts, your body, your emotions, or the situation around you?',
    emotion: 'uncertain',
    distressSignal: 45,
    riskLevel: 'low' as const,
    triggers: [],
    needsHumanFollowup: false
  };
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'DYNA MIND backend',
    aiConfigured: Boolean(ai),
    database: db ? 'mongodb' : 'memory',
    model: GEMINI_MODEL
  });
});

app.get('/api/session/:sessionId', async (req, res) => {
  try {
    const session = await getSession(req.params.sessionId);
    res.json({
      sessionId: session.sessionId,
      messages: session.messages,
      biometrics: session.biometrics
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load session' });
  }
});

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { sessionId = 'demo-session', message, biometrics } = req.body;
    if (!message || typeof message !== 'string' || message.length > 4000) {
      return res.status(400).json({ error: 'A message of 1 to 4000 characters is required.' });
    }

    const session = await getSession(sessionId);
    if (biometrics) session.biometrics = { ...session.biometrics, ...biometrics };

    const userMessage: StoredMessage = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      text: message.trim(),
      time: nowTime(),
      status: 'Delivered',
      createdAt: new Date().toISOString()
    };
    session.messages.push(userMessage);

    const recent = session.messages.slice(-16);
    const risk = localRisk(message);
    let result;

    if (ai) {
      const contents = recent.map(m => ({
        role: m.sender === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: m.text }]
      }));
      const telemetry = JSON.stringify(session.biometrics);
      contents[contents.length - 1].parts[0].text =
        `[Current DYNA MIND monitoring context: ${telemetry}]\n${message}`;

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.65,
          responseMimeType: 'application/json',
          responseSchema: analysisSchema,
          maxOutputTokens: 500
        }
      });

      result = JSON.parse(response.text || '{}');
      result.distressSignal = clamp(Number(result.distressSignal) || 45);
      if (risk.crisis) result.riskLevel = 'crisis';
      if (risk.crisis || risk.high) result.needsHumanFollowup = true;
    } else {
      result = fallbackReply(message);
    }

    const previousDistress = Number(session.biometrics.distressIndex || 34);
    const blended = clamp(previousDistress * 0.7 + Number(result.distressSignal || 45) * 0.3);
    const distressIndex = risk.crisis ? 95 : blended;

    session.biometrics = {
      ...session.biometrics,
      distressIndex,
      wellbeingScore: 100 - distressIndex,
      stressResponse: clamp(distressIndex * 0.9),
      stabilityQuotient: clamp(100 - distressIndex * 0.35),
      stabilityState: distressIndex >= 75 ? 'Needs Attention' : distressIndex >= 50 ? 'Watchful' : 'Anchored',
      deviationVariance: clamp(distressIndex - 40, 0, 60)
    };

    const assistantMessage: StoredMessage = {
      id: `msg-${Date.now()}-a`,
      sender: 'companion',
      text: result.reply,
      time: nowTime(),
      contextTag: result.needsHumanFollowup ? 'Human Follow-up Signal' : 'DYNA MIND Anchor',
      createdAt: new Date().toISOString()
    };
    session.messages.push(assistantMessage);
    await saveSession(session);

    res.json({
      reply: result.reply,
      analysis: {
        emotion: result.emotion,
        distressSignal: distressIndex,
        riskLevel: result.riskLevel,
        triggers: result.triggers || [],
        needsHumanFollowup: Boolean(result.needsHumanFollowup)
      },
      biometrics: session.biometrics,
      message: assistantMessage
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: error?.message || 'AI response failed',
      fallback: fallbackReply(req.body?.message || '').reply
    });
  }
});

app.post('/api/checkins', async (req, res) => {
  try {
    const { sessionId = 'demo-session', emotions = [], somatic, trigger = '', notes = '' } = req.body;
    if (!somatic || [somatic.chest, somatic.jaw, somatic.sleep].some((n: unknown) => typeof n !== 'number')) {
      return res.status(400).json({ error: 'Somatic ratings are required.' });
    }

    const distressScore = computeCheckinDistress(somatic);
    const checkin: CheckinDoc = {
      sessionId,
      userId: 'demo-user',
      timestamp: new Date(),
      emotions,
      somatic,
      trigger,
      notes,
      distressScore
    };

    if (db) await db.collection<CheckinDoc>('checkins').insertOne(checkin);
    const list = memoryCheckins.get(sessionId) || [];
    list.unshift(checkin);
    memoryCheckins.set(sessionId, list.slice(0, 100));

    const session = await getSession(sessionId);
    session.biometrics = {
      ...session.biometrics,
      distressIndex: distressScore,
      wellbeingScore: 100 - distressScore,
      stressResponse: clamp(distressScore * 0.9),
      sleepIntegrity: clamp(somatic.sleep * 10),
      stabilityQuotient: clamp(100 - distressScore * 0.35),
      calibratedLogs: Number(session.biometrics.calibratedLogs || 0) + 1,
      stabilityState: distressScore >= 75 ? 'Needs Attention' : distressScore >= 50 ? 'Watchful' : 'Anchored'
    };
    await saveSession(session);

    res.json({ ok: true, checkin, biometrics: session.biometrics });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to save check-in' });
  }
});

app.get('/api/checkins/:sessionId', async (req, res) => {
  if (db) {
    const items = await db.collection<CheckinDoc>('checkins')
      .find({ sessionId: req.params.sessionId }).sort({ timestamp: -1 }).limit(100).toArray();
    return res.json({ checkins: items });
  }
  res.json({ checkins: memoryCheckins.get(req.params.sessionId) || [] });
});

app.delete('/api/session/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  memorySessions.delete(sessionId);
  memoryCheckins.delete(sessionId);
  if (db) {
    await db.collection('sessions').deleteOne({ sessionId });
    await db.collection('checkins').deleteMany({ sessionId });
  }
  res.json({ ok: true });
});

async function startServer() {
  await connectMongo();
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, host: '0.0.0.0' },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => res.sendFile(path.resolve(__dirname, 'dist', 'index.html')));
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`DYNA MIND running on http://localhost:${PORT}`);
  });

  const shutdown = async () => {
    server.close();
    if (mongoClient) await mongoClient.close();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startServer().catch(error => {
  console.error('Fatal startup error:', error);
  process.exit(1);
});
