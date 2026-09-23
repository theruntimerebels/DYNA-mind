import React from 'react';

export const ReportsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[1.5rem] font-semibold text-[#1b1b1f] tracking-tight">Psychometric Analytics & Clinical Reports</h2>
        <p className="text-[0.875rem] text-[#5e5e67] mt-0.5">Aggregate symptom trajectories, instrument compliance rates, and outcome measurements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#ffffff] rounded-xl p-5 border border-[#e4e1e7] shadow-sm">
          <h3 className="font-bold text-[1rem] text-[#1b1b1f] mb-2">Cohort Symptom Remission (Q2 2026)</h3>
          <p className="text-[0.75rem] text-[#5e5e67] mb-4">64% of clients completing &ge; 4 sessions demonstrated clinical response (PHQ-9 decrease &ge; 5 points).</p>
          <div className="h-40 bg-[#f6f2f8] rounded-lg flex items-end justify-between p-4 gap-2">
            <div className="flex-1 bg-[#eae7ed] rounded-t h-[30%] flex items-center justify-center text-[10px]">Baseline</div>
            <div className="flex-1 bg-[#eae7ed] rounded-t h-[50%] flex items-center justify-center text-[10px]">Wk 2</div>
            <div className="flex-1 bg-[#eae7ed] rounded-t h-[65%] flex items-center justify-center text-[10px]">Wk 4</div>
            <div className="flex-1 bg-[#9d174d] rounded-t h-[80%] flex items-center justify-center text-[10px] text-white font-bold">Wk 8</div>
            <div className="flex-1 bg-[#005f25] rounded-t h-[92%] flex items-center justify-center text-[10px] text-white font-bold">Wk 12</div>
          </div>
        </div>

        <div className="bg-[#ffffff] rounded-xl p-5 border border-[#e4e1e7] shadow-sm">
          <h3 className="font-bold text-[1rem] text-[#1b1b1f] mb-2">Instrument Compliance & Completion Rate</h3>
          <p className="text-[0.75rem] text-[#5e5e67] mb-4">Overall 89.2% on-time response rate across automated mobile intake triggers.</p>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[0.75rem] mb-1">
                <span>PHQ-9 Depression Screener</span>
                <span className="font-bold">92.4%</span>
              </div>
              <div className="w-full bg-[#eae7ed] rounded-full h-2">
                <div className="bg-[#780037] h-2 rounded-full w-[92%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[0.75rem] mb-1">
                <span>GAD-7 Generalized Anxiety</span>
                <span className="font-bold">88.1%</span>
              </div>
              <div className="w-full bg-[#eae7ed] rounded-full h-2">
                <div className="bg-[#780037] h-2 rounded-full w-[88%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[0.75rem] mb-1">
                <span>Weekly Wellbeing Index</span>
                <span className="font-bold">94.0%</span>
              </div>
              <div className="w-full bg-[#eae7ed] rounded-full h-2">
                <div className="bg-[#005f25] h-2 rounded-full w-[94%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TeamView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[1.5rem] font-semibold text-[#1b1b1f] tracking-tight">Clinical Care Team & Supervisor Roster</h2>
        <p className="text-[0.875rem] text-[#5e5e67] mt-0.5">Licensed counsellors, supervising psychiatrists, and clinical intake triage officers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#ffffff] rounded-xl p-5 border border-[#e4e1e7] shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#ffd9e0] text-[#780037] font-bold flex items-center justify-center">AS</div>
          <div>
            <h3 className="font-bold text-[0.875rem] text-[#1b1b1f]">Dr. Ananya Sharma</h3>
            <span className="text-[0.75rem] text-[#5e5e67]">Senior Mental Health Counsellor</span>
            <span className="inline-block mt-2 px-2 py-0.5 rounded bg-[#a2f6aa] text-[#002108] text-[10px] font-semibold">Active On Duty</span>
          </div>
        </div>

        <div className="bg-[#ffffff] rounded-xl p-5 border border-[#e4e1e7] shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#e0dee9] text-[#62626b] font-bold flex items-center justify-center">VK</div>
          <div>
            <h3 className="font-bold text-[0.875rem] text-[#1b1b1f]">Dr. Vikram Kapoor</h3>
            <span className="text-[0.75rem] text-[#5e5e67]">Consultant Psychiatrist (MD)</span>
            <span className="inline-block mt-2 px-2 py-0.5 rounded bg-[#f6f2f8] text-[#5e5e67] text-[10px] font-semibold">Tier 3 Escalation Lead</span>
          </div>
        </div>

        <div className="bg-[#ffffff] rounded-xl p-5 border border-[#e4e1e7] shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#e0dee9] text-[#62626b] font-bold flex items-center justify-center">MN</div>
          <div>
            <h3 className="font-bold text-[0.875rem] text-[#1b1b1f]">Meera Nair, MSW</h3>
            <span className="text-[0.75rem] text-[#5e5e67]">Licensed Clinical Social Worker</span>
            <span className="inline-block mt-2 px-2 py-0.5 rounded bg-[#a2f6aa] text-[#002108] text-[10px] font-semibold">Triage & Intake</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ResourcesView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[1.5rem] font-semibold text-[#1b1b1f] tracking-tight">Clinical Resources & Psychometric Guidelines</h2>
        <p className="text-[0.875rem] text-[#5e5e67] mt-0.5">DSM-5-TR diagnostic criteria, validated scale rubrics, and clinical practice guides.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#ffffff] rounded-xl p-5 border border-[#e4e1e7] shadow-sm">
          <h3 className="font-bold text-[1rem] text-[#1b1b1f] mb-1">DSM-5-TR Major Depressive Disorder Criteria</h3>
          <p className="text-[0.75rem] text-[#5e5e67] mb-3">Diagnostic threshold guidelines mapping to PHQ-9 severity tiers 10, 15, and 20.</p>
          <span className="text-[0.75rem] text-[#780037] font-semibold">Open Clinical PDF Reference →</span>
        </div>

        <div className="bg-[#ffffff] rounded-xl p-5 border border-[#e4e1e7] shadow-sm">
          <h3 className="font-bold text-[1rem] text-[#1b1b1f] mb-1">GAD-7 Scoring & Differential Diagnostic Guide</h3>
          <p className="text-[0.75rem] text-[#5e5e67] mb-3">Differentiating Generalized Anxiety from Social Anxiety and Panic Disorder.</p>
          <span className="text-[0.75rem] text-[#780037] font-semibold">Open Clinical PDF Reference →</span>
        </div>
      </div>
    </div>
  );
};

export const SettingsView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-[1.5rem] font-semibold text-[#1b1b1f] tracking-tight">Workspace & Clinical Settings</h2>
        <p className="text-[0.875rem] text-[#5e5e67] mt-0.5">EHR integration preferences, token timeouts, and notification thresholds.</p>
      </div>

      <div className="bg-[#ffffff] rounded-xl p-5 border border-[#e4e1e7] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e4e1e7]">
          <div>
            <div className="font-semibold text-[0.875rem]">Automated Patient Reminders</div>
            <div className="text-[0.75rem] text-[#5e5e67]">Send SMS prompt 24 hours prior to assessment expiration</div>
          </div>
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#780037]" />
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-[#e4e1e7]">
          <div>
            <div className="font-semibold text-[0.875rem]">EHR HL7 FHIR Auto-Sync</div>
            <div className="text-[0.75rem] text-[#5e5e67]">Sync completed questionnaires immediately to primary hospital database</div>
          </div>
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#780037]" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-[0.875rem]">Session Inactivity Lockout</div>
            <div className="text-[0.75rem] text-[#5e5e67]">HIPAA compliant 15-minute screen lock</div>
          </div>
          <span className="text-[0.75rem] font-bold text-[#1b1b1f]">15 Minutes</span>
        </div>
      </div>
    </div>
  );
};
