import { ChatMessage, BiometricIndicators } from '../types';

export interface ChatResponse {
  reply: string;
}

export async function sendChatMessageToGemini(
  history: ChatMessage[],
  newMessage: string,
  biometrics?: BiometricIndicators,
  systemInstruction?: string
): Promise<string> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        history,
        message: newMessage,
        somaticContext: biometrics
          ? {
              distressIndex: biometrics.distressIndex,
              stabilityQuotient: biometrics.stabilityQuotient,
              stressResponse: biometrics.stressResponse,
              sleepIntegrity: biometrics.sleepIntegrity,
            }
          : undefined,
        systemInstruction,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with ${res.status}`);
    }

    const data: ChatResponse = await res.json();
    return data.reply;
  } catch (err: any) {
    console.warn('Gemini chat API call fallback:', err);
    // Intelligent contextual fallback in case API is offline or disconnected
    return generateLocalFallback(newMessage);
  }
}

export async function sendVoiceTurnToGemini(
  transcript: string,
  history: ChatMessage[]
): Promise<string> {
  try {
    const res = await fetch('/api/voice-turn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transcript,
        history,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with ${res.status}`);
    }

    const data = await res.json();
    return data.reply;
  } catch (err: any) {
    console.warn('Voice API turn fallback:', err);
    return 'Elena, take an unhurried breath through your nose. Let your shoulders soften down.';
  }
}

// Play TTS using Gemini PCM 24kHz or fallback to Web Speech API
export async function speakVoiceTurn(text: string): Promise<void> {
  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voiceName: 'Kore' }),
    });

    if (res.ok) {
      const { audio, sampleRate = 24000 } = await res.json();
      if (audio) {
        playPcmAudio(audio, sampleRate);
        return;
      }
    }
  } catch (err) {
    console.warn('Gemini TTS failed, falling back to Web Speech API', err);
  }

  // Fallback to browser Web Speech API
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}

function playPcmAudio(base64Data: string, sampleRate = 24000) {
  try {
    const binary = atob(base64Data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const int16 = new Int16Array(bytes.buffer);
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate,
    });
    const buffer = audioCtx.createBuffer(1, int16.length, sampleRate);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < int16.length; i++) {
      channel[i] = int16[i] / 32768.0;
    }
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start();
  } catch (err) {
    console.warn('Failed playing PCM audio:', err);
  }
}

function generateLocalFallback(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('breath') || lower.includes('4-7-8') || lower.includes('relax')) {
    return 'Let us do a steady 4-7-8 cycle together right now. Inhale softly through your nose for 4 counts... hold gently for 7... and exhale slowly with a whoosh for 8 counts. Notice how your chest softens.';
  }
  if (lower.includes('overwhelm') || lower.includes('panic') || lower.includes('scared') || lower.includes('dread')) {
    return 'I hear you clearly, Elena. Your feelings are completely valid given what you are carrying. Place both feet flat on the floor right now. Can you feel the solid surface beneath your shoes? You are safe in this physical room at this very moment.';
  }
  if (lower.includes('court') || lower.includes('hearing') || lower.includes('tuesday') || lower.includes('sarah') || lower.includes('judge')) {
    return 'Courtroom anticipation commonly triggers an adrenaline surge. Remember: your legal advocate Sarah is handling the procedural defense. Your sole objective is to remain anchored in your breath and answer plainly. You can practice the 3-minute courtroom grounding sequence at any time.';
  }
  return 'Thank you for expressing that, Elena. Putting words to somatic strain prevents the nervous system from escalating into panic. How is your jaw and shoulder tension feeling right now?';
}
