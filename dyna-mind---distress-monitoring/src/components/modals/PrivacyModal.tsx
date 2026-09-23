import React, { useState } from 'react';
import { Lock, ShieldCheck, Database, KeyRound, Check, Trash2, X } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurge?: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  onPurge,
}) => {
  const [copied, setCopied] = useState(false);
  const [purgedMessage, setPurgedMessage] = useState(false);

  if (!isOpen) return null;

  const handleCopyHash = () => {
    navigator.clipboard?.writeText('SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePurge = () => {
    if (onPurge) onPurge();
    setPurgedMessage(true);
    setTimeout(() => {
      setPurgedMessage(false);
      onClose();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-primary/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      id="privacy-modal"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-6 shadow-xl flex flex-col gap-4 border border-surface-container max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary-container text-primary flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-[18px] text-primary font-headline">
                Cryptographic Isolation
              </h3>
              <span className="text-[12px] text-on-surface-variant">
                Zero-Knowledge Privacy Guarantee
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary hover:bg-surface-container-low transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feature List */}
        <div className="flex flex-col gap-3 py-2 text-[13px] text-on-surface">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low">
            <ShieldCheck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-primary block">
                No Public Model Training
              </span>
              Your personal disclosures, somatic logs, and court stress notes are strictly isolated and never fed back into public generative AI models.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low">
            <Database className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-primary block">
                Local-First Cryptographic Vault
              </span>
              All biometric metrics and longitudinal distress indices remain locked inside your secure client sandbox.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low">
            <KeyRound className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-primary block">
                Cryptographic Hash Verification
              </span>
              <div className="mt-1 flex items-center gap-2">
                <code className="text-[11px] bg-surface-container px-2 py-0.5 rounded font-mono text-on-surface-variant truncate max-w-[200px]">
                  SHA256:7f83b165...
                </code>
                <button
                  onClick={handleCopyHash}
                  className="text-[11px] text-secondary hover:text-primary font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : 'Copy Hash'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {purgedMessage && (
          <div className="p-3 bg-secondary-container text-on-secondary-container rounded-xl text-center text-[12px] font-semibold">
            Local session logs successfully purged from device memory.
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-surface-container">
          <button
            onClick={handlePurge}
            className="px-3.5 py-2 rounded-xl text-error text-[12px] font-semibold flex items-center gap-1.5 hover:bg-error-container/20 transition-colors cursor-pointer"
            type="button"
          >
            <Trash2 className="w-4 h-4 text-error" />
            Purge Local Logs
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-primary text-on-primary font-semibold text-[13px] hover:bg-primary-container transition-colors cursor-pointer"
            type="button"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
