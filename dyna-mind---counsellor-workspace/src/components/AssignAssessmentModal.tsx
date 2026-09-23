import React, { useState } from 'react';
import { AssessmentRecord, ScaleType } from '../types';

interface AssignAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (newRecord: AssessmentRecord) => void;
}

export const AssignAssessmentModal: React.FC<AssignAssessmentModalProps> = ({
  isOpen,
  onClose,
  onAssign,
}) => {
  if (!isOpen) return null;

  const [clientName, setClientName] = useState('P. Joshi');
  const [caseId, setCaseId] = useState('#DM-1055');
  const [scaleType, setScaleType] = useState<ScaleType>('PHQ-9');
  const [deliveryChannel, setDeliveryChannel] = useState('Mobile SMS Prompt');
  const [frequency, setFrequency] = useState('14-day Diagnostic Cycle (Standard)');
  const [notes, setNotes] = useState('Routine bi-weekly depression re-test following pharmacotherapy modification.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let scaleName = 'PHQ-9';
    let scaleSubtitle = 'Patient Health Questionnaire';
    let badgeCode = 'P9';
    let badgeBg = 'bg-[#e3e1ec]';
    let badgeColor = 'text-[#780037]';
    let maxScore = 27;

    if (scaleType === 'GAD-7') {
      scaleName = 'GAD-7';
      scaleSubtitle = 'General Anxiety Disorder-7';
      badgeCode = 'G7';
      badgeBg = 'bg-[#e3e1ec]';
      badgeColor = 'text-[#780037]';
      maxScore = 21;
    } else if (scaleType === 'WELLBEING') {
      scaleName = 'Weekly Wellbeing Index';
      scaleSubtitle = '10-item self-report scale';
      badgeCode = 'WI';
      badgeBg = 'bg-[#a2f6aa]';
      badgeColor = 'text-[#002108]';
      maxScore = 100;
    } else if (scaleType === 'PSS') {
      scaleName = 'PSS-10';
      scaleSubtitle = 'Perceived Stress Scale';
      badgeCode = 'PS';
      badgeBg = 'bg-[#e0dee9]';
      badgeColor = 'text-[#62626b]';
      maxScore = 40;
    }

    const newRecord: AssessmentRecord = {
      id: `rec-${Date.now()}`,
      caseId: caseId.startsWith('#') ? caseId : `#${caseId}`,
      clientName: clientName.trim() || 'New Patient',
      scaleType,
      scaleName,
      scaleSubtitle,
      badgeCode,
      badgeBg,
      badgeColor,
      completedAt: 'Pending',
      scoreText: '—',
      scoreTag: 'Pending',
      scoreTagStyle: 'pending',
      indicationText: 'Awaiting client intake submission',
      status: 'NEEDS_REVIEW',
      statusLabel: 'Needs Review',
      actionType: 'send_reminder',
      actionLabel: 'Send Reminder',
      actionStyle: 'reminder',
      clinicalNotes: notes,
      assignedBy: 'Dr. Ananya Sharma',
      responses: []
    };

    onAssign(newRecord);
    onClose();
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
              <span className="material-symbols-outlined text-[18px]">add_task</span>
            </span>
            <div>
              <h3 className="text-[1rem] sm:text-[1.125rem] font-semibold text-[#1b1b1f]">
                Assign New Screening Assessment
              </h3>
              <p className="text-[0.6875rem] sm:text-[0.75rem] text-[#5e5e67]">
                Dispatch standardized diagnostic battery to client queue
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

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 text-[#1b1b1f] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[0.6875rem] sm:text-[0.75rem] font-semibold text-[#5e5e67] uppercase tracking-wider mb-1">
                Client Name
              </label>
              <input
                required
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. P. Joshi"
                className="w-full h-11 sm:h-10 px-3 rounded-lg border border-[#e4e1e7] bg-[#ffffff] text-[0.875rem] focus:outline-none focus:ring-1 focus:ring-[#9d174d]"
              />
            </div>

            <div>
              <label className="block text-[0.6875rem] sm:text-[0.75rem] font-semibold text-[#5e5e67] uppercase tracking-wider mb-1">
                Case / MRN ID
              </label>
              <input
                required
                type="text"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                placeholder="#DM-1055"
                className="w-full h-11 sm:h-10 px-3 rounded-lg border border-[#e4e1e7] bg-[#ffffff] text-[0.875rem] focus:outline-none focus:ring-1 focus:ring-[#9d174d]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[0.6875rem] sm:text-[0.75rem] font-semibold text-[#5e5e67] uppercase tracking-wider mb-1">
              Assessment Instrument
            </label>
            <select
              value={scaleType}
              onChange={(e) => setScaleType(e.target.value as ScaleType)}
              className="w-full h-11 sm:h-10 px-3 rounded-lg border border-[#e4e1e7] bg-[#ffffff] text-[0.875rem] focus:outline-none focus:ring-1 focus:ring-[#9d174d] cursor-pointer"
            >
              <option value="PHQ-9">PHQ-9 (Patient Health Questionnaire - Depression)</option>
              <option value="GAD-7">GAD-7 (Generalized Anxiety Disorder-7)</option>
              <option value="WELLBEING">Weekly Wellbeing Index (10-Item WHO-5)</option>
              <option value="PSS">PSS-10 (Perceived Stress Scale)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[0.6875rem] sm:text-[0.75rem] font-semibold text-[#5e5e67] uppercase tracking-wider mb-1">
                Reassessment Cadence
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full h-11 sm:h-10 px-3 rounded-lg border border-[#e4e1e7] bg-[#ffffff] text-[0.875rem] focus:outline-none focus:ring-1 focus:ring-[#9d174d] cursor-pointer"
              >
                <option>14-day Diagnostic Cycle (Standard)</option>
                <option>Weekly Recurrent Self-Monitoring</option>
                <option>One-time Pre-Intake Battery</option>
                <option>Monthly Longitudinal Tracking</option>
              </select>
            </div>

            <div>
              <label className="block text-[0.6875rem] sm:text-[0.75rem] font-semibold text-[#5e5e67] uppercase tracking-wider mb-1">
                Delivery Channel
              </label>
              <select
                value={deliveryChannel}
                onChange={(e) => setDeliveryChannel(e.target.value)}
                className="w-full h-11 sm:h-10 px-3 rounded-lg border border-[#e4e1e7] bg-[#ffffff] text-[0.875rem] focus:outline-none focus:ring-1 focus:ring-[#9d174d] cursor-pointer"
              >
                <option>Mobile SMS Prompt</option>
                <option>Patient Web Portal</option>
                <option>In-Clinic Kiosk Tablet</option>
                <option>Automated WhatsApp Check-in</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[0.6875rem] sm:text-[0.75rem] font-semibold text-[#5e5e67] uppercase tracking-wider mb-1">
              Clinical Directive / Intake Instructions
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instructions for the patient or EHR log..."
              className="w-full p-3 rounded-lg border border-[#e4e1e7] bg-[#ffffff] text-[0.875rem] focus:outline-none focus:ring-1 focus:ring-[#9d174d]"
            />
          </div>

          <div className="p-3 bg-[#f6f2f8] rounded-lg text-[0.75rem] text-[#5e5e67] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#005f25] text-[18px] flex-shrink-0">lock_clock</span>
            <span>Client will receive a secure tokenized single-use link expiring in 72 hours.</span>
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
              className="px-4 py-2.5 min-h-[44px] rounded-lg bg-[#780037] text-[#ffffff] hover:opacity-95 text-[0.875rem] font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Dispatch Assessment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
