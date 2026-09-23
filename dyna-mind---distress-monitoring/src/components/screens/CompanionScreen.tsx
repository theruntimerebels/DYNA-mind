import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  History,
  Lock,
  HeartPulse,
  ChevronRight,
  ShieldAlert,
  Search,
  X,
  Plus,
  ArrowDownCircle,
  Activity,
  CheckCircle2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ChatMessage, BiometricIndicators } from '../../types';
import { ARCHIVED_SESSIONS } from '../../data/mockData';
import { sendChatMessageToGemini, speakVoiceTurn } from '../../services/geminiService';

interface CompanionScreenProps {
  messages: ChatMessage[];
  biometrics: BiometricIndicators;
  onSendMessage: (text: string, contextTag?: string) => void;
  onStartVoice: () => void;
  onOpenSafety: () => void;
  onOpenPrivacy: () => void;
  onNavigateToCheckin: () => void;
}

export const CompanionScreen: React.FC<CompanionScreenProps> = ({
  messages,
  biometrics,
  onSendMessage,
  onStartVoice,
  onOpenSafety,
  onOpenPrivacy,
  onNavigateToCheckin,
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>('Tense');
  const [moodSubmitted, setMoodSubmitted] = useState(false);
  const [contextTag, setContextTag] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speakResponses, setSpeakResponses] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputText(transcript);
            setIsListening(false);
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleMicListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        // Fallback or permission prompt
        setIsListening(false);
        onStartVoice();
      }
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Post user message
    onSendMessage(text, contextTag || undefined);
    setInputText('');
    setContextTag(null);

    // Call Gemini API through our full-stack endpoint
    setIsTyping(true);
    try {
      const companionReply = await sendChatMessageToGemini(
        messages,
        text,
        biometrics
      );
      setIsTyping(false);
      onSendMessage(companionReply, 'DYNA MIND Anchor');

      if (speakResponses) {
        speakVoiceTurn(companionReply);
      }
    } catch (err) {
      setIsTyping(false);
      onSendMessage(
        'I am right here with you, Elena. Let us take an unhurried breath together.',
        'Somatic Anchor'
      );
    }
  };

  const quickPrompts = [
    'Guide me through breathing',
    'I am feeling overwhelmed',
    'Discuss court distress',
    'Explain my indicators',
  ];

  const handleQuickPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  const handleMoodSubmit = async () => {
    if (!selectedMood) return;
    setMoodSubmitted(true);
    const moodText = `I am feeling ${selectedMood} today.`;
    onSendMessage(moodText, 'Somatic Mood');

    setIsTyping(true);
    try {
      const companionReply = await sendChatMessageToGemini(
        messages,
        `Elena just checked in with a somatic state of "${selectedMood}". Provide a 2-sentence soothing acknowledgement and grounding check.`,
        biometrics
      );
      setIsTyping(false);
      onSendMessage(companionReply, 'Somatic Telemetry');
      setMoodSubmitted(false);
      if (speakResponses) {
        speakVoiceTurn(companionReply);
      }
    } catch {
      setIsTyping(false);
      setMoodSubmitted(false);
    }
  };

  const filteredHistory = ARCHIVED_SESSIONS.filter((s) =>
    s.title.toLowerCase().includes(searchHistory.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-8.5rem)] pb-36 pt-1" id="companion-screen">
      {/* Top Status & Controls Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-surface-container/60 gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSafety}
            aria-label="Immediate care protocol"
            className="w-8 h-8 rounded-full bg-tertiary-fixed/60 text-tertiary-container flex items-center justify-center hover:bg-tertiary-fixed transition-colors cursor-pointer"
            title="Immediate Care Protocol"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[12px] font-semibold text-primary">
              Gemini 3.8 Flash • Online
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Voice Speech Toggle */}
          <button
            onClick={() => setSpeakResponses(!speakResponses)}
            title={speakResponses ? 'Voice output enabled' : 'Voice output muted'}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              speakResponses ? 'bg-secondary-container text-primary' : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            {speakResponses ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Voice Mode Launcher */}
          <button
            onClick={onStartVoice}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-container text-primary font-semibold text-[11px] hover:bg-secondary-fixed transition-colors cursor-pointer shadow-xs"
            type="button"
          >
            <Mic className="w-3.5 h-3.5 text-primary" />
            <span>Voice Mode</span>
          </button>
        </div>
      </div>

      {/* Longitudinal Guidance Notice */}
      <div className="mt-3 p-3 rounded-xl bg-secondary-container/40 border border-secondary/20 flex items-start gap-2.5">
        <Activity className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
        <p className="text-[12px] text-on-surface leading-snug">
          <strong className="font-semibold text-primary">Longitudinal Guidance:</strong> Somatic patterns indicate a +14% sympathetic arousal spike consistent with your 3-day court milestone.
        </p>
      </div>

      {/* Quick Action Toolstrip */}
      <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className={`px-3 py-1.5 rounded-xl border text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
            showHistory
              ? 'bg-primary text-on-primary border-primary'
              : 'bg-surface-container-lowest text-on-surface border-surface-container hover:bg-surface-container-low'
          }`}
          type="button"
        >
          <History className="w-3.5 h-3.5 text-secondary" />
          <span>History</span>
        </button>

        <button
          onClick={onOpenPrivacy}
          className="px-3 py-1.5 rounded-xl bg-surface-container-lowest border border-surface-container hover:bg-surface-container-low text-on-surface text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          type="button"
        >
          <Lock className="w-3.5 h-3.5 text-secondary" />
          <span>Privacy & Data</span>
        </button>

        <button
          onClick={onNavigateToCheckin}
          className="px-3 py-1.5 rounded-xl bg-surface-container-lowest border border-surface-container hover:bg-surface-container-low text-on-surface text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          type="button"
        >
          <HeartPulse className="w-3.5 h-3.5 text-secondary" />
          <span>Daily Pulse</span>
        </button>
      </div>

      {/* Archived Sessions Collapsible Drawer */}
      {showHistory && (
        <div className="mb-4 p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-md flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[14px] text-primary font-headline">
              Archived Grounding Sessions
            </span>
            <button
              onClick={() => setShowHistory(false)}
              className="p-1 rounded-lg text-secondary hover:bg-surface-container transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search past conversations..."
              value={searchHistory}
              onChange={(e) => setSearchHistory(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-container-low border border-surface-container text-[12px] text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>

          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto no-scrollbar">
            {filteredHistory.map((session) => (
              <div
                key={session.id}
                className="p-2.5 rounded-xl bg-surface-container-low/60 hover:bg-surface-container-low border border-surface-container transition-colors cursor-pointer"
                onClick={() => {
                  onSendMessage(`[Resumed discussion from archived session: "${session.title}"]`);
                  setShowHistory(false);
                }}
              >
                <div className="text-[13px] font-semibold text-primary">{session.title}</div>
                <div className="text-[11px] text-on-surface-variant mt-0.5">{session.meta}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Biometric Indicators Horizontal Scroll Cards */}
      <div className="flex gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar">
        {/* Card 1: Wellbeing State with Circular Gauge */}
        <div className="min-w-[240px] p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col justify-between shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
              Wellbeing State
            </span>
            <span className="text-[11px] font-bold text-primary">Stable</span>
          </div>

          <div className="flex items-center gap-3 my-2">
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-container"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-primary"
                  strokeDasharray={`${biometrics.wellbeingScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[13px] font-bold text-primary font-headline">
                {biometrics.wellbeingScore}
              </span>
            </div>

            <div className="flex flex-col text-[11px] text-on-surface-variant leading-tight">
              <div>Stress Load: <strong className="text-primary">{biometrics.stressResponse}%</strong></div>
              <div>Sleep Index: <strong className="text-primary">{biometrics.sleepIntegrity}%</strong></div>
              <div className="text-[10px] text-secondary mt-1">Moderate fatigue</div>
            </div>
          </div>

          <span className="text-[10px] text-on-surface-variant border-t border-surface-container/60 pt-1.5">
            Real-time biometric baseline
          </span>
        </div>

        {/* Card 2: Personal Baseline */}
        <div className="min-w-[240px] p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col justify-between shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
              Personal Baseline
            </span>
            <span className="text-[11px] font-bold text-secondary">v2.4</span>
          </div>

          <div className="my-2 flex flex-col gap-1">
            <div className="text-2xl font-bold text-primary font-headline">
              {biometrics.stabilityQuotient}%
            </div>
            <span className="text-[11px] text-on-surface-variant">
              Calibrated across {biometrics.calibratedLogs} recorded sessions
            </span>
            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-secondary h-full rounded-full"
                style={{ width: `${biometrics.stabilityQuotient}%` }}
              />
            </div>
          </div>

          <span className="text-[10px] text-secondary border-t border-surface-container/60 pt-1.5">
            Within ±12% safe emotional variance
          </span>
        </div>

        {/* Card 3: Current Emotional Pulse */}
        <div className="min-w-[240px] p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col justify-between shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
              Current Emotional Pulse
            </span>
            {moodSubmitted && (
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> Updating
              </span>
            )}
          </div>

          <div className="my-2 flex items-center justify-between gap-1">
            {['Anxious', 'Tense', 'Grounded', 'Calm'].map((mood) => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                  selectedMood === mood
                    ? 'bg-secondary text-on-secondary font-bold shadow-xs'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
                type="button"
              >
                {mood}
              </button>
            ))}
          </div>

          <button
            onClick={handleMoodSubmit}
            className="w-full py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-[11px] transition-colors cursor-pointer border border-surface-container"
            type="button"
          >
            Submit Pulse Check
          </button>
        </div>
      </div>

      {/* Confidential Clinical Dialogue Stream */}
      <div className="flex-1 flex flex-col gap-3 py-3 overflow-y-auto">
        <div className="flex items-center justify-center my-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-surface-container text-on-surface-variant">
            Confidential Grounding Thread • Powered by Gemini 3.8
          </span>
        </div>

        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[88%] sm:max-w-[78%] ${
                isUser ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              {msg.contextTag && (
                <span className="text-[10px] text-secondary font-semibold mb-1 px-2 py-0.5 rounded-md bg-secondary-container/40">
                  {msg.contextTag}
                </span>
              )}
              <div
                className={`p-4 rounded-2xl text-[13.5px] leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-primary text-on-primary rounded-br-xs'
                    : 'bg-surface-container-lowest text-on-surface border border-surface-container rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] text-on-surface-variant">
                <span>{msg.time}</span>
                {msg.status && <span>• {msg.status}</span>}
                {!isUser && (
                  <button
                    onClick={() => speakVoiceTurn(msg.text)}
                    title="Read aloud"
                    className="hover:text-primary transition-colors cursor-pointer ml-1"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="self-start flex items-center gap-2 p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
            <span className="text-[11.5px] text-on-surface-variant font-medium">
              DYNA MIND is formulating trauma-informed grounding guidance...
            </span>
            <div className="flex items-center gap-1 pl-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Recommended Quick Suggestion Pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleQuickPrompt(prompt)}
            className="px-3 py-1.5 rounded-full bg-surface-container-lowest border border-surface-container hover:border-secondary/40 text-on-surface text-[12px] font-medium whitespace-nowrap shadow-xs hover:bg-surface-container-low transition-all cursor-pointer shrink-0"
            type="button"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Sticky Bottom Dock */}
      <div className="fixed bottom-28 inset-x-0 z-30 px-4 sm:px-6 max-w-3xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 p-2 rounded-2xl bg-surface-container-lowest/98 backdrop-blur-md border border-surface-container shadow-[0_8px_30px_rgba(77,72,102,0.12)]"
        >
          {/* Somatic Context Add Button */}
          <button
            type="button"
            onClick={() => setContextTag(contextTag ? null : 'Somatic Log')}
            title="Attach Somatic Context"
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              contextTag ? 'bg-secondary text-on-secondary' : 'text-secondary hover:bg-surface-container'
            }`}
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListening
                ? 'Listening to your voice...'
                : contextTag
                ? `[Context: ${contextTag}] Share what is on your mind...`
                : 'Share what is on your mind...'
            }
            className="flex-1 bg-transparent text-[13.5px] text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none px-2"
          />

          {/* Microphone Dictation Button */}
          <button
            type="button"
            onClick={toggleMicListening}
            title={isListening ? 'Stop listening' : 'Dictate with microphone'}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'text-secondary hover:bg-surface-container'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              inputText.trim()
                ? 'bg-primary text-on-primary shadow-xs hover:bg-primary-container'
                : 'bg-surface-container text-on-surface-variant/50 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
