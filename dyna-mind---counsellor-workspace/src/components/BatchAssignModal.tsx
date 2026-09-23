import React, { useState } from 'react';

interface BatchAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (count: number) => void;
}

export const BatchAssignModal: React.FC<BatchAssignModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const [selectedCohort, setSelectedCohort] = useState('Anxiety & Depressive Disorders Cohort A (18 clients)');
  const [selectedScale, setSelectedScale] = useState('PHQ-9 + GAD-7 Dual Diagnostic Battery');
  const [scheduleTime, setScheduleTime] = useState('Every Monday at 08:00 AM');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRunBatch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(18);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] p-2.5 sm:p-4 overflow-y-auto">
      <div 
        className="bg-[#ffffff] rounded-2xl max-w-lg w-full border border-[#e4e1e7] shadow-xl overflow-hidden my-auto sm:my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-[#e4e1e7] bg-[#f6f2f8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#ffd9e0] flex items-center justify-center text-[#780037] flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
            </span>
            <div>
              <h3 className="text-[1rem] sm:text-[1.125rem] font-semibold text-[#1b1b1f]">
                Batch Cohort Assessment Assignment
              </h3>
              <p className="text-[0.6875rem] sm:text-[0.75rem] text-[#5e5e67]">
                Deploy standardized scale batteries across client cohorts
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

        <form onSubmit={handleRunBatch} className="p-4 sm:p-6 space-y-4 text-[#1b1b1f] overflow-y-auto">
          <div>
            <label className="block text-[0.6875rem] sm:text-[0.75rem] font-semibold text-[#5e5e67] uppercase tracking-wider mb-1">
              Select Client Therapy Cohort
            </label>
            <select
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
              className="w-full h-11 sm:h-10 px-3 rounded-lg border border-[#e4e1e7] bg-[#ffffff] text-[0.875rem] focus:outline-none focus:ring-1 focus:ring-[#9d174d] cursor-pointer"
            >
              <option>Anxiety & Depressive Disorders Cohort A (18 clients)</option>
              <option>Intake Triage Queue — Week 37 (12 clients)</option>
              <option>Dialectical Behavioral Skills Cohort (9 clients)</option>
              <option>Longitudinal Maintenance Track (24 clients)</option>
            </select>
          </div>

          <div>
            <label className="block text-[0.6875rem] sm:text-[0.75rem] font-semibold text-[#5e5e67] uppercase tracking-wider mb-1">
              Assessment Battery Suite
            </label>
            <select
              value={selectedScale}
              onChange={(e) => setSelectedScale(e.target.value)}
              className="w-full h-11 sm:h-10 px-3 rounded-lg border border-[#e4e1e7] bg-[#ffffff] text-[0.875rem] focus:outline-none focus:ring-1 focus:ring-[#9d174d] cursor-pointer"
            >
              <option>PHQ-9 + GAD-7 Dual Diagnostic Battery</option>
              <option>PHQ-9 Depression Screener (Isolated)</option>
              <option>GAD-7 Generalized Anxiety (Isolated)</option>
              <option>Perceived Stress (PSS-10) + Wellbeing Index</option>
            </select>
          </div>

          <div>
            <label className="block text-[0.6875rem] sm:text-[0.75rem] font-semibold text-[#5e5e67] uppercase tracking-wider mb-1">
              Recurrence Schedule
            </label>
            <select
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="w-full h-11 sm:h-10 px-3 rounded-lg border border-[#e4e1e7] bg-[#ffffff] text-[0.875rem] focus:outline-none focus:ring-1 focus:ring-[#9d174d] cursor-pointer"
            >
              <option>Every Monday at 08:00 AM</option>
              <option>Bi-weekly on Wednesday at 10:00 AM</option>
              <option>Immediate One-time Dispatch</option>
              <option>Custom Cron Trigger</option>
            </select>
          </div>

          <div className="p-3 bg-[#f6f2f8] rounded-xl text-[0.75rem] text-[#5e5e67] space-y-1">
            <div className="flex items-center justify-between font-semibold text-[#1b1b1f]">
              <span>Active Target Count:</span>
              <span>18 Active Participants</span>
            </div>
            <div>
              Automated reminders will dispatch at 24 hours and 48 hours post-release if uncompleted.
            </div>
          </div>

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
              disabled={isProcessing}
              className="px-4 py-2.5 min-h-[44px] rounded-lg bg-[#780037] text-[#ffffff] hover:opacity-95 text-[0.875rem] font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              <span>{isProcessing ? 'Scheduling Batch...' : 'Activate Cohort Cycle'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
