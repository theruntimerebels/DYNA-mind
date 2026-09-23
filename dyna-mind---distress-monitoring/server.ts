import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini API client on the server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const DEFAULT_SYSTEM_INSTRUCTION = `You are DYNA MIND, a compassionate, trauma-informed psychological distress monitoring and somatic grounding companion.
You are specifically calibrated to support Elena Vance through high-stakes civil and family court proceedings (Case Reference #CIV-2026-0941).
Elena experiences anticipatory courtroom distress, somatic tension (such as chest tightness, shallow breathing, jaw and shoulder clenching, and sleep disruption).
Your responsibilities:
1. Acknowledge and validate Elena's emotional load with deep empathy and composed presence.
2. Provide grounded, practical somatic regulation techniques (such as 4-7-8 breathing, bilateral butterfly tapping, 5-4-3-2-1 sensory grounding, feet-flat posture, and subtle tactile anchors for the courtroom).
3. Help reframe legal anticipation dread into steady, unhurried steps.
4. Keep answers conversational, warm, and comforting (2 to 4 concise paragraphs). Avoid robotic bullet dumps or medical disclaimers unless acute safety is indicated.
5. If acute crisis or self-harm is mentioned, compassionately urge calling or texting 988 or 741741.`;

// Multi-turn Chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { history = [], message, systemInstruction, somaticContext } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Format multi-turn contents for Gemini
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Append prior conversational turns
    for (const turn of history) {
      if (turn.sender === 'user') {
        contents.push({
          role: 'user',
          parts: [{ text: turn.text }],
        });
      } else if (turn.sender === 'companion') {
        contents.push({
          role: 'model',
          parts: [{ text: turn.text }],
        });
      }
    }

    // Prepare current prompt with any real-time somatic telemetry
    let currentPrompt = message;
    if (somaticContext) {
      currentPrompt = `[Real-time Somatic Telemetry: ${JSON.stringify(somaticContext)}]\n${message}`;
    }

    contents.push({
      role: 'user',
      parts: [{ text: currentPrompt }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: systemInstruction || DEFAULT_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const replyText = response.text || 'I am here with you, Elena. Take a slow, gentle breath.';
    res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate companion response',
      fallback:
        'I hear you, Elena. Let us take an unhurried breath together right now. Feel your feet resting firmly on the floor.',
    });
  }
});

// Voice Turn endpoint (Optimized for spoken dialogue)
app.post('/api/voice-turn', async (req: Request, res: Response) => {
  try {
    const { transcript, history = [] } = req.body;

    if (!transcript) {
      res.status(400).json({ error: 'Transcript is required' });
      return;
    }

    const voiceSystemPrompt = `${DEFAULT_SYSTEM_INSTRUCTION}
SPECIAL INSTRUCTION FOR VOICE BOT:
You are speaking directly into Elena's ear in real-time voice mode.
Keep your response concise (1 to 2 spoken sentences, maximum 40 words).
Speak in a soothing, reassuring, unhurried cadence.
Never use asterisks, markdown, emojis, or lists, because this will be spoken aloud via text-to-speech.`;

    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    for (const turn of history.slice(-4)) {
      contents.push({
        role: turn.sender === 'user' ? 'user' : 'model',
        parts: [{ text: turn.text }],
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: transcript }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: voiceSystemPrompt,
        temperature: 0.6,
      },
    });

    const replyText =
      response.text?.replace(/[\*\_#]/g, '').trim() ||
      'Take a slow breath with me, Elena. Let your shoulders soften.';

    res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Error in /api/voice-turn:', error);
    res.status(500).json({
      error: error?.message || 'Voice generation failed',
      reply: 'I hear you, Elena. Let us take an unhurried breath together right now.',
    });
  }
});

// Text-to-speech endpoint using Gemini TTS
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, voiceName = 'Kore' } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 500),
              speechMetadata: {
                style: 'Gentle, warm, and soothing somatic therapist tone',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (base64Audio) {
      res.json({ audio: base64Audio, sampleRate: 24000 });
    } else {
      res.status(404).json({ error: 'No audio generated' });
    }
  } catch (error: any) {
    console.error('Error in /api/tts:', error);
    res.status(500).json({ error: error?.message || 'TTS generation failed' });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Vite middleware for development
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        port: Number(PORT),
        host: '0.0.0.0',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`DYNA MIND server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
