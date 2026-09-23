import React, { useState } from 'react';
import { AssessmentRecord } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessments: AssessmentRecord[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  assessments,
}) => {
  if (!isOpen) return null;

  const [format, setFormat] = useState<'csv' | 'fhir' | 'json'>('csv');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const generateCSV = () => {
    const headers = ['Case_ID', 'Client_Name', 'Instrument', 'Date_Completed', 'Raw_Score', 'Severity_Tier', 'Review_Status', 'Assigned_Counsellor'];
    const rows = assessments.map((a) => [
      a.caseId,
      `"${a.clientName}"`,
      a.scaleName,
      `"${a.completedAt}"`,
      a.rawScore !== undefined ? a.rawScore : 'N/A',
      `"${a.indicationText || a.scoreTag}"`,
      a.status,
      `"${a.assignedBy || 'Dr. Ananya Sharma'}"`
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  };

  const generateFHIR = () => {
    return JSON.stringify({
      resourceType: 'Bundle',
      type: 'collection',
      timestamp: new Date().toISOString(),
      entry: assessments.map((a) => ({
        resource: {
          resourceType: 'Observation',
          status: 'final',
          category: [
            {
              coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'survey', display: 'Survey' }]
            }
          ],
          code: {
            coding: [{ system: 'http://loinc.org', code: a.scaleType === 'PHQ-9' ? '44249-1' : '69737-5', display: a.scaleName }]
          },
          subject: { reference: `Patient/${a.caseId.replace('#', '')}`, display: a.clientName },
          valueQuantity: { value: a.rawScore, unit: 'points' },
          interpretation: [{ text: a.indicationText }]
        }
      }))
    }, null, 2);
  };

  const handleDownload = () => {
    const content = format === 'csv' ? generateCSV() : generateFHIR();
    const mime = format === 'csv' ? 'text/csv' : 'application/json';
    const filename = `psychometric_telemetry_${Date.now()}.${format === 'csv' ? 'csv' : 'json'}`;

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] p-2.5 sm:p-4 overflow-y-auto">
      <div 
        className="bg-[#ffffff] rounded-2xl max-w-xl w-full border border-[#e4e1e7] shadow-xl overflow-hidden my-auto sm:my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-[#e4e1e7] bg-[#f6f2f8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#e0dee9] flex items-center justify-center text-[#62626b] flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">download</span>
            </span>
            <div>
              <h3 className="text-[1rem] sm:text-[1.125rem] font-semibold text-[#1b1b1f]">
                Longitudinal Export & Telemetry Dump
              </h3>
              <p className="text-[0.6875rem] sm:text-[0.75rem] text-[#5e5e67]">
                Structured clinical export for EHR sync and psychiatric referral
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

        <div className="p-4 sm:p-6 space-y-4 text-[#1b1b1f] overflow-y-auto">
          <div>
            <label className="block text-[0.6875rem] sm:text-[0.75rem] font-semibold text-[#5e5e67] uppercase tracking-wider mb-2">
              Select Export Schema & Format
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  format === 'csv'
                    ? 'border-[#780037] bg-[#ffd9e0]/20 text-[#780037]'
                    : 'border-[#e4e1e7] bg-[#ffffff] text-[#1b1b1f] hover:border-[#debfc4]'
                }`}
              >
                <div className="text-[0.875rem] font-bold">Standard CSV</div>
                <div className="text-[0.75rem] text-[#5e5e67] mt-0.5">Spreadsheet & EHR tabular format</div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('fhir')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  format === 'fhir'
                    ? 'border-[#780037] bg-[#ffd9e0]/20 text-[#780037]'
                    : 'border-[#e4e1e7] bg-[#ffffff] text-[#1b1b1f] hover:border-[#debfc4]'
                }`}
              >
                <div className="text-[0.875rem] font-bold">HL7 / FHIR JSON</div>
                <div className="text-[0.75rem] text-[#5e5e67] mt-0.5">Hospital Observation standard</div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('json')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  format === 'json'
                    ? 'border-[#780037] bg-[#ffd9e0]/20 text-[#780037]'
                    : 'border-[#e4e1e7] bg-[#ffffff] text-[#1b1b1f] hover:border-[#debfc4]'
                }`}
              >
                <div className="text-[0.875rem] font-bold">Raw Telemetry</div>
                <div className="text-[0.75rem] text-[#5e5e67] mt-0.5">Detailed JSON items & deltas</div>
              </button>
            </div>
          </div>

          {/* Telemetry Preview */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[0.6875rem] sm:text-[0.75rem] font-semibold text-[#5e5e67] uppercase tracking-wider">
                Telemetry Payload Preview
              </span>
              <span className="text-[0.6875rem] sm:text-[0.75rem] text-[#5e5e67]">
                {assessments.length} records ready
              </span>
            </div>
            <pre className="p-3 bg-[#f6f2f8] rounded-xl border border-[#e4e1e7] text-[11px] font-mono text-[#1b1b1f] max-h-36 sm:max-h-40 overflow-y-auto overflow-x-auto">
              {format === 'csv' ? generateCSV() : generateFHIR()}
            </pre>
          </div>

          {downloadSuccess && (
            <div className="p-2.5 rounded-lg bg-[#a2f6aa]/70 text-[#002108] text-[0.8125rem] font-semibold flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Export generated and downloaded successfully!</span>
            </div>
          )}

          <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 min-h-[44px] rounded-lg bg-[#eae7ed] text-[#1b1b1f] hover:bg-[#e4e1e7] text-[0.875rem] font-medium transition-colors cursor-pointer flex items-center justify-center"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2.5 min-h-[44px] rounded-lg bg-[#780037] text-[#ffffff] hover:opacity-95 text-[0.875rem] font-semibold transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Download {format.toUpperCase()} Package</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
