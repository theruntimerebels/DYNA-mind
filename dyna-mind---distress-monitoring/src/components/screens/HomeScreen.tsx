import React, { useState } from 'react';
import {
  Mic,
  Bot,
  Activity,
  HeartPulse,
  Wind,
  ShieldCheck,
  ChevronRight,
  TrendingDown,
  Moon,
  Clock,
  Sparkles,
  PhoneCall,
  Calendar,
} from 'lucide-react';
import { ASSETS } from '../../data/mockData';
import { NavigationTab, BiometricIndicators } from '../../types';

interface HomeScreenProps {
  biometrics: BiometricIndicators;
  onNavigate: (tab: NavigationTab) => void;
  onStartVoice: () => void;
  onEmergency: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  biometrics,
  onNavigate,
  onStartVoice,
  onEmergency,
}) => {
  const [selectedSomatic, setSelectedSomatic] = useState<string>('⚡ Tense');
  const [somaticFeedback, setSomaticFeedback] = useState<string | null>(null);

  const somaticStates = [
    { label: '🌱 Relaxed', desc: 'Vagal tone optimal. Excellent capacity for cognitive processing.' },
    { label: '🌊 Heavy', desc: 'Emotional load detected. Prioritize quiet pacing and hydration.' },
    { label: '⚡ Tense', desc: 'Sympathetic arousal noted. Shoulders and jaw release advised.' },
    { label: '🌪️ Anxious', desc: 'Anticipatory court surge. Engage 4-7-8 somatic breathing.' },
    { label: '☁️ Exhausted', desc: 'Recovery deficit. Allocate 15 min restorative stillness.' },
  ];

  const handleSelectSomatic = (item: typeof somaticStates[0]) => {
    setSelectedSomatic(item.label);
    setSomaticFeedback(item.desc);
  };

  return (
    <div className="flex flex-col gap-6 pb-28 pt-2" id="home-screen">
      {/* Greeting & Baseline Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold text-secondary uppercase tracking-wider">
            Daily Stabilization
          </span>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container/60 text-primary text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            Anchored Baseline v2.4
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight font-headline">
            Good morning, Elena
          </h1>
          <span className="text-[13px] text-on-surface-variant">
            Stability Quotient: <strong className="text-primary font-semibold">{biometrics.stabilityQuotient}%</strong> (Within safe corridor)
          </span>
        </div>
      </div>

      {/* Grounding Reflection Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-secondary-container/20 p-5 sm:p-6 border border-surface-container shadow-[0_4px_20px_rgba(77,72,102,0.06)]">
        <div className="flex flex-col gap-4 relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="inline-flex items-center gap-1.5 text-secondary text-[12px] font-bold tracking-wide uppercase">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span>Morning Grounding Protocol</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-primary font-headline">
                Grounding Reflection
              </h2>
              <p className="text-[13.5px] text-on-surface-variant leading-relaxed max-w-lg">
                Take a quiet moment to regulate your breathing and center your nervous system before reviewing today’s legal correspondence.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={onStartVoice}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-[13px] shadow-sm hover:bg-primary-container transition-all cursor-pointer group"
              type="button"
            >
              <Mic className="w-4 h-4 text-on-primary group-hover:scale-110 transition-transform" />
              <span>Start Voice Reflection</span>
            </button>

            <button
              onClick={() => onNavigate('checkin')}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-[13px] transition-colors cursor-pointer"
              type="button"
            >
              <span>Log Somatic State</span>
              <ChevronRight className="w-3.5 h-3.5 text-secondary" />
            </button>
          </div>
        </div>
      </div>

      {/* Today's Somatic State Selector */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-primary font-headline">
            Today's Somatic State
          </span>
          <span className="text-[11px] text-secondary">
            Tap to record quick pulse
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {somaticStates.map((item) => {
            const isSelected = selectedSomatic === item.label;
            return (
              <button
                key={item.label}
                onClick={() => handleSelectSomatic(item)}
                type="button"
                className={`px-3.5 py-2 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-primary text-on-primary border-primary shadow-xs font-semibold scale-102'
                    : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-low border-surface-container'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {somaticFeedback && (
          <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container text-[12px] text-on-surface-variant flex items-center gap-2 animate-in fade-in duration-200">
            <Activity className="w-4 h-4 text-secondary shrink-0" />
            <span>{somaticFeedback}</span>
          </div>
        )}
      </div>

      {/* 2x2 Support Tools Grid */}
      <div className="flex flex-col gap-3">
        <span className="text-[13px] font-semibold text-primary font-headline">
          Longitudinal Support Toolkit
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Card 1: AI Companion */}
          <button
            onClick={() => onNavigate('companion')}
            className="flex items-start gap-3.5 p-4 rounded-2xl bg-surface-container-lowest border border-surface-container hover:border-secondary/40 shadow-[0_2px_10px_rgba(77,72,102,0.03)] hover:shadow-md transition-all text-left cursor-pointer group"
            type="button"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary-container text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[14px] text-primary font-headline">
                  AI Companion
                </span>
                <ChevronRight className="w-4 h-4 text-secondary group-hover:translate-x-0.5 transition-transform" />
              </div>
              <span className="text-[12px] text-on-surface-variant line-clamp-2 mt-0.5 leading-snug">
                Confidential dialogue, trauma reframing & real-time grounding.
              </span>
            </div>
          </button>

          {/* Card 2: Case Stress Pacer */}
          <button
            onClick={() => onNavigate('timeline')}
            className="flex items-start gap-3.5 p-4 rounded-2xl bg-surface-container-lowest border border-surface-container hover:border-secondary/40 shadow-[0_2px_10px_rgba(77,72,102,0.03)] hover:shadow-md transition-all text-left cursor-pointer group"
            type="button"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[14px] text-primary font-headline">
                  Case Stress Pacer
                </span>
                <ChevronRight className="w-4 h-4 text-secondary group-hover:translate-x-0.5 transition-transform" />
              </div>
              <span className="text-[12px] text-on-surface-variant line-clamp-2 mt-0.5 leading-snug">
                3 days until Preliminary Hearing • Autonomic surge forecast.
              </span>
            </div>
          </button>

          {/* Card 3: Midday Pulse Check-in */}
          <button
            onClick={() => onNavigate('checkin')}
            className="flex items-start gap-3.5 p-4 rounded-2xl bg-surface-container-lowest border border-surface-container hover:border-secondary/40 shadow-[0_2px_10px_rgba(77,72,102,0.03)] hover:shadow-md transition-all text-left cursor-pointer group"
            type="button"
          >
            <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-tertiary-container flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-5 h-5 text-tertiary-container" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[14px] text-primary font-headline">
                  Wellbeing Check-in
                </span>
                <ChevronRight className="w-4 h-4 text-secondary group-hover:translate-x-0.5 transition-transform" />
              </div>
              <span className="text-[12px] text-on-surface-variant line-clamp-2 mt-0.5 leading-snug">
                Step 2 calibration • Somatic tension & chest tightness tracker.
              </span>
            </div>
          </button>

          {/* Card 4: 4-7-8 Somatic Release */}
          <button
            onClick={() => onNavigate('resources')}
            className="flex items-start gap-3.5 p-4 rounded-2xl bg-surface-container-lowest border border-surface-container hover:border-secondary/40 shadow-[0_2px_10px_rgba(77,72,102,0.03)] hover:shadow-md transition-all text-left cursor-pointer group"
            type="button"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Wind className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[14px] text-primary font-headline">
                  4-7-8 Somatic Release
                </span>
                <ChevronRight className="w-4 h-4 text-secondary group-hover:translate-x-0.5 transition-transform" />
              </div>
              <span className="text-[12px] text-on-surface-variant line-clamp-2 mt-0.5 leading-snug">
                Guided vagal rhythm to downregulate sympathetic spike.
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Sanctuary Visual Anchor */}
      <div className="relative rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(77,72,102,0.08)] border border-surface-container group">
        <img
          src={ASSETS.sanctuary}
          alt="Peaceful sanctuary tea & sunlight space"
          className="w-full h-44 sm:h-52 object-cover transition-transform duration-700 group-hover:scale-103"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent flex flex-col justify-end p-4 sm:p-5 text-white">
          <span className="text-[11px] font-semibold text-secondary-container tracking-wider uppercase">
            Sanctuary Anchor
          </span>
          <h3 className="text-base sm:text-lg font-bold font-headline mt-0.5">
            Elena’s Mindful Haven
          </h3>
          <p className="text-[12px] text-white/90 leading-snug max-w-md">
            10 minutes allocated today. Unplug from legal notifications and preserve your cognitive baseline.
          </p>
        </div>
      </div>

      {/* Biometric Trajectory Summary Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Distress Index Tile */}
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-secondary">
              Distress Index
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-secondary-container/50 px-2 py-0.5 rounded-full">
              <TrendingDown className="w-3 h-3 text-secondary" />
              -14% vs 7d Mean
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary font-headline">
              {biometrics.distressIndex}
            </span>
            <span className="text-[13px] text-on-surface-variant font-medium">/ 100</span>
          </div>

          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${biometrics.distressIndex}%` }}
            />
          </div>

          <span className="text-[11px] text-on-surface-variant">
            Autonomic distress is safely controlled in the anchored zone.
          </span>
        </div>

        {/* Sleep & Restoration Tile */}
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-secondary">
              Restoration & Sleep
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary bg-surface-container px-2 py-0.5 rounded-full">
              <Moon className="w-3 h-3 text-secondary" />
              REM: 3.2 hrs
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary font-headline">
              {biometrics.sleepHours}
            </span>
            <span className="text-[13px] text-on-surface-variant font-medium">hours</span>
          </div>

          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
            <div
              className="bg-secondary h-full rounded-full transition-all duration-500"
              style={{ width: `${(biometrics.sleepHours / 9) * 100}%` }}
            />
          </div>

          <span className="text-[11px] text-on-surface-variant">
            Restorative deep sleep index improved by +8% last night.
          </span>
        </div>
      </div>

      {/* Court Proximity Pacer with Predictive Curve */}
      <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
              Legal Milestone Proximity
            </span>
            <h3 className="font-bold text-[16px] text-primary font-headline mt-0.5">
              Preliminary Evidentiary Hearing
            </h3>
            <span className="text-[12px] text-on-surface-variant">
              In 3 Days • Tuesday, Nov 12 • 09:30 AM
            </span>
          </div>

          <button
            onClick={() => onNavigate('timeline')}
            className="px-3 py-1 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-[12px] transition-colors cursor-pointer"
          >
            Details →
          </button>
        </div>

        {/* Spline Sparkline */}
        <div className="py-1">
          <div className="flex items-center justify-between text-[11px] text-on-surface-variant mb-1">
            <span>Anticipatory Stress Model</span>
            <span className="font-semibold text-tertiary-container">Surge Window: Nov 11-13</span>
          </div>
          <svg className="w-full h-16 overflow-visible" viewBox="0 0 300 60" preserveAspectRatio="none">
            <defs>
              <linearGradient id="homeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5e5b7a" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#5e5b7a" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Safe corridor band */}
            <rect x="0" y="25" width="300" height="25" fill="#ded9fe" fillOpacity="0.3" rx="4" />
            <path
              d="M 0,42 Q 50,38 100,40 T 200,28 T 260,18 T 300,32"
              fill="none"
              stroke="#5e5b7a"
              strokeWidth="2.5"
            />
            <path
              d="M 0,42 Q 50,38 100,40 T 200,28 T 260,18 T 300,32 L 300,60 L 0,60 Z"
              fill="url(#homeGrad)"
            />
            {/* Current point */}
            <circle cx="100" cy="40" r="4" fill="#36314e" stroke="#ffffff" strokeWidth="2" />
            {/* Hearing spike point */}
            <circle cx="260" cy="18" r="4" fill="#6d003c" stroke="#ffffff" strokeWidth="2" />
          </svg>
        </div>

        <div className="p-2.5 rounded-xl bg-surface-container-low text-[12px] text-on-surface-variant leading-relaxed">
          <strong className="text-primary font-semibold">Adaptive Guidance:</strong> Activate courtroom pocket mode 15 minutes prior to entry. Practice 3-second tactile anchoring on your bracelet if somatic distress peaks.
        </div>
      </div>

      {/* Human Care Specialist Prompt */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary-container text-primary flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <span className="text-[13px] font-bold text-primary font-headline block">
              Clinical & Crisis Safety Circle
            </span>
            <span className="text-[12px] text-on-surface-variant">
              Immediate connection to 988 Lifeline & crisis navigators.
            </span>
          </div>
        </div>

        <button
          onClick={onEmergency}
          className="px-3.5 py-2 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed font-semibold text-[12px] hover:bg-tertiary-fixed-dim transition-colors cursor-pointer shrink-0"
        >
          Care Support
        </button>
      </div>
    </div>
  );
};
