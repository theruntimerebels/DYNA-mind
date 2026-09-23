import React, { useState } from 'react';
import {
  HeartPulse,
  Mic,
  Sparkles,
  CheckCircle2,
  Compass,
  ArrowRight,
  Bot,
  Activity,
} from 'lucide-react';
import { NavigationTab, CheckinRecord } from '../../types';

interface CheckinScreenProps {
  onSaveCheckin: (record: CheckinRecord) => void;
  onNavigateToCompanion: () => void;
  onNavigateToResources: () => void;
}

export const CheckinScreen: React.FC<CheckinScreenProps> = ({
  onSaveCheckin,
  onNavigateToCompanion,
  onNavigateToResources,
}) => {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([
    'Court Stress',
    'Somatic Tension',
  ]);
  const [chestTightness, setChestTightness] = useState<number>(5);
  const [jawClenching, setJawClenching] = useState<number>(6);
  const [sleepDisruption, setSleepDisruption] = useState<number>(4);
  const [selectedTrigger, setSelectedTrigger] = useState<string>('Court Correspondence');
  const [notes, setNotes] = useState<string>('');
  const [isRecordingMemo, setIsRecordingMemo] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const emotionsList = [
    'Grounded',
    'Steady',
    'Court Stress',
    'Overwhelmed',
    'Relieved',
    'Somatic Tension',
    'Foggy',
  ];

  const triggersList = [
    'Court Correspondence',
    'Deposition Review',
    'Interpersonal',
    'Physiological Fatigue',
    'Physical Environment',
  ];

  const toggleEmotion = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter((e) => e !== emotion));
    } else {
      setSelectedEmotions([...selectedEmotions, emotion]);
    }
  };

  const getSeverityLabel = (val: number) => {
    if (val === 0) return { label: 'None', color: 'text-emerald-700 bg-emerald-100' };
    if (val <= 3) return { label: 'Mild', color: 'text-emerald-800 bg-emerald-100' };
    if (val <= 6) return { label: 'Moderate', color: 'text-amber-800 bg-amber-100' };
    return { label: 'Acute', color: 'text-tertiary-container bg-tertiary-fixed' };
  };

  const handleVoiceMemoToggle = () => {
    if (isRecordingMemo) {
      setIsRecordingMemo(false);
      setNotes((prev) =>
        prev
          ? `${prev} [Voice Note: Noted slight chest tremor while reading notice.]`
          : 'Noted slight chest tremor while reading hearing notice.'
      );
      setRecordSeconds(0);
    } else {
      setIsRecordingMemo(true);
      setRecordSeconds(0);
      const timer = setInterval(() => {
        setRecordSeconds((s) => {
          if (s >= 15) {
            clearInterval(timer);
            return s;
          }
          return s + 1;
        });
      }, 1000);
    }
  };

  const handleSave = () => {
    const record: CheckinRecord = {
      id: `chk-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      emotions: selectedEmotions,
      somatic: {
        chest: chestTightness,
        jaw: jawClenching,
        sleep: sleepDisruption,
      },
      trigger: selectedTrigger,
      notes,
    };

    onSaveCheckin(record);
    setSavedSuccess(true);
    setTimeout(() => {
      onNavigateToResources();
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6 pb-28 pt-2" id="checkin-screen">
      {/* Step Header & Progress */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold text-secondary uppercase tracking-wider">
            Step 2 of 3 • Afternoon Calibration
          </span>
          <span className="text-[12px] font-semibold text-primary">66%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
          <div className="bg-primary h-full rounded-full transition-all duration-300 w-2/3" />
        </div>

        <div className="pt-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight font-headline">
            How is your system holding today?
          </h1>
          <p className="text-[13.5px] text-on-surface-variant leading-relaxed mt-1">
            Calibrating real-time somatic variance against your established 14-day baseline norm.
          </p>
        </div>
      </div>

      {/* Emotional Resonance Section */}
      <div className="flex flex-col gap-2.5 p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-primary font-headline">
            Emotional Resonance
          </span>
          <span className="text-[11px] text-secondary">Multi-select</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {emotionsList.map((emotion) => {
            const isSelected = selectedEmotions.includes(emotion);
            return (
              <button
                key={emotion}
                type="button"
                onClick={() => toggleEmotion(emotion)}
                className={`px-3.5 py-2 rounded-xl text-[13px] transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-primary text-on-primary border-primary font-semibold shadow-xs'
                    : 'bg-surface-container-low text-on-surface border-surface-container hover:bg-surface-container'
                }`}
              >
                {emotion}
              </button>
            );
          })}
        </div>
      </div>

      {/* Somatic Distress Check (Sliders) */}
      <div className="flex flex-col gap-5 p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[13px] font-semibold text-primary font-headline block">
              Somatic Distress Check
            </span>
            <span className="text-[11px] text-on-surface-variant">
              Autonomic equilibrium indicators (0 = none, 10 = acute)
            </span>
          </div>
          <HeartPulse className="w-5 h-5 text-secondary" />
        </div>

        {/* Slider 1: Chest tightness */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-on-surface">
              Chest tightness & shallow breath
            </span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                getSeverityLabel(chestTightness).color
              }`}
            >
              {getSeverityLabel(chestTightness).label} ({chestTightness}/10)
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={chestTightness}
            onChange={(e) => setChestTightness(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer h-2 bg-surface-container rounded-lg"
          />
        </div>

        {/* Slider 2: Jaw / shoulder clenching */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-on-surface">
              Jaw & shoulder clenching
            </span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                getSeverityLabel(jawClenching).color
              }`}
            >
              {getSeverityLabel(jawClenching).label} ({jawClenching}/10)
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={jawClenching}
            onChange={(e) => setJawClenching(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer h-2 bg-surface-container rounded-lg"
          />
        </div>

        {/* Slider 3: Sleep disruption */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-on-surface">
              Sleep fragmentation & early waking
            </span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                getSeverityLabel(sleepDisruption).color
              }`}
            >
              {getSeverityLabel(sleepDisruption).label} ({sleepDisruption}/10)
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={sleepDisruption}
            onChange={(e) => setSleepDisruption(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer h-2 bg-surface-container rounded-lg"
          />
        </div>
      </div>

      {/* Contextual Anchors / Triggers */}
      <div className="flex flex-col gap-2.5 p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
        <span className="text-[13px] font-semibold text-primary font-headline">
          Primary Contextual Trigger
        </span>
        <div className="flex flex-wrap gap-2">
          {triggersList.map((trigger) => {
            const isSelected = selectedTrigger === trigger;
            return (
              <button
                key={trigger}
                type="button"
                onClick={() => setSelectedTrigger(trigger)}
                className={`px-3 py-1.5 rounded-xl text-[12.5px] transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-secondary text-on-secondary border-secondary font-semibold'
                    : 'bg-surface-container-low text-on-surface border-surface-container hover:bg-surface-container'
                }`}
              >
                {trigger}
              </button>
            );
          })}
        </div>
      </div>

      {/* Qualitative Notes & Voice Memo */}
      <div className="flex flex-col gap-3 p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-primary font-headline">
            Qualitative Record
          </span>
          <button
            type="button"
            onClick={handleVoiceMemoToggle}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
              isRecordingMemo
                ? 'bg-tertiary-container text-on-tertiary animate-pulse'
                : 'bg-secondary-container/50 text-secondary hover:bg-secondary-container'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{isRecordingMemo ? `Recording (${recordSeconds}s)...` : 'Voice Memo'}</span>
          </button>
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Add qualitative observations (e.g. physical sensations when opening legal emails)..."
          className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-container text-[13px] text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-secondary resize-none"
        />
      </div>

      {/* Dynamic Baseline Calibration progress bar */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container flex flex-col gap-2">
        <div className="flex items-center justify-between text-[12px]">
          <span className="font-semibold text-primary">Dynamic Baseline Calibration</span>
          <span className="text-secondary font-semibold">Day 15 / 21</span>
        </div>
        <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
          <div className="bg-secondary h-full rounded-full w-[71%]" />
        </div>
        <span className="text-[11px] text-on-surface-variant">
          High confidence baseline established. Algorithm actively filters normal somatic fluctuations from trauma surges.
        </span>
      </div>

      {/* Adaptive Recommendation Card */}
      <div className="p-4 rounded-2xl bg-secondary-container/30 border border-secondary/20 flex items-start gap-3">
        <Compass className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-bold text-primary font-headline">
            Adaptive Recommendation: Bilateral Vagus Grounding
          </span>
          <p className="text-[12px] text-on-surface leading-relaxed">
            With moderate jaw clenching ({jawClenching}/10) linked to {selectedTrigger}, 3 minutes of tactile grounding will lower cortisol prior to your evening review.
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-100 text-emerald-800 text-[13px] font-semibold flex items-center justify-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          Check-in recorded into your secure longitudinal baseline!
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 py-3 px-5 rounded-xl bg-primary text-on-primary font-semibold text-[13.5px] shadow-sm hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Save & Continue to Grounding</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onNavigateToCompanion}
          className="py-3 px-5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-[13.5px] transition-colors flex items-center justify-center gap-2 cursor-pointer border border-surface-container"
        >
          <Bot className="w-4 h-4 text-secondary" />
          <span>Talk to AI Companion</span>
        </button>
      </div>
    </div>
  );
};
