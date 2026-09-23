import React, { useState, useEffect } from 'react';
import {
  Wind,
  Compass,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Shield,
  Moon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const ResourcesScreen: React.FC = () => {
  // 4-7-8 Breathing state
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [count, setCount] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // Accordion open states
  const [expandedCard, setExpandedCard] = useState<string | null>('vagus');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount > 1) {
            return prevCount - 1;
          } else {
            // Transition phase
            if (phase === 'Inhale') {
              setPhase('Hold');
              return 7;
            } else if (phase === 'Hold') {
              setPhase('Exhale');
              return 8;
            } else {
              setPhase('Inhale');
              setCyclesCompleted((c) => c + 1);
              return 4;
            }
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, phase]);

  const toggleExercise = () => {
    setIsRunning(!isRunning);
  };

  const resetExercise = () => {
    setIsRunning(false);
    setPhase('Inhale');
    setCount(4);
    setCyclesCompleted(0);
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'Inhale':
        return 'Inhale smoothly through your nose...';
      case 'Hold':
        return 'Hold your breath gently. Relax your shoulders...';
      case 'Exhale':
        return 'Exhale slowly through your mouth with a soft whoosh...';
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-28 pt-2" id="resources-screen">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[12px] font-semibold text-secondary uppercase tracking-wider">
          Somatic Regulation
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight font-headline">
          Grounding Resources
        </h1>
        <p className="text-[13px] text-on-surface-variant">
          Clinically verified nervous system regulators designed for high-stress legal proceedings.
        </p>
      </div>

      {/* 4-7-8 Somatic Release Interactive Pacer */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-secondary-container/20 border border-surface-container shadow-xs flex flex-col items-center text-center gap-5">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-secondary" />
            <span className="font-bold text-[16px] text-primary font-headline">
              4-7-8 Somatic Release
            </span>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-secondary-container text-primary">
            Cycles: {cyclesCompleted}
          </span>
        </div>

        {/* Dynamic Expanding/Contracting Breathing Circle */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center my-2">
          {/* Animated Background Ring */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-1000 ${
              phase === 'Inhale'
                ? 'scale-100 bg-secondary-container/60'
                : phase === 'Hold'
                ? 'scale-100 bg-secondary-container/40 animate-pulse'
                : 'scale-75 bg-secondary-container/20'
            }`}
          />

          {/* Inner Circle */}
          <div
            className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-primary text-on-primary flex flex-col items-center justify-center shadow-lg transition-transform duration-1000 ${
              phase === 'Inhale'
                ? 'scale-110'
                : phase === 'Hold'
                ? 'scale-110'
                : 'scale-90'
            }`}
          >
            <span className="text-[12px] font-medium tracking-wide uppercase opacity-80">
              {phase}
            </span>
            <span className="text-4xl font-bold font-headline">{count}</span>
          </div>
        </div>

        {/* Phase Guidance Text */}
        <p className="text-[13.5px] font-medium text-primary max-w-sm h-10 flex items-center justify-center">
          {isRunning ? getPhaseInstruction() : 'Press Start to begin guided autonomic downregulation.'}
        </p>

        {/* Pacer Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleExercise}
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-[13.5px] shadow-sm hover:bg-primary-container transition-all flex items-center gap-2 cursor-pointer"
            type="button"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Pause' : 'Start Pacer'}</span>
          </button>

          <button
            onClick={resetExercise}
            className="p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-secondary transition-colors cursor-pointer"
            type="button"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Protocol Library Accordions */}
      <div className="flex flex-col gap-3">
        <h2 className="text-[14px] font-bold text-primary font-headline">
          Clinical De-escalation Library
        </h2>

        {/* Card 1: 5-4-3-2-1 Sensory Grounding */}
        <div className="rounded-2xl bg-surface-container-lowest border border-surface-container overflow-hidden shadow-xs">
          <button
            onClick={() => setExpandedCard(expandedCard === 'sensory' ? null : 'sensory')}
            className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-surface-container-low/50 transition-colors"
            type="button"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-secondary-container text-primary flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="font-bold text-[14px] text-primary block font-headline">
                  5-4-3-2-1 Sensory Reset
                </span>
                <span className="text-[12px] text-on-surface-variant">
                  Dissolve acute anticipatory anxiety before meetings
                </span>
              </div>
            </div>
            {expandedCard === 'sensory' ? (
              <ChevronUp className="w-4 h-4 text-secondary" />
            ) : (
              <ChevronDown className="w-4 h-4 text-secondary" />
            )}
          </button>

          {expandedCard === 'sensory' && (
            <div className="px-5 pb-5 pt-1 text-[13px] text-on-surface leading-relaxed border-t border-surface-container flex flex-col gap-2 bg-surface-container-low/30">
              <div className="p-2 rounded-lg bg-surface-container-low">
                <strong>5:</strong> Acknowledge 5 things you see around you (e.g. wood grain, window light).
              </div>
              <div className="p-2 rounded-lg bg-surface-container-low">
                <strong>4:</strong> Acknowledge 4 things you can touch (e.g. cotton sleeves, cool watch band).
              </div>
              <div className="p-2 rounded-lg bg-surface-container-low">
                <strong>3:</strong> Acknowledge 3 sounds you hear (e.g. air conditioning, distant tires).
              </div>
              <div className="p-2 rounded-lg bg-surface-container-low">
                <strong>2:</strong> Acknowledge 2 scents you can smell.
              </div>
              <div className="p-2 rounded-lg bg-surface-container-low">
                <strong>1:</strong> Acknowledge 1 taste or sensation in your mouth.
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Bilateral Vagal Tapping */}
        <div className="rounded-2xl bg-surface-container-lowest border border-surface-container overflow-hidden shadow-xs">
          <button
            onClick={() => setExpandedCard(expandedCard === 'vagus' ? null : 'vagus')}
            className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-surface-container-low/50 transition-colors"
            type="button"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="font-bold text-[14px] text-primary block font-headline">
                  Bilateral Vagus Grounding
                </span>
                <span className="text-[12px] text-on-surface-variant">
                  Cross-body butterfly rhythm to calm sympathetic surge
                </span>
              </div>
            </div>
            {expandedCard === 'vagus' ? (
              <ChevronUp className="w-4 h-4 text-secondary" />
            ) : (
              <ChevronDown className="w-4 h-4 text-secondary" />
            )}
          </button>

          {expandedCard === 'vagus' && (
            <div className="px-5 pb-5 pt-1 text-[13px] text-on-surface leading-relaxed border-t border-surface-container flex flex-col gap-2 bg-surface-container-low/30">
              <p>
                Cross your arms over your chest so your fingertips rest just below each collarbone. Gently alternate tapping left-right-left in an unhurried, rhythmic cadence for 2 to 3 minutes while keeping your eyes softly unfocused.
              </p>
              <div className="p-2.5 rounded-xl bg-secondary-container/30 text-[12px] text-primary font-medium">
                Tip: Recommended by neuropsychologists to reprocess somatic triggers without triggering fight-or-flight freeze.
              </div>
            </div>
          )}
        </div>

        {/* Card 3: Courtroom Composure Playbook */}
        <div className="rounded-2xl bg-surface-container-lowest border border-surface-container overflow-hidden shadow-xs">
          <button
            onClick={() => setExpandedCard(expandedCard === 'court' ? null : 'court')}
            className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-surface-container-low/50 transition-colors"
            type="button"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-secondary-fixed text-primary flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <span className="font-bold text-[14px] text-primary block font-headline">
                  Courtroom Composure Playbook
                </span>
                <span className="text-[12px] text-on-surface-variant">
                  Tactile strategies while on witness stand or in gallery
                </span>
              </div>
            </div>
            {expandedCard === 'court' ? (
              <ChevronUp className="w-4 h-4 text-secondary" />
            ) : (
              <ChevronDown className="w-4 h-4 text-secondary" />
            )}
          </button>

          {expandedCard === 'court' && (
            <div className="px-5 pb-5 pt-1 text-[13px] text-on-surface leading-relaxed border-t border-surface-container flex flex-col gap-2.5 bg-surface-container-low/30">
              <div>
                <strong className="text-primary block">1. The 3-Second Breath Pause</strong>
                When opposing counsel asks a question, allow a full 3 seconds before uttering your first word. This looks thoughtful to the judge and resets vocal cord tension.
              </div>
              <div>
                <strong className="text-primary block">2. Feet Planted Parallel</strong>
                Keep both feet completely flat on the floor. Crossing legs cuts circulation and signals defensive postural tension to your brainstem.
              </div>
              <div>
                <strong className="text-primary block">3. Requesting a Recess</strong>
                If autonomic distress exceeds 8/10, tell Sarah or simply say: "Your Honor, may I take a brief sip of water?"
              </div>
            </div>
          )}
        </div>

        {/* Card 4: Restorative Sleep Hygiene */}
        <div className="rounded-2xl bg-surface-container-lowest border border-surface-container overflow-hidden shadow-xs">
          <button
            onClick={() => setExpandedCard(expandedCard === 'sleep' ? null : 'sleep')}
            className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-surface-container-low/50 transition-colors"
            type="button"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-container text-primary flex items-center justify-center shrink-0">
                <Moon className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <span className="font-bold text-[14px] text-primary block font-headline">
                  Deep Sleep Hygiene Protocol
                </span>
                <span className="text-[12px] text-on-surface-variant">
                  Protecting REM sleep cycles ahead of testimony
                </span>
              </div>
            </div>
            {expandedCard === 'sleep' ? (
              <ChevronUp className="w-4 h-4 text-secondary" />
            ) : (
              <ChevronDown className="w-4 h-4 text-secondary" />
            )}
          </button>

          {expandedCard === 'sleep' && (
            <div className="px-5 pb-5 pt-1 text-[13px] text-on-surface leading-relaxed border-t border-surface-container flex flex-col gap-2 bg-surface-container-low/30">
              <p>
                Disconnect from case email correspondence 2 hours prior to sleep. Perform a 5-minute brain dump into the DYNA MIND qualitative notes to externalize racing thoughts onto encrypted storage.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
