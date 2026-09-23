import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Phone,
  MessageSquare,
  VolumeX,
  Compass,
  Vibrate,
  ChevronRight,
} from 'lucide-react';
import { ASSETS } from '../../data/mockData';
import { NavigationTab } from '../../types';

interface TimelineScreenProps {
  onNavigateToResources: () => void;
  onNavigateToCompanion: () => void;
}

export const TimelineScreen: React.FC<TimelineScreenProps> = ({
  onNavigateToResources,
  onNavigateToCompanion,
}) => {
  const [pocketModeActive, setPocketModeActive] = useState(false);
  const [biometricSync, setBiometricSync] = useState(true);
  const [pocketBeat, setPocketBeat] = useState(0);

  const togglePocketMode = () => {
    setPocketModeActive(!pocketModeActive);
    if (!pocketModeActive && navigator.vibrate) {
      navigator.vibrate([100, 200, 100]);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-28 pt-2" id="timeline-screen">
      {/* Title & Case Reference */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold text-secondary uppercase tracking-wider">
            Legal Readiness & Chronology
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-primary text-[11px] font-mono font-semibold">
            #CIV-2026-0941
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight font-headline">
          Case Timeline
        </h1>
        <p className="text-[13px] text-on-surface-variant">
          Correlating civil proceedings milestones with autonomic nervous system readiness.
        </p>
      </div>

      {/* Active Milestone Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-secondary-container/20 p-5 sm:p-6 border border-surface-container shadow-[0_4px_20px_rgba(77,72,102,0.06)] flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold text-[11px] w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-pulse" />
              Active Milestone • In 3 Days
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-primary font-headline mt-1">
              Preliminary Evidentiary Hearing
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-[12.5px] text-on-surface-variant mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-secondary" />
                Tuesday, Nov 12, 2026
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-secondary" />
                09:30 AM EST
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-secondary" />
                Courtroom 4B, 3rd Circuit
              </span>
            </div>
          </div>
        </div>

        {/* Anticipated Autonomic Stress Trajectory */}
        <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11.5px]">
            <span className="font-semibold text-primary">Anticipated Autonomic Surge</span>
            <span className="text-tertiary-container font-bold">Surge Level: High (76/100)</span>
          </div>

          <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
            <div className="bg-tertiary-container h-full rounded-full w-[76%]" />
          </div>

          <p className="text-[12px] text-on-surface-variant leading-snug">
            Sympathetic spike anticipated during cross-examination review. Somatic pocket anchoring recommended.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={onNavigateToResources}
            className="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-[13px] shadow-sm hover:bg-primary-container transition-all flex items-center gap-2 cursor-pointer"
            type="button"
          >
            <Compass className="w-4 h-4" />
            <span>3-Min Pre-Court Meditation</span>
          </button>

          <button
            onClick={onNavigateToCompanion}
            className="px-3.5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-[13px] transition-colors flex items-center gap-2 cursor-pointer border border-surface-container"
            type="button"
          >
            <Sparkles className="w-4 h-4 text-secondary" />
            <span>Rehearse Testimony Grounding</span>
          </button>
        </div>
      </div>

      {/* Courtroom Grounding Protocol & Pocket Mode */}
      <div className="p-5 sm:p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-secondary" />
            <h3 className="font-bold text-[16px] text-primary font-headline">
              Courtroom Grounding Protocol
            </h3>
          </div>
          <span className="text-[11px] text-secondary font-semibold">
            Subtle & Undetectable
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12.5px]">
          <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-1">
            <span className="font-semibold text-primary">Subtle Tactile Anchor</span>
            <span className="text-on-surface-variant">
              Press your left thumb firmly against the inner index knuckle for 5 seconds to reset autonomic focus while on the stand.
            </span>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-1">
            <span className="font-semibold text-primary">Boxed Exhale Delay</span>
            <span className="text-on-surface-variant">
              Extend each exhale by 2 extra seconds before answering questions to activate the vagus nerve and steady your vocal cadence.
            </span>
          </div>
        </div>

        {/* Interactive Pocket Mode Button */}
        <div className="p-4 rounded-xl bg-secondary-container/40 border border-secondary/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                pocketModeActive
                  ? 'bg-secondary text-on-secondary scale-105 animate-pulse'
                  : 'bg-surface-container text-secondary'
              }`}
            >
              <Vibrate className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[13px] font-bold text-primary block">
                {pocketModeActive ? 'Pocket Mode Active' : 'Somatic Pocket Mode (Haptic)'}
              </span>
              <span className="text-[11px] text-on-surface-variant">
                Silent tactile haptic vibrations pace your breath in your pocket without sound.
              </span>
            </div>
          </div>

          <button
            onClick={togglePocketMode}
            className={`px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-colors cursor-pointer shrink-0 ${
              pocketModeActive
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container hover:bg-surface-container-high text-primary border border-surface-container'
            }`}
            type="button"
          >
            {pocketModeActive ? 'Stop Pacer' : 'Activate'}
          </button>
        </div>
      </div>

      {/* Vertical Case Progression & Bio-markers Timeline */}
      <div className="p-5 sm:p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col gap-4">
        <h3 className="font-bold text-[16px] text-primary font-headline">
          Chronological Bio-Milestones
        </h3>

        <div className="relative pl-6 flex flex-col gap-6 border-l-2 border-surface-container ml-2">
          {/* Milestone 1 */}
          <div className="relative flex flex-col gap-1">
            <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-primary">
                Initial Deposition Submission
              </span>
              <span className="text-[11px] text-on-surface-variant">Oct 14</span>
            </div>
            <p className="text-[12px] text-on-surface-variant">
              Completed successfully. Somatic distress peaked at 68/100, stabilized within 48h using evening debriefs.
            </p>
          </div>

          {/* Milestone 2 */}
          <div className="relative flex flex-col gap-1">
            <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-primary">
                Cross-Examination Outline Reviewed
              </span>
              <span className="text-[11px] text-on-surface-variant">Oct 28</span>
            </div>
            <p className="text-[12px] text-on-surface-variant">
              Attended with counsel Sarah Mitchell. Somatic tension rated 52/100.
            </p>
          </div>

          {/* Milestone 3: Active */}
          <div className="relative flex flex-col gap-1 p-3 rounded-xl bg-secondary-container/30 border border-secondary/20 -ml-2">
            <span className="absolute -left-[23px] top-4 w-4 h-4 rounded-full bg-primary border-2 border-white animate-ping" />
            <span className="absolute -left-[23px] top-4 w-4 h-4 rounded-full bg-primary border-2 border-white" />
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-primary">
                Preliminary Evidentiary Hearing
              </span>
              <span className="text-[11px] font-bold text-tertiary-container">
                Nov 12 (In 3 Days)
              </span>
            </div>
            <p className="text-[12px] text-on-surface">
              Primary evidentiary hearing before presiding judge. Autonomous stress protection active.
            </p>
          </div>

          {/* Milestone 4: Projected */}
          <div className="relative flex flex-col gap-1">
            <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-surface-container-high border-2 border-white" />
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-on-surface-variant">
                Projected Judicial Review
              </span>
              <span className="text-[11px] text-on-surface-variant">Dec 04</span>
            </div>
            <p className="text-[12px] text-on-surface-variant">
              Estimated court determination and subsequent case scheduling.
            </p>
          </div>
        </div>
      </div>

      {/* Legal Support Circle */}
      <div className="p-5 sm:p-6 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-[16px] text-primary font-headline">
            Legal Advocacy Circle
          </h3>
          <span className="text-[11px] text-secondary font-semibold">
            Confidential Counsel
          </span>
        </div>

        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-surface-container-low border border-surface-container">
          <img
            src={ASSETS.sarahMitchell}
            alt="Sarah Mitchell, J.D."
            className="w-12 h-12 rounded-full object-cover shadow-xs border border-white shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-bold text-[14px] text-primary font-headline truncate">
              Sarah Mitchell, J.D.
            </span>
            <span className="text-[12px] text-on-surface-variant truncate">
              Lead Advocate • Mitchell & Partners Legal
            </span>
            <span className="text-[11px] text-secondary mt-0.5">
              Available for pre-hearing prep
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href="sms:5551234567"
              className="w-9 h-9 rounded-xl bg-surface-container text-secondary hover:text-primary flex items-center justify-center transition-colors"
              title="Message Sarah"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
            <a
              href="tel:5551234567"
              className="w-9 h-9 rounded-xl bg-primary text-on-primary hover:bg-primary-container flex items-center justify-center transition-colors"
              title="Call Sarah"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Biometric Sync Control */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container text-[12px]">
          <div>
            <span className="font-semibold text-primary block">
              Biometric Recess Sync
            </span>
            <span className="text-on-surface-variant">
              Shares high-level distress threshold with Sarah so she can request strategic recesses if autonomic distress peaks.
            </span>
          </div>
          <button
            onClick={() => setBiometricSync(!biometricSync)}
            className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative shrink-0 ml-3 ${
              biometricSync ? 'bg-primary' : 'bg-surface-container-high'
            }`}
          >
            <span
              className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                biometricSync ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
