import React, { useState } from 'react';
import {
  User,
  Shield,
  Bell,
  Lock,
  Trash2,
  Check,
  ChevronRight,
  Database,
  Moon,
  Volume2,
} from 'lucide-react';
import { ASSETS } from '../../data/mockData';
import { NavigationTab } from '../../types';

interface SettingsScreenProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenPrivacy: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onNavigate,
  onOpenPrivacy,
}) => {
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState<'calm' | 'gentle' | 'standard'>('calm');
  const [dataSync, setDataSync] = useState(true);
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleClearCache = () => {
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6 pb-28 pt-2" id="settings-screen">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[12px] font-semibold text-secondary uppercase tracking-wider">
          Preferences & Security
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight font-headline">
          Settings
        </h1>
        <p className="text-[13px] text-on-surface-variant">
          Manage your client encryption profile, voice pacer cadence, and telemetry.
        </p>
      </div>

      {/* User Profile Card */}
      <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex items-center gap-4">
        <img
          src={ASSETS.avatar}
          alt="Elena Vance"
          className="w-14 h-14 rounded-full object-cover shadow-xs border-2 border-white shrink-0"
          referrerPolicy="no-referrer"
        />
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[16px] text-primary font-headline truncate">
              Elena Vance
            </span>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-primary font-bold text-[10px]">
              Protected
            </span>
          </div>
          <span className="text-[12px] text-on-surface-variant truncate">
            Case Ref: #CIV-2026-0941
          </span>
          <span className="text-[11px] text-secondary mt-0.5">
            14 longitudinal calibration records active
          </span>
        </div>
      </div>

      {/* Voice & Somatic Pacing */}
      <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-secondary" />
          <h3 className="font-bold text-[15px] text-primary font-headline">
            Voice Pacing & Cadence
          </h3>
        </div>

        <div className="flex items-center justify-between text-[13px]">
          <span className="text-on-surface">Vocal Pace Style</span>
          <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl">
            {(['calm', 'gentle', 'standard'] as const).map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setVoiceSpeed(spd)}
                className={`px-3 py-1 rounded-lg text-[11.5px] font-semibold capitalize transition-all cursor-pointer ${
                  voiceSpeed === spd
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {spd}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-[13px] pt-1 border-t border-surface-container/60">
          <div>
            <span className="text-on-surface font-medium block">Haptic Pocket Vibrations</span>
            <span className="text-[11.5px] text-on-surface-variant">
              Silent rhythmic pulse in pocket during courtroom proceedings
            </span>
          </div>
          <button
            onClick={() => setHapticEnabled(!hapticEnabled)}
            className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative shrink-0 ${
              hapticEnabled ? 'bg-primary' : 'bg-surface-container-high'
            }`}
          >
            <span
              className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                hapticEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Privacy & Cryptography */}
      <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-secondary" />
          <h3 className="font-bold text-[15px] text-primary font-headline">
            Zero-Knowledge Cryptography
          </h3>
        </div>

        <div className="flex items-center justify-between text-[13px]">
          <div>
            <span className="text-on-surface font-medium block">Biometric Sync Control</span>
            <span className="text-[11.5px] text-on-surface-variant">
              Permit legal counsel to monitor high-level autonomic threshold
            </span>
          </div>
          <button
            onClick={() => setDataSync(!dataSync)}
            className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative shrink-0 ${
              dataSync ? 'bg-primary' : 'bg-surface-container-high'
            }`}
          >
            <span
              className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                dataSync ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <button
          onClick={onOpenPrivacy}
          className="w-full py-2.5 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-semibold text-[12.5px] flex items-center justify-between transition-colors cursor-pointer"
        >
          <span>View Cryptographic Certificate & Key Hash</span>
          <ChevronRight className="w-4 h-4 text-secondary" />
        </button>
      </div>

      {/* Clear Cache / Reset */}
      <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-container flex flex-col gap-3">
        <span className="font-bold text-[14px] text-primary font-headline">
          Data Management
        </span>
        <p className="text-[12px] text-on-surface-variant leading-relaxed">
          DYNA MIND encrypts all session audio and distress markers locally. You can clear temporary device storage at any time.
        </p>

        {clearedNotice && (
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 text-[12px] font-semibold text-center">
            Local browser storage cache cleared successfully.
          </div>
        )}

        <button
          onClick={handleClearCache}
          className="w-full py-2.5 px-4 rounded-xl border border-error/30 text-error hover:bg-error-container/20 font-semibold text-[12.5px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Local Session Storage</span>
        </button>
      </div>
    </div>
  );
};
