import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  PhoneOff,
  Sparkles,
  Wind,
  ShieldCheck,
  Volume2,
  Lock,
  Compass,
} from 'lucide-react';
import { sendVoiceTurnToGemini, speakVoiceTurn, describeError } from '../../services/geminiService';
import { ChatMessage } from '../../types';

interface VoiceModalProps {
  isOpen: boolean;
  history?: ChatMessage[];
  onClose: (transcriptSnippet?: string) => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  history = [],
  onClose,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [speaker, setSpeaker] = useState<'ai' | 'user' | 'listening'>('ai');
  const [seconds, setSeconds] = useState(0);
  const [activeCaption, setActiveCaption] = useState(
    '“Elena, take a soft, unhurried breath through your nose. Notice how the ground supports you right now.”'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [userSpokenLog, setUserSpokenLog] = useState<string[]>([]);
  const [companionSpokenLog, setCompanionSpokenLog] = useState<string[]>([]);

  const recognitionRef = useRef<any>(null);

  // Format time display
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!isOpen) return;

    setSeconds(0);
    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    // Initial greeting vocalization
    const initialGreeting =
      'Hello Elena. I am with you in this quiet space. Take an unhurried breath, and speak whenever you are ready.';
    setActiveCaption(`“${initialGreeting}”`);
    speakVoiceTurn(initialGreeting);

    // Setup speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = async (event: any) => {
          const results = event.results;
          const latest = results[results.length - 1][0].transcript;
          if (latest && latest.trim()) {
            handleUserUtterance(latest.trim());
          }
        };

        recognition.onerror = () => {
          setSpeaker('listening');
        };

        try {
          recognition.start();
          recognitionRef.current = recognition;
          setSpeaker('listening');
        } catch {
          // Fallback handled
        }
      }
    }

    return () => {
      clearInterval(timer);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, [isOpen]);

  const handleUserUtterance = async (userText: string) => {
    setSpeaker('user');
    setActiveCaption(`“${userText}”`);
    setUserSpokenLog((prev) => [...prev, userText]);
    setIsProcessing(true);

    try {
      const aiReply = await sendVoiceTurnToGemini(userText, history);
      setIsProcessing(false);
      setSpeaker('ai');
      setActiveCaption(`“${aiReply}”`);
      setCompanionSpokenLog((prev) => [...prev, aiReply]);

      if (!isMuted) {
        speakVoiceTurn(aiReply);
      }
    } catch (err) {
      // Honest failure: show the error instead of a canned reply that never went through the pipeline.
      setIsProcessing(false);
      setSpeaker('listening');
      setActiveCaption(`${describeError(err)} Please say that again.`);
    }
  };

  const handleQuickTopic = (topicPrompt: string) => {
    handleUserUtterance(topicPrompt);
  };

  const handleEndSession = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    let summary = `[Voice Companion Session • ${formatTime(seconds)}]`;
    if (userSpokenLog.length > 0) {
      summary += ` Discussed: "${userSpokenLog.slice(-2).join(' ')}"`;
    } else {
      summary += ` Completed mindful voice grounding session.`;
    }

    onClose(summary);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-primary/95 backdrop-blur-xl flex flex-col justify-between p-6 text-white animate-in fade-in duration-300"
      id="voice-modal"
      role="dialog"
      aria-modal="true"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-lg mx-auto w-full pt-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[13px] font-semibold tracking-wide text-white/90">
            Voice Bot Live • {formatTime(seconds)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-white/10 text-white/80 font-mono">
            <Lock className="w-3 h-3 text-secondary-container" />
            Gemini 3.8 Flash
          </span>
          <button
            onClick={handleEndSession}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close voice session"
          >
            <PhoneOff className="w-4 h-4 text-red-300" />
          </button>
        </div>
      </div>

      {/* Center Stage: Pulsating Glowing Orb & Audio Waves */}
      <div className="flex-1 flex flex-col items-center justify-center my-4 max-w-lg mx-auto w-full gap-6">
        {/* Visual Pulsating Orb */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
          {/* Outer ripples */}
          <div
            className={`absolute inset-0 rounded-full bg-secondary/30 blur-2xl transition-transform duration-1000 ${
              speaker === 'ai' ? 'scale-125 animate-pulse' : 'scale-100'
            }`}
          />
          <div
            className={`absolute inset-4 rounded-full bg-secondary-container/20 blur-xl transition-transform duration-700 ${
              speaker === 'ai' ? 'scale-110' : 'scale-95'
            }`}
          />

          {/* Core Orb */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-primary to-secondary p-1 shadow-[0_0_50px_rgba(222,217,254,0.35)] flex items-center justify-center border border-white/30">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-secondary-container/90 to-primary flex items-center justify-center text-primary">
              <Sparkles className="w-9 h-9 text-white animate-spin [animation-duration:8s]" />
            </div>
          </div>
        </div>

        {/* Real-time Spectrum Audio Waveform Bars */}
        <div className="flex items-center justify-center gap-1.5 h-10 w-full max-w-xs">
          {[14, 28, 42, 22, 36, 46, 30, 18, 40, 26, 38, 16, 24, 32].map((height, i) => (
            <div
              key={i}
              className={`w-1.5 bg-secondary-container rounded-full transition-all duration-300 ${
                isMuted || isProcessing ? 'h-1.5 opacity-40' : ''
              }`}
              style={{
                height:
                  isMuted || isProcessing
                    ? '4px'
                    : `${Math.max(6, (height * (speaker === 'ai' ? 1 : 0.65)) % 46)}px`,
                animationDelay: `${i * 60}ms`,
              }}
            />
          ))}
        </div>

        {/* Live Conversational Captions */}
        <div className="w-full p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-h-[90px] flex flex-col justify-center shadow-lg">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary-container mb-1 block">
            {isProcessing
              ? 'Formulating Grounding Cadence...'
              : speaker === 'ai'
              ? 'DYNA MIND Voice Bot'
              : speaker === 'user'
              ? 'Elena (Spoken)'
              : 'Listening... speak naturally'}
          </span>
          <p className="text-[14px] text-white/95 leading-relaxed font-body">
            {activeCaption}
          </p>
        </div>

        {/* Quick Spoken Topic Prompts */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-sm">
          {[
            'Pace my 4-7-8 breathing',
            'I have intense court dread',
            'Perform a quick somatic scan',
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleQuickTopic(prompt)}
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 text-[11.5px] font-medium transition-colors cursor-pointer border border-white/15"
              type="button"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Controls Dock */}
      <div className="max-w-md mx-auto w-full pb-4 flex items-center justify-center gap-5">
        {/* Mute toggle */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isMuted ? 'bg-red-500/80 text-white' : 'bg-white/20 hover:bg-white/30 text-white'
          }`}
          aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        {/* End Session Button */}
        <button
          onClick={handleEndSession}
          className="px-6 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-[14px] shadow-lg flex items-center gap-2 transition-all cursor-pointer"
        >
          <PhoneOff className="w-5 h-5" />
          <span>End Voice Session</span>
        </button>
      </div>
    </div>
  );
};
