/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavTab, AssessmentRecord } from './types';
import { INITIAL_ASSESSMENTS } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { TrajectoryChart } from './components/TrajectoryChart';
import { AssessmentsTable } from './components/AssessmentsTable';
import { AssessmentDetailModal } from './components/AssessmentDetailModal';
import { AssignAssessmentModal } from './components/AssignAssessmentModal';
import { ConfigureScalesModal } from './components/ConfigureScalesModal';
import { BatchAssignModal } from './components/BatchAssignModal';
import { ScaleLibraryModal } from './components/ScaleLibraryModal';
import { ExportModal } from './components/ExportModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { BottomNav } from './components/BottomNav';
import {
  MyCasesView,
  RiskMonitoringView,
  MessagesView,
  InterventionsView,
  AppointmentsView,
} from './components/views/OtherViews';
import {
  ReportsView,
  TeamView,
  ResourcesView,
  SettingsView,
} from './components/views/SettingsReportsTeamViews';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('assessments');
  const [globalSearch, setGlobalSearch] = useState('');
  const [assessments, setAssessments] = useState<AssessmentRecord[]>(INITIAL_ASSESSMENTS);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentRecord | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleUpdateStatus = (
    id: string,
    newStatus: 'REVIEWED' | 'FLAGGED' | 'NEEDS_REVIEW',
    notes?: string
  ) => {
    setAssessments((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: newStatus,
            statusLabel:
              newStatus === 'REVIEWED'
                ? 'Reviewed'
                : newStatus === 'FLAGGED'
                ? 'Flagged for Review'
                : 'Needs Review',
            clinicalNotes: notes !== undefined ? notes : item.clinicalNotes,
          };
        }
        return item;
      })
    );
    showToast(`Status updated to ${newStatus}`);
  };

  const handleSendReminder = (record: AssessmentRecord) => {
    setAssessments((prev) =>
      prev.map((item) => {
        if (item.id === record.id) {
          return { ...item, reminderSent: true };
        }
        return item;
      })
    );
    showToast(`Secure SMS reminder dispatched to ${record.clientName} (${record.caseId})`);
  };

  const handleAddNewAssessment = (newRec: AssessmentRecord) => {
    setAssessments((prev) => [newRec, ...prev]);
    showToast(`Assessment ${newRec.scaleName} dispatched to ${newRec.clientName}`);
  };

  const handleBatchSuccess = (count: number) => {
    showToast(`Batch assigned successfully to ${count} active cohort clients.`);
  };

  const completedCount = 42;
  const pendingCount = 8;
  const flaggedCount = assessments.filter((a) => a.status === 'FLAGGED').length || 3;
  const dueCount = 6;

  return (
    <div className="min-h-screen bg-[#fbf8fe] text-[#1b1b1f] font-sans antialiased">
      {/* Toast notification banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1b1b1f] text-[#ffffff] px-4 py-2.5 rounded-xl shadow-lg text-[0.875rem] font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-[18px] text-[#a2f6aa]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setIsMobileMenuOpen(false);
        }}
        unreadCount={3}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Container */}
      <div className="lg:pl-60 w-full min-h-screen flex flex-col">
        {/* Top Header */}
        <Header
          searchQuery={globalSearch}
          onSearchChange={(q) => setGlobalSearch(q)}
          onToggleNotifications={() => setIsNotifOpen((prev) => !prev)}
          unreadCount={2}
          onOpenHelp={() => setIsHelpOpen(true)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Notifications Dropdown */}
        <NotificationDrawer
          isOpen={isNotifOpen}
          onClose={() => setIsNotifOpen(false)}
          onSelectCase={(caseId) => {
            const found = assessments.find((a) => a.caseId === caseId);
            if (found) {
              setSelectedAssessment(found);
              setCurrentTab('assessments');
            }
          }}
        />

        {/* Main Content Area */}
        <main className="w-full pt-16 px-3.5 sm:px-6 lg:px-8 pb-24 lg:pb-10 bg-[#fbf8fe] flex-1">
          <div className="flex flex-col w-full gap-5 sm:gap-6 max-w-7xl mx-auto">
            {/* View Switching */}
            {currentTab === 'assessments' && (
              <>
                {/* Breadcrumb & Top Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pt-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[0.6875rem] sm:text-[0.75rem] uppercase tracking-wider text-[#5e5e67] font-semibold">
                        Clinical Operations
                      </span>
                      <span className="text-[#5e5e67] text-[0.75rem]">/</span>
                      <span className="text-[0.6875rem] sm:text-[0.75rem] uppercase tracking-wider text-[#780037] font-semibold">
                        Triage & Psychometrics
                      </span>
                    </div>
                    <h1 className="text-[1.5rem] sm:text-[1.75rem] lg:text-[2rem] text-[#1b1b1f] font-semibold tracking-tight leading-tight">
                      Assessments Overview
                    </h1>
                    <p className="text-[0.8125rem] sm:text-[0.875rem] text-[#5e5e67] mt-0.5 max-w-2xl">
                      Standardized screening instruments, self-reported scales, and scheduled clinical questionnaires for psychiatric evaluation.
                    </p>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto">
                    <button
                      id="btnConfigureScales"
                      onClick={() => setIsConfigModalOpen(true)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2.5 min-h-[42px] sm:min-h-[44px] rounded-lg bg-[#eae7ed] text-[#1b1b1f] hover:bg-[#e4e1e7] transition-colors text-[0.8125rem] sm:text-[0.875rem] font-medium cursor-pointer whitespace-nowrap"
                    >
                      <span className="material-symbols-outlined text-[18px]">tune</span>
                      <span>Configure Scales</span>
                    </button>

                    <button
                      id="btnAssignAssessment"
                      onClick={() => setIsAssignModalOpen(true)}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] sm:min-h-[44px] rounded-lg bg-[#9d174d] text-[#ffffff] hover:opacity-95 shadow-sm transition-all text-[0.8125rem] sm:text-[0.875rem] font-medium cursor-pointer whitespace-nowrap"
                    >
                      <span className="material-symbols-outlined text-[18px]">add_task</span>
                      <span>+ Assign New Assessment</span>
                    </button>
                  </div>
                </div>

                {/* 4 Metric Cards */}
                <MetricCards
                  completedCount={completedCount}
                  pendingCount={pendingCount}
                  flaggedCount={flaggedCount}
                  dueCount={dueCount}
                />

                {/* Instrument Volume & Trajectory Split */}
                <TrajectoryChart onProtocolClick={() => setIsConfigModalOpen(true)} />

                {/* Main Table, Filters & Quick Action Aux Cards */}
                <AssessmentsTable
                  assessments={assessments}
                  onSelectAssessment={(record) => setSelectedAssessment(record)}
                  onSendReminder={handleSendReminder}
                  onOpenBatchAssign={() => setIsBatchModalOpen(true)}
                  onOpenScaleSpecs={() => setIsSpecsModalOpen(true)}
                  onOpenExport={() => setIsExportModalOpen(true)}
                />
              </>
            )}

            {currentTab === 'overview' && (
              <div className="space-y-5 sm:space-y-6 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-[1.5rem] sm:text-[1.75rem] lg:text-[2rem] font-semibold text-[#1b1b1f] tracking-tight leading-tight">
                      Counsellor Clinical Dashboard
                    </h1>
                    <p className="text-[0.8125rem] sm:text-[0.875rem] text-[#5e5e67] mt-0.5">
                      Intake queue, active case triage, and day overview for Dr. Ananya Sharma.
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentTab('assessments')}
                    className="self-start sm:self-auto px-4 py-2.5 rounded-lg bg-[#780037] text-[#ffffff] text-[0.875rem] font-medium hover:opacity-90 whitespace-nowrap min-h-[44px] flex items-center justify-center cursor-pointer"
                  >
                    View Assessments Table →
                  </button>
                </div>

                <MetricCards
                  completedCount={completedCount}
                  pendingCount={pendingCount}
                  flaggedCount={flaggedCount}
                  dueCount={dueCount}
                  onFilterByMetric={() => setCurrentTab('assessments')}
                />

                <TrajectoryChart onProtocolClick={() => setIsConfigModalOpen(true)} />

                <MyCasesView
                  assessments={assessments}
                  onOpenAssessment={(rec) => {
                    setSelectedAssessment(rec);
                    setCurrentTab('assessments');
                  }}
                />
              </div>
            )}

            {currentTab === 'my-cases' && (
              <div className="pt-2">
                <MyCasesView
                  assessments={assessments}
                  onOpenAssessment={(rec) => setSelectedAssessment(rec)}
                />
              </div>
            )}

            {currentTab === 'risk-monitoring' && (
              <div className="pt-2">
                <RiskMonitoringView
                  assessments={assessments}
                  onOpenAssessment={(rec) => setSelectedAssessment(rec)}
                />
              </div>
            )}

            {currentTab === 'interventions' && (
              <div className="pt-2">
                <InterventionsView />
              </div>
            )}

            {currentTab === 'appointments' && (
              <div className="pt-2">
                <AppointmentsView />
              </div>
            )}

            {currentTab === 'reports' && (
              <div className="pt-2">
                <ReportsView />
              </div>
            )}

            {currentTab === 'messages' && (
              <div className="pt-2">
                <MessagesView />
              </div>
            )}

            {currentTab === 'team' && (
              <div className="pt-2">
                <TeamView />
              </div>
            )}

            {currentTab === 'resources' && (
              <div className="pt-2">
                <ResourcesView />
              </div>
            )}

            {currentTab === 'settings' && (
              <div className="pt-2">
                <SettingsView />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        flaggedCount={flaggedCount}
      />

      {/* Modals */}
      <AssessmentDetailModal
        record={selectedAssessment}
        onClose={() => setSelectedAssessment(null)}
        onUpdateStatus={handleUpdateStatus}
      />

      <AssignAssessmentModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onAssign={handleAddNewAssessment}
      />

      <ConfigureScalesModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSave={(cfg) => showToast('Protocol cutoffs updated for PSS-2026.4')}
      />

      <BatchAssignModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onSuccess={handleBatchSuccess}
      />

      <ScaleLibraryModal
        isOpen={isSpecsModalOpen}
        onClose={() => setIsSpecsModalOpen(false)}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        assessments={assessments}
      />

      {/* Help Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] p-4">
          <div className="bg-[#ffffff] rounded-2xl max-w-md w-full p-6 border border-[#e4e1e7] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#e4e1e7] pb-3">
              <h3 className="text-[1.125rem] font-bold text-[#1b1b1f]">
                Clinical Workspace Documentation
              </h3>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="text-[#5e5e67] hover:text-[#1b1b1f]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="text-[0.875rem] text-[#5e5e67] space-y-2 leading-relaxed">
              <p>
                <strong>DYNA MIND Counsellor Workspace:</strong> Standardized diagnostic screener intake and triage monitoring portal.
              </p>
              <p>
                • <strong>Tier 3 Triggers:</strong> Critical scores (PHQ-9 ≥ 15, GAD-7 ≥ 15, or suicidal ideation item #9 &gt; 0) flag immediate supervisor alerts.
              </p>
              <p>
                • <strong>Data Actions:</strong> Click any table row or action button to review itemized client answers or dispatch reminders.
              </p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsHelpOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#780037] text-[#ffffff] text-[0.875rem] font-semibold"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
