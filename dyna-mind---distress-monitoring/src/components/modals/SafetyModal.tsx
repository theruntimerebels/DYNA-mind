import React from 'react';
import { Phone, MessageSquare, ShieldAlert, HeartHandshake } from 'lucide-react';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-primary/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      id="safety-modal"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl p-6 shadow-xl flex flex-col gap-4 border border-surface-container">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0 shadow-sm">
            <HeartHandshake className="w-6 h-6 text-tertiary-container" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-[20px] text-primary font-headline">
              You are not alone.
            </h3>
            <span className="text-[12px] font-semibold text-on-surface-variant">
              Immediate Care Protocol
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-[14px] text-on-surface leading-relaxed">
          If your situation feels unbearable, or your thoughts are turning toward self-harm, compassionate professionals are standing by right now without judgment.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-1">
          <a
            className="w-full py-3 px-4 rounded-xl bg-tertiary-container text-on-tertiary flex items-center justify-between font-semibold text-[14px] shadow-sm hover:opacity-95 transition-opacity"
            href="tel:988"
          >
            <div className="flex items-center gap-2.5">
              <Phone className="w-5 h-5" />
              <span>Dial 988 Crisis Lifeline</span>
            </div>
            <span className="text-[11px] opacity-90 font-normal">24/7 • Free</span>
          </a>

          <a
            className="w-full py-2.5 px-4 rounded-xl bg-surface-container text-primary flex items-center justify-between font-semibold text-[14px] hover:bg-surface-container-high transition-colors"
            href="sms:741741"
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-5 h-5 text-secondary" />
              <span>Text HOME to 741741</span>
            </div>
            <span className="text-[11px] text-on-surface-variant font-normal">Confidential</span>
          </a>

          <button
            className="w-full py-2.5 px-4 rounded-xl text-secondary hover:bg-surface-container-low text-[13px] font-medium text-center mt-1 transition-colors cursor-pointer"
            onClick={onClose}
            type="button"
          >
            Return to Companion Dialogue
          </button>
        </div>
      </div>
    </div>
  );
};
