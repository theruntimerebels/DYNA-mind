import React, { useState } from 'react';
import { SCALE_DEFINITIONS } from '../data/mockData';

interface ScaleLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScaleLibraryModal: React.FC<ScaleLibraryModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [activeCode, setActiveCode] = useState(SCALE_DEFINITIONS[0].code);
  const activeScale = SCALE_DEFINITIONS.find((s) => s.code === activeCode) || SCALE_DEFINITIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] p-2.5 sm:p-4 overflow-y-auto">
      <div 
        className="bg-[#ffffff] rounded-2xl max-w-3xl w-full border border-[#e4e1e7] shadow-xl overflow-hidden my-auto sm:my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-[#e4e1e7] bg-[#f6f2f8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#eae7ed] flex items-center justify-center text-[#5e5e67] flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">psychology</span>
            </span>
            <div>
              <h3 className="text-[1rem] sm:text-[1.125rem] font-semibold text-[#1b1b1f]">
                Standardized Psychometric Scale Library Specs
              </h3>
              <p className="text-[0.6875rem] sm:text-[0.75rem] text-[#5e5e67]">
                Clinical cutoffs, scoring norms, and validity reference documentation
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

        {/* Tab Selection */}
        <div className="flex border-b border-[#e4e1e7] bg-[#f6f2f8]/50 px-3 sm:px-6 gap-2 overflow-x-auto no-scrollbar">
          {SCALE_DEFINITIONS.map((scale) => (
            <button
              key={scale.code}
              onClick={() => setActiveCode(scale.code)}
              className={`py-2.5 sm:py-3 px-3 text-[0.8125rem] sm:text-[0.875rem] border-b-2 font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                activeCode === scale.code
                  ? 'border-[#780037] text-[#780037]'
                  : 'border-transparent text-[#5e5e67] hover:text-[#1b1b1f]'
              }`}
            >
              {scale.code}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 text-[#1b1b1f]">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-2">
              <h4 className="text-[1rem] sm:text-[1.125rem] font-bold text-[#1b1b1f]">
                {activeScale.name}
              </h4>
              <span className="self-start sm:self-auto text-[0.6875rem] sm:text-[0.75rem] font-semibold text-[#5e5e67] bg-[#f6f2f8] px-2.5 py-1 rounded-md border border-[#e4e1e7]">
                {activeScale.itemsCount} Items • Score: {activeScale.scoringRange}
              </span>
            </div>
            <p className="text-[0.8125rem] sm:text-[0.875rem] text-[#5e5e67] mt-1.5 leading-relaxed">
              {activeScale.description}
            </p>
          </div>

          {/* Cutoffs Table */}
          <div>
            <h5 className="text-[0.6875rem] sm:text-[0.75rem] font-semibold text-[#5e5e67] uppercase tracking-wider mb-2">
              Standardized Severity Stratification & Clinical Directives
            </h5>
            <div className="border border-[#e4e1e7] rounded-xl overflow-hidden divide-y divide-[#e4e1e7]">
              {activeScale.cutoffs.map((item, idx) => (
                <div key={idx} className="p-3 text-[0.8125rem] flex flex-col sm:grid sm:grid-cols-12 gap-1 sm:gap-3 hover:bg-[#f6f2f8] transition-colors">
                  <div className="sm:col-span-3 flex items-center justify-between sm:justify-start">
                    <span className="font-semibold text-[#1b1b1f] tabular-nums">
                      {item.range}
                    </span>
                    <span className="sm:hidden font-medium text-[#780037] text-[0.75rem]">
                      {item.label}
                    </span>
                  </div>
                  <span className="hidden sm:block col-span-4 font-medium text-[#780037]">
                    {item.label}
                  </span>
                  <span className="sm:col-span-5 text-[#5e5e67] text-[0.75rem] sm:text-[0.8125rem]">
                    {item.action}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Critical trigger alert */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-[#ffdad6]/40 border border-[#ffdad6] text-[0.75rem] sm:text-[0.8125rem]">
            <span className="font-semibold text-[#ba1a1a] block mb-0.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">crisis_alert</span>
              Automated Electronic Health Record Triage Protocol:
            </span>
            <span className="text-[#574146] leading-relaxed">
              {activeScale.criticalTrigger}
            </span>
          </div>
        </div>

        <div className="p-3 sm:p-4 border-t border-[#e4e1e7] bg-[#f6f2f8] flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 min-h-[44px] rounded-lg bg-[#eae7ed] text-[#1b1b1f] hover:bg-[#e4e1e7] text-[0.875rem] font-medium transition-colors cursor-pointer flex items-center justify-center"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
