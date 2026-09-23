import React from 'react';
import {
  Phone,
  MessageSquare,
  ShieldAlert,
  HeartHandshake,
  ArrowLeft,
  LifeBuoy,
  Wind,
  Compass,
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface EmergencyScreenProps {
  onNavigate: (tab: NavigationTab) => void;
  onStartBreathing: () => void;
}

export const EmergencyScreen: React.FC<EmergencyScreenProps> = ({
  onNavigate,
  onStartBreathing,
}) => {
  return (
    <div className="flex flex-col gap-6 pb-28 pt-2" id="emergency-screen">
      {/* Back button & Header */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-1 text-[13px] text-secondary hover:text-primary font-medium cursor-pointer w-fit"
          type="button"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed text-tertiary-container flex items-center justify-center shrink-0 shadow-sm">
            <HeartHandshake className="w-6 h-6 text-tertiary-container" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight font-headline">
              Immediate Care Protocol
            </h1>
            <span className="text-[13px] text-on-surface-variant font-medium">
              You are safe. Non-judgmental human support is standing by.
            </span>
          </div>
        </div>
      </div>

      {/* Emergency Hotlines Cards */}
      <div className="flex flex-col gap-3">
        <div className="p-5 rounded-2xl bg-tertiary-container text-on-tertiary shadow-md flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] uppercase tracking-wider font-semibold opacity-90">
              National 24/7 Lifeline
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-semibold">
              Free • Confidential
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-headline">
              Dial 988 Suicide & Crisis Lifeline
            </h2>
            <p className="text-[13px] opacity-90 mt-1 leading-relaxed">
              If legal distress or emotional exhaustion feels overwhelming, speak directly with trained crisis counselors at any time.
            </p>
          </div>

          <a
            href="tel:988"
            className="w-full py-3 px-5 rounded-xl bg-white text-tertiary-container font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-white/90 transition-all shadow-sm cursor-pointer"
          >
            <Phone className="w-5 h-5" />
            <span>Call 988 Now</span>
          </a>
        </div>

        {/* Text line */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] uppercase tracking-wider font-semibold text-secondary">
              Crisis Text Line
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold">
              24/7 via SMS
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-primary font-headline">
              Text HOME to 741741
            </h3>
            <p className="text-[13px] text-on-surface-variant mt-1 leading-relaxed">
              Connect with a volunteer crisis counselor over confidential text message from anywhere in the US.
            </p>
          </div>

          <a
            href="sms:741741"
            className="w-full py-3 px-5 rounded-xl bg-primary text-on-primary font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-primary-container transition-all shadow-sm cursor-pointer"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Send Text to 741741</span>
          </a>
        </div>
      </div>

      {/* Immediate Somatic Grounding Options */}
      <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col gap-3">
        <h3 className="text-[15px] font-bold text-primary font-headline">
          Downregulate Acute Panic Right Now
        </h3>
        <p className="text-[13px] text-on-surface-variant leading-relaxed">
          If your chest is tight and racing thoughts are escalating, pause and let the guided pacer guide your breath.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            onClick={onStartBreathing}
            className="flex-1 py-3 px-4 rounded-xl bg-secondary-container hover:bg-secondary-fixed text-primary font-semibold text-[13px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            type="button"
          >
            <Wind className="w-4 h-4 text-secondary" />
            <span>Launch 4-7-8 Breathing Pacer</span>
          </button>

          <button
            onClick={() => onNavigate('companion')}
            className="flex-1 py-3 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-[13px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
            type="button"
          >
            <LifeBuoy className="w-4 h-4 text-secondary" />
            <span>Talk to Grounding Companion</span>
          </button>
        </div>
      </div>
    </div>
  );
};
