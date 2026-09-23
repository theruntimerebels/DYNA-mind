import React, { useState } from 'react';
import { AssessmentRecord } from '../types';

interface AssessmentDetailModalProps {
  record: AssessmentRecord | null;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: 'REVIEWED' | 'FLAGGED' | 'NEEDS_REVIEW', notes?: string) => void;
}

export const AssessmentDetailModal: React.FC<AssessmentDetailModalProps> = ({
  record,
  onClose,
  onUpdateStatus,
}) => {
  if (!record) return null;

  const [notes, setNotes] = useState(record.clinicalNotes || '');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSaveNotes = () => {
    onUpdateStatus(record.id, record.status, notes);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  const handleApprove = () => {
    onUpdateStatus(record.id, 'REVIEWED', notes);
    onClose();
  };

  const handleEscalate = () => {
    onUpdateStatus(record.id, 'FLAGGED', notes);
    onClose();
  };

  const isFlagged = record.status === 'FLAGGED' || (record.rawScore && record.rawScore >= 15);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-2.5 sm:p-4 overflow-y-auto">
      <div 
        className="bg-[#ffffff] rounded-xl sm:rounded-2xl max-w-2xl w-full border border-[#e4e1e7] shadow-xl overflow-hidden my-2 sm:my-6 flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-3.5 sm:p-5 border-b border-[#e4e1e7] bg-[#f6f2f8] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <span className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center font-bold text-[0.8125rem] sm:text-[0.875rem] flex-shrink-0 ${record.badgeBg} ${record.badgeColor}`}>
              {record.badgeCode}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-[0.9375rem] sm:text-[1.125rem] font-semibold text-[#1b1b1f] truncate">
                  {record.scaleName} — {record.clientName}
                </h3>
                <span className="text-[0.6875rem] sm:text-[0.75rem] font-medium text-[#5e5e67] bg-[#ffffff] px-1.5 sm:px-2 py-0.5 rounded border border-[#e4e1e7]">
                  {record.caseId}
                </span>
              </div>
              <p className="text-[0.6875rem] sm:text-[0.75rem] text-[#5e5e67] mt-0.5 truncate">
                Completed {record.completedAt} • Assigned by {record.assignedBy || 'Dr. Ananya Sharma'}
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

        {/* Modal Scrollable Content */}
        <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 space-y-4 sm:space-y-5 text-[#1b1b1f]">
          {/* Critical Risk Alert Banner */}
          {isFlagged && (
            <div className="p-3.5 rounded-xl bg-[#ffdad6]/60 border border-[#ffdad6] flex items-start gap-3">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[22px] flex-shrink-0">
                crisis_alert
              </span>
              <div className="text-[0.8125rem]">
                <strong className="text-[#ba1a1a] font-semibold block">
                  Automated Triage Escalation (Tier 3 Active)
                </strong>
                <span className="text-[#574146] mt-0.5 block leading-snug">
                  This screening score exceeds clinical threshold parameters (PHQ-9 ≥ 15 or elevated symptomatic severity). Clinical supervisor consultation and structured safety review recommended.
                </span>
              </div>
            </div>
          )}

          {/* Diagnostic Score Card & Severity Gauge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#f6f2f8] border border-[#e4e1e7]">
            <div className="flex flex-col">
              <span className="text-[0.75rem] uppercase tracking-wider text-[#5e5e67] font-semibold">
                Total Score
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className={`text-[1.75rem] font-bold leading-none ${isFlagged ? 'text-[#ba1a1a]' : 'text-[#1b1b1f]'}`}>
                  {record.scoreText}
                </span>
                {record.maxScore && (
                  <span className="text-[0.75rem] text-[#5e5e67]">
                    ({Math.round(((record.rawScore || 0) / record.maxScore) * 100)}%)
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[0.75rem] uppercase tracking-wider text-[#5e5e67] font-semibold">
                Clinical Classification
              </span>
              <div className="mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[0.75rem] font-semibold ${
                  isFlagged
                    ? 'bg-[#ffdad6] text-[#93000a]'
                    : record.scoreTagStyle === 'optimal'
                    ? 'bg-[#a2f6aa] text-[#002108]'
                    : 'bg-[#eae7ed] text-[#1b1b1f]'
                }`}>
                  {record.indicationText || record.scoreTag}
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[0.75rem] uppercase tracking-wider text-[#5e5e67] font-semibold">
                Review Status
              </span>
              <div className="mt-1">
                <span className="text-[0.875rem] font-medium text-[#1b1b1f] flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${
                    record.status === 'REVIEWED' ? 'bg-[#005f25]' : record.status === 'FLAGGED' ? 'bg-[#ba1a1a]' : 'bg-[#8b7076]'
                  }`} />
                  {record.statusLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Item-by-item Response Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[0.875rem] font-semibold text-[#1b1b1f] uppercase tracking-wider">
                Individual Item Scoring & Itemized Audit
              </h4>
              <span className="text-[0.75rem] text-[#5e5e67]">
                {record.responses?.length || 0} questions evaluated
              </span>
            </div>

            {(!record.responses || record.responses.length === 0) ? (
              <div className="p-6 text-center text-[#5e5e67] bg-[#f6f2f8] rounded-xl text-[0.875rem]">
                No submitted responses on record. Client response is pending or overdue.
              </div>
            ) : (
              <div className="border border-[#e4e1e7] rounded-xl overflow-hidden divide-y divide-[#e4e1e7]">
                {record.responses.map((item) => {
                  const isItemCritical = item.questionNumber === 9 && item.responseScore > 0;
                  return (
                    <div 
                      key={item.questionNumber} 
                      className={`p-3 text-[0.8125rem] flex items-center justify-between gap-4 transition-colors ${
                        isItemCritical ? 'bg-[#ffdad6]/40' : 'hover:bg-[#f6f2f8]'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="font-semibold text-[#5e5e67] w-5 text-right flex-shrink-0">
                          {item.questionNumber}.
                        </span>
                        <span className={`leading-relaxed ${isItemCritical ? 'text-[#ba1a1a] font-medium' : 'text-[#1b1b1f]'}`}>
                          {item.questionText}
                          {isItemCritical && (
                            <span className="ml-2 px-1.5 py-0.5 rounded bg-[#ba1a1a] text-[#ffffff] text-[10px] font-bold uppercase">
                              Critical Alert
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[#5e5e67] text-[0.75rem]">
                          {item.responseLabel}
                        </span>
                        <span className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[0.75rem] ${
                          item.responseScore >= 2
                            ? 'bg-[#ffd9e0] text-[#780037]'
                            : 'bg-[#eae7ed] text-[#5e5e67]'
                        }`}>
                          {item.responseScore}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Longitudinal Trajectory Mini Spark */}
          {record.historyTrajectory && record.historyTrajectory.length > 0 && (
            <div className="p-3.5 bg-[#f6f2f8] rounded-xl border border-[#e4e1e7]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[0.75rem] font-semibold text-[#5e5e67] uppercase tracking-wider">
                  Longitudinal Trajectory (Prior 4 administrations)
                </span>
                <span className="text-[0.75rem] text-[#5e5e67]">
                  Baseline → Current
                </span>
              </div>
              <div className="flex items-center gap-3">
                {record.historyTrajectory.map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div className="text-[0.75rem] font-semibold text-[#1b1b1f] mb-1">
                      {val} pts
                    </div>
                    <div className="w-full bg-[#eae7ed] rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${idx === record.historyTrajectory!.length - 1 ? 'bg-[#9d174d]' : 'bg-[#5e5e67]'}`}
                        style={{ width: `${Math.min(100, (val / (record.maxScore || 27)) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-[#5e5e67] mt-1">Admin {idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Counsellor Clinical Notes & Assessment Sign-off */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="clinicalCounsellorNotes" className="text-[0.875rem] font-semibold text-[#1b1b1f]">
                Counsellor Clinical Notes & EHR Chart Entry
              </label>
              {savedMessage && (
                <span className="text-[0.75rem] text-[#004519] font-semibold">
                  Saved to chart entry ✓
                </span>
              )}
            </div>
            <textarea
              id="clinicalCounsellorNotes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter clinical observations, diagnostic impression, or follow-up plan..."
              className="w-full p-3 rounded-xl border border-[#e4e1e7] bg-[#ffffff] text-[0.875rem] text-[#1b1b1f] placeholder:text-[#5e5e67] focus:outline-none focus:ring-1 focus:ring-[#9d174d] transition-all"
            />
            <div className="flex justify-end mt-1.5">
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-3 py-1.5 rounded-lg bg-[#eae7ed] text-[#1b1b1f] hover:bg-[#e4e1e7] text-[0.75rem] font-semibold transition-colors cursor-pointer"
              >
                Save Chart Note
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-3 sm:p-4 border-t border-[#e4e1e7] bg-[#f6f2f8] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center">
            {record.status !== 'FLAGGED' && (
              <button
                type="button"
                onClick={handleEscalate}
                className="w-full sm:w-auto px-3.5 py-2.5 min-h-[44px] rounded-lg bg-[#ffdad6] text-[#93000a] hover:bg-[#ffdad6]/80 text-[0.875rem] font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">warning</span>
                <span>Flag for Supervisor</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 min-h-[44px] rounded-lg bg-[#eae7ed] text-[#1b1b1f] hover:bg-[#e4e1e7] text-[0.875rem] font-medium transition-colors cursor-pointer flex items-center justify-center"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleApprove}
              className="flex-1 sm:flex-initial px-4 py-2.5 min-h-[44px] rounded-lg bg-[#780037] text-[#ffffff] hover:opacity-95 text-[0.875rem] font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Mark Reviewed</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
