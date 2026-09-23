import React, { useState } from 'react';

interface ConfigureScalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (config: any) => void;
}

export const ConfigureScalesModal: React.FC<ConfigureScalesModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [phqCutoff, setPhqCutoff] = useState(15);
  const [gadCutoff, setGadCutoff] = useState(15);
  const [pssCutoff, setPssCutoff] = useState(27);
  const [reassessmentDays, setReassessmentDays] = useState(14);
  const [autoTier3Alert, setAutoTier3Alert] = useState(true);
  const [item9Flag, setItem9Flag] = useState(true);
  const [successToast, setSuccessToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({ phqCutoff, gadCutoff, pssCutoff, reassessmentDays, autoTier3Alert, item9Flag });
    }
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] p-2.5 sm:p-4 overflow-y-auto">
      <div 
        className="bg-[#ffffff] rounded-2xl max-w-lg w-full border border-[#e4e1e7] shadow-xl overflow-hidden my-auto sm:my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-[#e4e1e7] bg-[#f6f2f8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#eae7ed] flex items-center justify-center text-[#1b1b1f] flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </span>
            <div>
              <h3 className="text-[1rem] sm:text-[1.125rem] font-semibold text-[#1b1b1f]">
                Configure Clinical Scales & Triage Logic
              </h3>
              <p className="text-[0.6875rem] sm:text-[0.75rem] text-[#5e5e67]">
                Protocol PSS-2026.4 Psychometric Norms & Alert Cutoffs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#5e5e67] hover:bg-[#eae7ed] hover:text-[#1b1b1f] transition-colors cursor-pointer flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-4 text-[#1b1b1f] overflow-y-auto">
          {/* PHQ-9 Cutoff */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[0.8125rem] font-semibold text-[#1b1b1f]">
                PHQ-9 Severe Tier 3 Threshold
              </label>
              <span className="text-[0.875rem] font-bold text-[#780037]">{phqCutoff} / 27</span>
            </div>
            <input
              type="range"
              min="10"
              max="24"
              value={phqCutoff}
              onChange={(e) => setPhqCutoff(Number(e.target.value))}
              className="w-full accent-[#780037] cursor-pointer"
            />
            <span className="text-[0.75rem] text-[#5e5e67]">
              Scores at or above this value trigger mandatory Tier 3 clinical supervisor alerting.
            </span>
          </div>

          {/* GAD-7 Cutoff */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[0.8125rem] font-semibold text-[#1b1b1f]">
                GAD-7 Severe Tier 3 Threshold
              </label>
              <span className="text-[0.875rem] font-bold text-[#780037]">{gadCutoff} / 21</span>
            </div>
            <input
              type="range"
              min="10"
              max="20"
              value={gadCutoff}
              onChange={(e) => setGadCutoff(Number(e.target.value))}
              className="w-full accent-[#780037] cursor-pointer"
            />
            <span className="text-[0.75rem] text-[#5e5e67]">
              Scores at or above this value flag acute anxiety / panic intervention protocol.
            </span>
          </div>

          {/* Reassessment cycle */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[0.8125rem] font-semibold text-[#1b1b1f]">
                Standard Diagnostic Scale Reassessment Interval
              </label>
              <span className="text-[0.875rem] font-bold text-[#1b1b1f]">{reassessmentDays} Days</span>
            </div>
            <select
              value={reassessmentDays}
              onChange={(e) => setReassessmentDays(Number(e.target.value))}
              className="w-full h-10 px-3 rounded-lg border border-[#e4e1e7] bg-[#ffffff] text-[0.875rem] focus:outline-none focus:ring-1 focus:ring-[#9d174d] cursor-pointer"
            >
              <option value={7}>7 Days (Weekly acute monitoring)</option>
              <option value={14}>14 Days (Standard clinical protocol)</option>
              <option value={21}>21 Days (Subacute care)</option>
              <option value={30}>30 Days (Monthly longitudinal evaluation)</option>
            </select>
          </div>

          {/* Checkbox toggles */}
          <div className="space-y-2 pt-2 border-t border-[#e4e1e7]">
            <label className="flex items-center gap-2.5 cursor-pointer text-[0.8125rem] text-[#1b1b1f]">
              <input
                type="checkbox"
                checked={item9Flag}
                onChange={(e) => setItem9Flag(e.target.checked)}
                className="w-4 h-4 rounded accent-[#780037]"
              />
              <span>Immediate supervisor SMS dispatch on PHQ-9 Item #9 (Self-harm/Suicide &gt; 0)</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-[0.8125rem] text-[#1b1b1f]">
              <input
                type="checkbox"
                checked={autoTier3Alert}
                onChange={(e) => setAutoTier3Alert(e.target.checked)}
                className="w-4 h-4 rounded accent-[#780037]"
              />
              <span>Lock triage priority routing to Tier 3 for elevated scores</span>
            </label>
          </div>

          {successToast && (
            <div className="p-2.5 rounded-lg bg-[#a2f6aa]/60 text-[#002108] text-[0.8125rem] font-semibold text-center">
              Scale configuration updated successfully!
            </div>
          )}

          <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 min-h-[44px] rounded-lg bg-[#eae7ed] text-[#1b1b1f] hover:bg-[#e4e1e7] text-[0.875rem] font-medium transition-colors cursor-pointer flex items-center justify-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 min-h-[44px] rounded-lg bg-[#780037] text-[#ffffff] hover:opacity-95 text-[0.875rem] font-semibold transition-colors shadow-sm cursor-pointer flex items-center justify-center"
            >
              Apply Scale Norms
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
