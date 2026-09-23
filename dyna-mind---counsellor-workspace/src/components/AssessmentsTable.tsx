import React, { useState, useMemo } from 'react';
import { AssessmentRecord, AssessmentStatus, ScaleType } from '../types';

interface AssessmentsTableProps {
  assessments: AssessmentRecord[];
  onSelectAssessment: (record: AssessmentRecord) => void;
  onSendReminder: (record: AssessmentRecord) => void;
  onOpenBatchAssign: () => void;
  onOpenScaleSpecs: () => void;
  onOpenExport: () => void;
}

export const AssessmentsTable: React.FC<AssessmentsTableProps> = ({
  assessments,
  onSelectAssessment,
  onSendReminder,
  onOpenBatchAssign,
  onOpenScaleSpecs,
  onOpenExport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | AssessmentStatus>('ALL');
  const [selectedScale, setSelectedScale] = useState<'ALL' | ScaleType>('ALL');
  const [mobileLayoutMode, setMobileLayoutMode] = useState<'cards' | 'table'>('cards');

  const filteredAssessments = useMemo(() => {
    return assessments.filter((item) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.caseId.toLowerCase().includes(q) ||
        item.clientName.toLowerCase().includes(q) ||
        item.scaleName.toLowerCase().includes(q) ||
        item.scaleSubtitle.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'ALL' || item.status === statusFilter;

      const matchesScale =
        selectedScale === 'ALL' || item.scaleType === selectedScale;

      return matchesSearch && matchesStatus && matchesScale;
    });
  }, [assessments, searchTerm, statusFilter, selectedScale]);

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setSelectedScale('ALL');
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Filter & Search Console */}
      <div className="flex flex-col gap-2.5 bg-[#ffffff] p-3 sm:p-4 rounded-xl shadow-sm border border-[#e4e1e7]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-4">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#5e5e67] text-[18px]">
              search
            </span>
            <input
              id="assessmentSearchInput"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#f6f2f8] text-[#1b1b1f] text-[0.875rem] placeholder:text-[#5e5e67] focus:outline-none focus:bg-[#ffffff] focus:ring-1 focus:ring-[#9d174d] transition-all"
              placeholder="Search by Case ID, client or scale (e.g. DM-1042)..."
              type="text"
            />
          </div>

          {/* Status Selector Dropdown & Mobile Toggle */}
          <div className="flex items-center justify-between sm:justify-start gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
              <label
                htmlFor="statusFilterSelect"
                className="text-[0.75rem] text-[#5e5e67] font-semibold whitespace-nowrap hidden sm:inline"
              >
                Status:
              </label>
              <select
                id="statusFilterSelect"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'ALL' | AssessmentStatus)}
                className="h-9.5 px-2.5 pr-7 rounded-lg bg-[#f6f2f8] text-[#1b1b1f] text-[0.8125rem] sm:text-[0.875rem] font-medium focus:outline-none focus:bg-[#ffffff] focus:ring-1 focus:ring-[#9d174d] transition-all cursor-pointer flex-1 sm:flex-initial"
              >
                <option value="ALL">All Statuses</option>
                <option value="NEEDS_REVIEW">Needs Review</option>
                <option value="FLAGGED">Flagged for Review</option>
                <option value="REVIEWED">Reviewed</option>
                <option value="OVERDUE">Pending / Overdue</option>
              </select>

              <button
                id="resetFilters"
                onClick={handleReset}
                className="h-9.5 px-2.5 rounded-lg text-[#5e5e67] hover:bg-[#f6f2f8] hover:text-[#1b1b1f] transition-colors text-[0.8125rem] sm:text-[0.875rem] font-medium flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>

            {/* View Mode Toggle for Mobile & Tablet */}
            <div className="flex lg:hidden items-center border border-[#e4e1e7] rounded-lg p-0.5 bg-[#f6f2f8]">
              <button
                onClick={() => setMobileLayoutMode('cards')}
                aria-label="Card view"
                title="Card View"
                className={`p-1.5 rounded text-[16px] flex items-center justify-center cursor-pointer transition-colors ${
                  mobileLayoutMode === 'cards' ? 'bg-[#ffffff] text-[#780037] shadow-xs' : 'text-[#5e5e67]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">view_agenda</span>
              </button>
              <button
                onClick={() => setMobileLayoutMode('table')}
                aria-label="Table view"
                title="Table View"
                className={`p-1.5 rounded text-[16px] flex items-center justify-center cursor-pointer transition-colors ${
                  mobileLayoutMode === 'table' ? 'bg-[#ffffff] text-[#780037] shadow-xs' : 'text-[#5e5e67]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">table_rows</span>
              </button>
            </div>
          </div>
        </div>

        {/* Instrument Filter Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pt-1 pb-1 text-nowrap no-scrollbar scroll-smooth" id="scalePillsContainer">
          <button
            onClick={() => setSelectedScale('ALL')}
            className={`scale-pill px-2.5 sm:px-3 py-1 rounded-full text-[0.75rem] transition-colors cursor-pointer flex-shrink-0 ${
              selectedScale === 'ALL'
                ? 'bg-[#780037] text-[#ffffff] font-semibold'
                : 'bg-[#eae7ed] text-[#5e5e67] hover:text-[#1b1b1f] font-medium'
            }`}
          >
            All Scales
          </button>
          <button
            onClick={() => setSelectedScale('PHQ-9')}
            className={`scale-pill px-2.5 sm:px-3 py-1 rounded-full text-[0.75rem] transition-colors cursor-pointer flex-shrink-0 ${
              selectedScale === 'PHQ-9'
                ? 'bg-[#780037] text-[#ffffff] font-semibold'
                : 'bg-[#eae7ed] text-[#5e5e67] hover:text-[#1b1b1f] font-medium'
            }`}
          >
            PHQ-9 (Depression)
          </button>
          <button
            onClick={() => setSelectedScale('GAD-7')}
            className={`scale-pill px-2.5 sm:px-3 py-1 rounded-full text-[0.75rem] transition-colors cursor-pointer flex-shrink-0 ${
              selectedScale === 'GAD-7'
                ? 'bg-[#780037] text-[#ffffff] font-semibold'
                : 'bg-[#eae7ed] text-[#5e5e67] hover:text-[#1b1b1f] font-medium'
            }`}
          >
            GAD-7 (Anxiety)
          </button>
          <button
            onClick={() => setSelectedScale('WELLBEING')}
            className={`scale-pill px-2.5 sm:px-3 py-1 rounded-full text-[0.75rem] transition-colors cursor-pointer flex-shrink-0 ${
              selectedScale === 'WELLBEING'
                ? 'bg-[#780037] text-[#ffffff] font-semibold'
                : 'bg-[#eae7ed] text-[#5e5e67] hover:text-[#1b1b1f] font-medium'
            }`}
          >
            Wellbeing Check-in
          </button>
          <button
            onClick={() => setSelectedScale('PSS')}
            className={`scale-pill px-2.5 sm:px-3 py-1 rounded-full text-[0.75rem] transition-colors cursor-pointer flex-shrink-0 ${
              selectedScale === 'PSS'
                ? 'bg-[#780037] text-[#ffffff] font-semibold'
                : 'bg-[#eae7ed] text-[#5e5e67] hover:text-[#1b1b1f] font-medium'
            }`}
          >
            Stress Scale (PSS)
          </button>
        </div>
      </div>

      {/* Main Assessment Presentation Section */}
      <div className="bg-[#ffffff] rounded-xl shadow-sm border border-[#e4e1e7] overflow-hidden">
        
        {/* MOBILE & TABLET CARDS VIEW */}
        <div className={`lg:hidden ${mobileLayoutMode === 'cards' ? 'block' : 'hidden'}`}>
          {filteredAssessments.length === 0 ? (
            <div className="py-10 text-center text-[#5e5e67] px-4 text-[0.875rem]">
              No assessments match the selected search and filter criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 sm:p-4 bg-[#fbf8fe]/40">
              {filteredAssessments.map((row) => {
                const isFlagged = row.status === 'FLAGGED';
                const isNeedsReview = row.status === 'NEEDS_REVIEW';
                const isOverdue = row.status === 'OVERDUE';

                return (
                  <div
                    key={row.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all shadow-xs ${
                      isFlagged 
                        ? 'bg-[#ffdad6]/25 border-[#ffdad6]' 
                        : isNeedsReview 
                        ? 'bg-[#ffffff] border-[#e4e1e7] hover:border-[#debfc4]' 
                        : 'bg-[#ffffff] border-[#e4e1e7] hover:border-[#debfc4]'
                    }`}
                  >
                    {/* Top Row: Case ID & Status Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`text-[0.9375rem] font-bold ${isFlagged ? 'text-[#ba1a1a]' : 'text-[#1b1b1f]'}`}>
                          {row.caseId}
                        </span>
                        <span className="text-[0.8125rem] text-[#5e5e67] truncate">
                          {row.clientName}
                        </span>
                      </div>

                      {/* Status Tag */}
                      {row.status === 'REVIEWED' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#e3e1ec] text-[#1a1b23] text-[0.6875rem] uppercase tracking-wider font-semibold flex-shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#5e5e67]" />
                          Reviewed
                        </span>
                      )}
                      {row.status === 'NEEDS_REVIEW' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#eae7ed] text-[#1b1b1f] text-[0.6875rem] uppercase tracking-wider font-semibold flex-shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8b7076]" />
                          Needs Review
                        </span>
                      )}
                      {row.status === 'FLAGGED' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#ffdad6] text-[#93000a] text-[0.6875rem] uppercase tracking-wider font-semibold flex-shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-pulse" />
                          Flagged
                        </span>
                      )}
                      {row.status === 'OVERDUE' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#ffdad6]/60 text-[#ba1a1a] text-[0.6875rem] uppercase tracking-wider font-semibold flex-shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]" />
                          Overdue
                        </span>
                      )}
                    </div>

                    {/* Scale Instrument Line */}
                    <div className="flex items-center gap-2.5">
                      <span className={`w-7 h-7 rounded flex items-center justify-center font-bold text-[0.75rem] flex-shrink-0 ${row.badgeBg} ${row.badgeColor}`}>
                        {row.badgeCode}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[0.875rem] font-medium text-[#1b1b1f] truncate leading-tight">
                          {row.scaleName}
                        </span>
                        <span className="text-[0.6875rem] text-[#5e5e67] truncate">
                          {row.scaleSubtitle}
                        </span>
                      </div>
                    </div>

                    {/* Score, Severity Indication & Timestamp */}
                    <div className="bg-[#ffffff] rounded-lg p-2.5 border border-[#e4e1e7] flex items-center justify-between gap-3">
                      <div>
                        {isOverdue ? (
                          <div className="flex items-center gap-1 text-[#ba1a1a] text-[0.8125rem] font-semibold">
                            <span className="material-symbols-outlined text-[16px]">warning</span>
                            <span>Pending submission (Overdue)</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[1.25rem] font-bold leading-none ${isFlagged ? 'text-[#ba1a1a]' : 'text-[#1b1b1f]'}`}>
                              {row.scoreText}
                            </span>
                            {row.scoreTagStyle === 'mild' && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#eae7ed] text-[#5e5e67] font-medium">Mild</span>
                            )}
                            {row.scoreTagStyle === 'delta' && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#eae7ed] text-[#574146] font-medium">{row.deltaText || '+4 pt delta'}</span>
                            )}
                            {row.scoreTagStyle === 'elevated' && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#ffdad6] text-[#93000a] font-semibold">Elevated</span>
                            )}
                            {row.scoreTagStyle === 'optimal' && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#a2f6aa] text-[#002108] font-medium">Optimal</span>
                            )}
                          </div>
                        )}
                        <span className={`text-[0.75rem] block mt-0.5 ${isFlagged ? 'text-[#ba1a1a] font-medium' : 'text-[#5e5e67]'}`}>
                          {row.indicationText}
                        </span>
                      </div>

                      <div className="text-right flex-shrink-0 text-[0.6875rem] text-[#5e5e67]">
                        <span className="block">{row.completedAt}</span>
                      </div>
                    </div>

                    {/* Quick Touch Action Button */}
                    <div>
                      {row.actionType === 'review' && (
                        <button
                          onClick={() => onSelectAssessment(row)}
                          className="w-full py-2.5 min-h-[44px] rounded-lg bg-[#780037] text-[#ffffff] font-semibold text-[0.875rem] flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99] transition-transform cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">rate_review</span>
                          <span>Review Responses</span>
                        </button>
                      )}
                      {row.actionType === 'clinical_review' && (
                        <button
                          onClick={() => onSelectAssessment(row)}
                          className="w-full py-2.5 min-h-[44px] rounded-lg bg-[#ba1a1a] text-[#ffffff] font-semibold text-[0.875rem] flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.99] transition-transform cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">crisis_alert</span>
                          <span>Clinical Review (Flagged)</span>
                        </button>
                      )}
                      {row.actionType === 'send_reminder' && (
                        <button
                          onClick={() => onSendReminder(row)}
                          className="w-full py-2.5 min-h-[44px] rounded-lg bg-[#eae7ed] text-[#780037] hover:bg-[#e4e1e7] font-semibold text-[0.875rem] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">send</span>
                          <span>{row.reminderSent ? 'Reminder Sent ✓' : 'Send Reminder Notification'}</span>
                        </button>
                      )}
                      {(row.actionType === 'view_full' || row.actionType === 'view_summary') && (
                        <button
                          onClick={() => onSelectAssessment(row)}
                          className="w-full py-2.5 min-h-[44px] rounded-lg bg-[#eae7ed] text-[#1b1b1f] hover:bg-[#e4e1e7] font-semibold text-[0.875rem] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>{row.actionType === 'view_summary' ? 'View Intake Summary' : 'View Full Responses'}</span>
                          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* DESKTOP / TABLE VIEW (Shown on lg+, or on mobile/tablet if table toggle active) */}
        <div className={`overflow-x-auto ${mobileLayoutMode === 'table' ? 'block' : 'hidden lg:block'}`}>
          <table className="w-full text-left text-[#1b1b1f] border-collapse min-w-[780px]" id="assessmentsTable">
            <thead>
              <tr className="bg-[#f6f2f8] text-[#5e5e67] text-[0.75rem] tracking-wider uppercase border-b border-[#e4e1e7]">
                <th className="py-3 px-4 font-semibold">CASE</th>
                <th className="py-3 px-4 font-semibold">ASSESSMENT INSTRUMENT</th>
                <th className="py-3 px-4 font-semibold">COMPLETED</th>
                <th className="py-3 px-4 font-semibold">SCORE & INDICATION</th>
                <th className="py-3 px-4 font-semibold">STATUS</th>
                <th className="py-3 px-4 font-semibold text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="text-[0.875rem] divide-y divide-[#f0edf2]">
              {filteredAssessments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#5e5e67]">
                    No assessments match the selected search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAssessments.map((row) => {
                  const isFlagged = row.status === 'FLAGGED';
                  const isNeedsReview = row.status === 'NEEDS_REVIEW';
                  const isOverdue = row.status === 'OVERDUE';

                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-[#f6f2f8]/70 transition-colors group ${
                        isNeedsReview
                          ? 'bg-[#f6f2f8]/30'
                          : isOverdue
                          ? 'bg-[#f6f2f8]/20'
                          : ''
                      }`}
                    >
                      {/* CASE */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex flex-col">
                          <span
                            className={`text-[15px] font-semibold leading-snug ${
                              isFlagged ? 'text-[#ba1a1a]' : 'text-[#1b1b1f]'
                            }`}
                          >
                            {row.caseId}
                          </span>
                          <span className="text-[0.75rem] text-[#5e5e67]">
                            {row.clientName}
                          </span>
                        </div>
                      </td>

                      {/* ASSESSMENT INSTRUMENT */}
                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-7 h-7 rounded flex items-center justify-center font-bold text-[0.75rem] ${row.badgeBg} ${row.badgeColor}`}
                          >
                            {row.badgeCode}
                          </span>
                          <div className="flex flex-col">
                            <span className="text-[0.875rem] font-medium text-[#1b1b1f]">
                              {row.scaleName}
                            </span>
                            <span className="text-[0.75rem] text-[#5e5e67]">
                              {row.scaleSubtitle}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* COMPLETED */}
                      <td className="py-3.5 px-4 align-middle">
                        {isOverdue ? (
                          <div className="flex flex-col">
                            <span className="text-[#ba1a1a] font-medium text-[0.875rem] flex items-center gap-1">
                              <span className="material-symbols-outlined text-[16px]">warning</span>
                              Pending
                            </span>
                            <span className="text-[0.75rem] text-[#5e5e67]">Due 4 days ago</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[#1b1b1f]">
                            <span className="material-symbols-outlined text-[16px] text-[#5e5e67]">
                              {row.completedAt.includes('Today') ? 'today' : row.completedAt.includes('Yesterday') ? 'schedule' : 'event_available'}
                            </span>
                            <span>{row.completedAt}</span>
                          </div>
                        )}
                      </td>

                      {/* SCORE & INDICATION */}
                      <td className="py-3.5 px-4 align-middle">
                        {isOverdue ? (
                          <span className="text-[#5e5e67] text-[0.875rem]">—</span>
                        ) : (
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[1.25rem] font-semibold ${
                                  isFlagged
                                    ? 'text-[#ba1a1a] font-bold'
                                    : row.scoreTagStyle === 'optimal'
                                    ? 'text-[#004519]'
                                    : 'text-[#1b1b1f]'
                                }`}
                              >
                                {row.scoreText}
                              </span>

                              {row.scoreTagStyle === 'mild' && (
                                <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#eae7ed] text-[#5e5e67] font-medium">
                                  Mild
                                </span>
                              )}
                              {row.scoreTagStyle === 'delta' && (
                                <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#eae7ed] text-[#574146] font-medium">
                                  {row.deltaText || '+4 pt delta'}
                                </span>
                              )}
                              {row.scoreTagStyle === 'elevated' && (
                                <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#ffdad6] text-[#93000a] font-semibold">
                                  Elevated
                                </span>
                              )}
                              {row.scoreTagStyle === 'optimal' && (
                                <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#a2f6aa] text-[#002108] font-medium">
                                  Optimal
                                </span>
                              )}
                            </div>
                            <span
                              className={`text-[0.75rem] ${
                                isFlagged
                                  ? 'text-[#ba1a1a] font-medium'
                                  : 'text-[#5e5e67]'
                              }`}
                            >
                              {row.indicationText}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="py-3.5 px-4 align-middle">
                        {row.status === 'REVIEWED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#e3e1ec] text-[#1a1b23] text-[0.75rem] uppercase tracking-wider font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#5e5e67]" />
                            Reviewed
                          </span>
                        )}

                        {row.status === 'NEEDS_REVIEW' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#eae7ed] text-[#1b1b1f] text-[0.75rem] uppercase tracking-wider font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8b7076]" />
                            Needs Review
                          </span>
                        )}

                        {row.status === 'FLAGGED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#ffdad6] text-[#93000a] text-[0.75rem] uppercase tracking-wider font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] animate-pulse" />
                            Flagged for Review
                          </span>
                        )}

                        {row.status === 'OVERDUE' && (
                          <span className="text-[0.75rem] uppercase tracking-wider font-semibold text-[#ba1a1a] flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]" />
                            Overdue
                          </span>
                        )}
                      </td>

                      {/* ACTION */}
                      <td className="py-3.5 px-4 align-middle text-right">
                        {row.actionType === 'view_full' && (
                          <button
                            onClick={() => onSelectAssessment(row)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#eae7ed] text-[#1b1b1f] hover:bg-[#e4e1e7] transition-colors text-[0.875rem] font-medium cursor-pointer"
                          >
                            <span>View Full Responses</span>
                            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                          </button>
                        )}

                        {row.actionType === 'review' && (
                          <button
                            onClick={() => onSelectAssessment(row)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#780037] text-[#ffffff] hover:opacity-90 shadow-sm transition-all text-[0.875rem] font-medium cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">rate_review</span>
                            <span>Review Responses</span>
                          </button>
                        )}

                        {row.actionType === 'clinical_review' && (
                          <button
                            onClick={() => onSelectAssessment(row)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#ba1a1a] text-[#ffffff] hover:opacity-90 shadow-sm transition-all text-[0.875rem] font-medium cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">crisis_alert</span>
                            <span>Clinical Review</span>
                          </button>
                        )}

                        {row.actionType === 'view_summary' && (
                          <button
                            onClick={() => onSelectAssessment(row)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#eae7ed] text-[#1b1b1f] hover:bg-[#e4e1e7] transition-colors text-[0.875rem] font-medium cursor-pointer"
                          >
                            <span>View Summary</span>
                            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                          </button>
                        )}

                        {row.actionType === 'send_reminder' && (
                          <button
                            onClick={() => onSendReminder(row)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#eae7ed] text-[#780037] hover:bg-[#e4e1e7] transition-colors text-[0.875rem] font-semibold cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">send</span>
                            <span>{row.reminderSent ? 'Reminder Sent ✓' : 'Send Reminder'}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination Counter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-3 bg-[#f6f2f8] text-[#5e5e67] text-[0.75rem] border-t border-[#e4e1e7]">
          <span id="resultsCountNotice">
            Showing {filteredAssessments.length} of {assessments.length} active screening instruments
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled
              aria-label="Previous page"
              className="px-2 py-1 rounded bg-[#e4e1e7] text-[#1b1b1f] disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[16px]">first_page</span>
            </button>
            <span className="text-[0.75rem] font-semibold text-[#1b1b1f]">Page 1 of 1</span>
            <button
              disabled
              aria-label="Next page"
              className="px-2 py-1 rounded bg-[#e4e1e7] text-[#1b1b1f] disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[16px]">last_page</span>
            </button>
          </div>
        </div>
      </div>

      {/* Intake & Diagnostics Quick-Action Auxiliary Card Mosaic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Card 1: Batch Assignment */}
        <div 
          onClick={onOpenBatchAssign}
          className="bg-[#ffffff] p-4 rounded-xl shadow-sm border border-[#e4e1e7] flex items-start gap-3 hover:border-[#debfc4] transition-all cursor-pointer group"
        >
          <span className="w-10 h-10 rounded-lg bg-[#ffd9e0] flex items-center justify-center text-[#780037] flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
          </span>
          <div className="flex flex-col">
            <h4 className="text-[15px] text-[#1b1b1f] font-semibold group-hover:text-[#780037] transition-colors">
              Batch Assignment
            </h4>
            <p className="text-[0.75rem] text-[#5e5e67] mt-0.5">
              Schedule weekly recurring self-monitoring batteries across active therapy cohorts.
            </p>
            <span className="text-[0.75rem] text-[#780037] font-semibold mt-2 inline-flex items-center gap-0.5 group-hover:underline">
              Configure cohort cycles →
            </span>
          </div>
        </div>

        {/* Card 2: Scale Library Specs */}
        <div 
          onClick={onOpenScaleSpecs}
          className="bg-[#ffffff] p-4 rounded-xl shadow-sm border border-[#e4e1e7] flex items-start gap-3 hover:border-[#debfc4] transition-all cursor-pointer group"
        >
          <span className="w-10 h-10 rounded-lg bg-[#eae7ed] flex items-center justify-center text-[#5e5e67] flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">psychology</span>
          </span>
          <div className="flex flex-col">
            <h4 className="text-[15px] text-[#1b1b1f] font-semibold group-hover:text-[#1b1b1f] transition-colors">
              Scale Library Specs
            </h4>
            <p className="text-[0.75rem] text-[#5e5e67] mt-0.5">
              Standardized scoring norms and validity cutoff references for PHQ, GAD, PSS-10.
            </p>
            <span className="text-[0.75rem] text-[#5e5e67] font-semibold mt-2 inline-flex items-center gap-0.5 group-hover:underline">
              View normative documentation →
            </span>
          </div>
        </div>

        {/* Card 3: Longitudinal Export */}
        <div 
          onClick={onOpenExport}
          className="bg-[#ffffff] p-4 rounded-xl shadow-sm border border-[#e4e1e7] flex items-start gap-3 hover:border-[#debfc4] transition-all cursor-pointer group"
        >
          <span className="w-10 h-10 rounded-lg bg-[#e0dee9] flex items-center justify-center text-[#62626b] flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">download</span>
          </span>
          <div className="flex flex-col">
            <h4 className="text-[15px] text-[#1b1b1f] font-semibold group-hover:text-[#1b1b1f] transition-colors">
              Longitudinal Export
            </h4>
            <p className="text-[0.75rem] text-[#5e5e67] mt-0.5">
              Export structured CSV/HL7 psychometric logs for external psychiatric referral packages.
            </p>
            <span className="text-[0.75rem] text-[#1b1b1f] font-semibold mt-2 inline-flex items-center gap-0.5 group-hover:underline">
              Generate clinical telemetry dump →
            </span>
          </div>
        </div>
      </div>

      {/* Clinical Disclaimer Footer */}
      <footer className="mt-2 p-4 bg-[#f6f2f8] rounded-xl text-center border border-[#e4e1e7]">
        <p className="text-[0.75rem] text-[#5e5e67] max-w-3xl mx-auto leading-relaxed">
          <span className="font-semibold text-[#1b1b1f]">Clinical Disclaimer:</span> All instruments listed are evidence-based screening questionnaires designed to assist counsellor evaluation. Responses do not replace full diagnostic clinical interviews.
        </p>
      </footer>
    </div>
  );
};
