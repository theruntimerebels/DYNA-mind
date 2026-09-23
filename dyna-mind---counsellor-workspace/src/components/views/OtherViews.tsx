import React, { useState } from 'react';
import { AssessmentRecord } from '../../types';
import { MOCK_MESSAGES } from '../../data/mockData';

// 1. My Cases View
export const MyCasesView: React.FC<{
  assessments: AssessmentRecord[];
  onOpenAssessment: (record: AssessmentRecord) => void;
}> = ({ assessments, onOpenAssessment }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-[1.25rem] sm:text-[1.5rem] font-semibold text-[#1b1b1f] tracking-tight">Active Clinical Cases</h2>
        <p className="text-[0.8125rem] sm:text-[0.875rem] text-[#5e5e67] mt-0.5">
          Patient caseload roster, diagnostic status, and longitudinal tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {assessments.map((a) => (
          <div 
            key={a.id}
            onClick={() => onOpenAssessment(a)}
            className="bg-[#ffffff] rounded-xl p-4 sm:p-5 border border-[#e4e1e7] shadow-sm hover:border-[#debfc4] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[0.75rem] font-bold text-[#5e5e67] bg-[#f6f2f8] px-2 py-0.5 rounded border border-[#e4e1e7]">
                  {a.caseId}
                </span>
                <span className={`text-[0.75rem] font-semibold px-2 py-0.5 rounded ${
                  a.status === 'FLAGGED' ? 'bg-[#ffdad6] text-[#ba1a1a]' : 'bg-[#e3e1ec] text-[#1a1b23]'
                }`}>
                  {a.statusLabel}
                </span>
              </div>
              <h3 className="text-[1rem] sm:text-[1.125rem] font-bold text-[#1b1b1f]">{a.clientName}</h3>
              <p className="text-[0.75rem] text-[#5e5e67] mt-0.5">
                {a.clientAge} yrs • {a.clientGender} • Primary: {a.scaleName}
              </p>

              <div className="mt-3 p-2.5 bg-[#f6f2f8] rounded-lg text-[0.8125rem]">
                <div className="text-[0.75rem] font-semibold text-[#5e5e67]">Latest Scale Score</div>
                <div className="text-[1rem] font-bold text-[#1b1b1f] mt-0.5">{a.scoreText} ({a.indicationText || a.scoreTag})</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#e4e1e7] flex items-center justify-between text-[0.75rem]">
              <span className="text-[#5e5e67]">Dr. Ananya Sharma</span>
              <span className="text-[#780037] font-semibold">Inspect Case →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. Risk Monitoring View
export const RiskMonitoringView: React.FC<{
  assessments: AssessmentRecord[];
  onOpenAssessment: (record: AssessmentRecord) => void;
}> = ({ assessments, onOpenAssessment }) => {
  const tier3Cases = assessments.filter(a => a.status === 'FLAGGED');
  const tier2Cases = assessments.filter(a => a.status === 'NEEDS_REVIEW');
  const tier1Cases = assessments.filter(a => a.status === 'REVIEWED');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[1.5rem] font-semibold text-[#1b1b1f] tracking-tight">Psychiatric Risk & Triage Monitor</h2>
        <p className="text-[0.875rem] text-[#5e5e67] mt-0.5">
          Real-time suicide risk surveillance, severe symptom spikes, and supervisor alert protocol.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Tier 3: Critical / Action Needed */}
        <div className="bg-[#ffffff] rounded-xl border border-[#ffdad6] p-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#ffdad6]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ba1a1a] animate-pulse" />
              <h3 className="font-bold text-[#ba1a1a] text-[0.875rem] uppercase tracking-wider">
                Tier 3: Immediate Attention ({tier3Cases.length})
              </h3>
            </div>
          </div>
          <p className="text-[0.75rem] text-[#5e5e67] my-2">
            Scores ≥ 15, severe suicidal ideation or acute affective collapse.
          </p>
          <div className="space-y-3 mt-3">
            {tier3Cases.map(c => (
              <div 
                key={c.id} 
                onClick={() => onOpenAssessment(c)}
                className="p-3 bg-[#ffdad6]/30 rounded-lg border border-[#ffdad6] hover:bg-[#ffdad6]/50 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[#ba1a1a] text-[0.875rem]">{c.caseId} • {c.clientName}</span>
                  <span className="text-[0.75rem] font-bold text-[#ba1a1a]">{c.scoreText}</span>
                </div>
                <p className="text-[0.75rem] text-[#574146]">{c.indicationText}</p>
                <div className="mt-2 flex justify-between items-center text-[0.75rem]">
                  <span className="text-[#ba1a1a] font-semibold">Triage Protocol PSS-2026.4</span>
                  <button className="px-2 py-0.5 rounded bg-[#ba1a1a] text-[#ffffff] text-[11px] font-semibold">
                    Review Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 2: Moderate Risk */}
        <div className="bg-[#ffffff] rounded-xl border border-[#e4e1e7] p-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#e4e1e7]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#8b7076]" />
              <h3 className="font-bold text-[#1b1b1f] text-[0.875rem] uppercase tracking-wider">
                Tier 2: Elevated Delta ({tier2Cases.length})
              </h3>
            </div>
          </div>
          <p className="text-[0.75rem] text-[#5e5e67] my-2">
            Moderate range or ≥ +4 point shift requiring psychotherapeutic review.
          </p>
          <div className="space-y-3 mt-3">
            {tier2Cases.map(c => (
              <div 
                key={c.id} 
                onClick={() => onOpenAssessment(c)}
                className="p-3 bg-[#f6f2f8] rounded-lg border border-[#e4e1e7] hover:bg-[#eae7ed] transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-[#1b1b1f] text-[0.875rem]">{c.caseId} • {c.clientName}</span>
                  <span className="text-[0.75rem] font-bold text-[#780037]">{c.scoreText}</span>
                </div>
                <p className="text-[0.75rem] text-[#5e5e67]">{c.indicationText}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tier 1: Stable / Maintenance */}
        <div className="bg-[#ffffff] rounded-xl border border-[#e4e1e7] p-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#e4e1e7]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#005f25]" />
              <h3 className="font-bold text-[#005f25] text-[0.875rem] uppercase tracking-wider">
                Tier 1: Stable / Low ({tier1Cases.length})
              </h3>
            </div>
          </div>
          <p className="text-[0.75rem] text-[#5e5e67] my-2">
            Minimal indicators, favorable progress trajectory, routine bi-weekly follow-up.
          </p>
          <div className="space-y-3 mt-3">
            {tier1Cases.map(c => (
              <div 
                key={c.id} 
                onClick={() => onOpenAssessment(c)}
                className="p-3 bg-[#f6f2f8] rounded-lg border border-[#e4e1e7] hover:bg-[#eae7ed] transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-[#1b1b1f] text-[0.875rem]">{c.caseId} • {c.clientName}</span>
                  <span className="text-[0.75rem] font-bold text-[#005f25]">{c.scoreText}</span>
                </div>
                <p className="text-[0.75rem] text-[#5e5e67]">{c.indicationText}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Messages View
export const MessagesView: React.FC = () => {
  const [activeMessageId, setActiveMessageId] = useState(MOCK_MESSAGES[0].id);
  const [replyText, setReplyText] = useState('');
  const [threadList, setThreadList] = useState(MOCK_MESSAGES);

  const activeThread = threadList.find(t => t.id === activeMessageId) || threadList[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setThreadList(prev => prev.map(t => {
      if (t.id === activeMessageId) {
        return {
          ...t,
          messages: [
            ...t.messages,
            { sender: 'counsellor', text: replyText.trim(), time: 'Just now' }
          ]
        };
      }
      return t;
    }));
    setReplyText('');
  };

  return (
    <div className="bg-[#ffffff] rounded-xl border border-[#e4e1e7] shadow-sm overflow-hidden flex h-[620px]">
      {/* Threads sidebar */}
      <div className="w-80 border-r border-[#e4e1e7] flex flex-col bg-[#f6f2f8]/40">
        <div className="p-4 border-b border-[#e4e1e7] bg-[#ffffff]">
          <h3 className="text-[1rem] font-bold text-[#1b1b1f]">Client Messages</h3>
          <span className="text-[0.75rem] text-[#5e5e67]">3 unread clinical inquiries</span>
        </div>

        <div className="overflow-y-auto flex-1 divide-y divide-[#e4e1e7]">
          {threadList.map(t => (
            <div
              key={t.id}
              onClick={() => setActiveMessageId(t.id)}
              className={`p-3.5 cursor-pointer transition-colors ${
                activeMessageId === t.id ? 'bg-[#ffd9e0]/25 border-l-4 border-[#780037]' : 'hover:bg-[#f6f2f8]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-[0.875rem] text-[#1b1b1f]">{t.clientName}</span>
                <span className="text-[10px] text-[#5e5e67]">{t.time}</span>
              </div>
              <span className="text-[0.75rem] font-medium text-[#780037]">{t.caseId}</span>
              <p className="text-[0.75rem] text-[#5e5e67] truncate mt-1">{t.snippet}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active Conversation */}
      <div className="flex-1 flex flex-col bg-[#ffffff]">
        <div className="p-4 border-b border-[#e4e1e7] bg-[#f6f2f8] flex items-center justify-between">
          <div>
            <h4 className="font-bold text-[#1b1b1f] text-[1rem]">{activeThread.clientName}</h4>
            <span className="text-[0.75rem] text-[#5e5e67]">{activeThread.caseId} • Patient Portal Direct Channel</span>
          </div>
          <span className="text-[0.75rem] text-[#005f25] font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#005f25]" /> End-to-End Encrypted EHR
          </span>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeThread.messages.map((m, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col ${m.sender === 'counsellor' ? 'items-end' : 'items-start'}`}
            >
              <div className={`max-w-md p-3.5 rounded-2xl text-[0.875rem] leading-relaxed ${
                m.sender === 'counsellor'
                  ? 'bg-[#780037] text-[#ffffff] rounded-br-none'
                  : 'bg-[#f6f2f8] text-[#1b1b1f] rounded-bl-none border border-[#e4e1e7]'
              }`}>
                {m.text}
              </div>
              <span className="text-[10px] text-[#5e5e67] mt-1 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-[#e4e1e7] bg-[#f6f2f8] flex gap-2">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type clinical response or instructions..."
            className="flex-1 h-10 px-3 rounded-lg border border-[#e4e1e7] bg-[#ffffff] text-[0.875rem] focus:outline-none focus:ring-1 focus:ring-[#9d174d]"
          />
          <button
            type="submit"
            className="px-4 h-10 rounded-lg bg-[#780037] text-[#ffffff] text-[0.875rem] font-semibold hover:opacity-95 transition-opacity"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

// 4. Interventions View
export const InterventionsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[1.5rem] font-semibold text-[#1b1b1f] tracking-tight">Clinical Interventions & Care Protocols</h2>
        <p className="text-[0.875rem] text-[#5e5e67] mt-0.5">
          Standardized psychotherapeutic interventions, behavioral activation, and CBT workbooks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#ffffff] rounded-xl p-5 border border-[#e4e1e7] shadow-sm">
          <span className="material-symbols-outlined text-[#780037] text-[24px]">psychology_alt</span>
          <h3 className="font-bold text-[1rem] text-[#1b1b1f] mt-2">Cognitive Restructuring (CBT)</h3>
          <p className="text-[0.75rem] text-[#5e5e67] mt-1">Automatic thought logs, cognitive distortion identification, and core belief reframing.</p>
          <span className="mt-4 block text-[0.75rem] font-bold text-[#780037]">14 Clients Active</span>
        </div>

        <div className="bg-[#ffffff] rounded-xl p-5 border border-[#e4e1e7] shadow-sm">
          <span className="material-symbols-outlined text-[#005f25] text-[24px]">self_improvement</span>
          <h3 className="font-bold text-[1rem] text-[#1b1b1f] mt-2">Behavioral Activation</h3>
          <p className="text-[0.75rem] text-[#5e5e67] mt-1">Pleasure and mastery scheduling for unipolar depression recovery based on PHQ-9 trends.</p>
          <span className="mt-4 block text-[0.75rem] font-bold text-[#005f25]">9 Clients Active</span>
        </div>

        <div className="bg-[#ffffff] rounded-xl p-5 border border-[#e4e1e7] shadow-sm">
          <span className="material-symbols-outlined text-[#8b7076] text-[24px]">health_and_safety</span>
          <h3 className="font-bold text-[1rem] text-[#1b1b1f] mt-2">Safety Planning Protocol</h3>
          <p className="text-[0.75rem] text-[#5e5e67] mt-1">Stanley-Brown 6-step crisis intervention plan triggered automatically for Tier 3 flags.</p>
          <span className="mt-4 block text-[0.75rem] font-bold text-[#8b7076]">3 Clients Enrolled</span>
        </div>
      </div>
    </div>
  );
};

// 5. Appointments View
export const AppointmentsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[1.5rem] font-semibold text-[#1b1b1f] tracking-tight">Clinical Intake & Consultation Schedule</h2>
        <p className="text-[0.875rem] text-[#5e5e67] mt-0.5">Upcoming psychometric review appointments and evaluation sessions.</p>
      </div>

      <div className="bg-[#ffffff] rounded-xl border border-[#e4e1e7] overflow-hidden shadow-sm">
        <div className="p-4 bg-[#f6f2f8] border-b border-[#e4e1e7] font-semibold text-[0.875rem]">
          Today's Scheduled Clinical Encounters (12 May 2026)
        </div>
        <div className="divide-y divide-[#e4e1e7]">
          <div className="p-4 flex items-center justify-between hover:bg-[#f6f2f8]">
            <div className="flex items-center gap-4">
              <span className="text-[0.875rem] font-bold text-[#780037] w-20">09:30 AM</span>
              <div>
                <div className="font-bold text-[0.875rem] text-[#1b1b1f]">A. Kumar (#DM-1042)</div>
                <div className="text-[0.75rem] text-[#5e5e67]">Session 5: PHQ-9 post-test review & behavioral plan</div>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#a2f6aa] text-[#002108] text-[0.75rem] font-semibold">Completed</span>
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-[#f6f2f8]">
            <div className="flex items-center gap-4">
              <span className="text-[0.875rem] font-bold text-[#780037] w-20">02:00 PM</span>
              <div>
                <div className="font-bold text-[0.875rem] text-[#ba1a1a]">T. Mehra (#DM-1048)</div>
                <div className="text-[0.75rem] text-[#5e5e67]">Urgent Tier 3 Triage Review • Supervisor Dr. Sharma</div>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#ffdad6] text-[#93000a] text-[0.75rem] font-semibold">Upcoming</span>
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-[#f6f2f8]">
            <div className="flex items-center gap-4">
              <span className="text-[0.875rem] font-bold text-[#780037] w-20">04:15 PM</span>
              <div>
                <div className="font-bold text-[0.875rem] text-[#1b1b1f]">R. Singh (#DM-1037)</div>
                <div className="text-[0.75rem] text-[#5e5e67]">GAD-7 delta exploration & relaxation exercise</div>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#e3e1ec] text-[#1a1b23] text-[0.75rem] font-semibold">Confirmed</span>
          </div>
        </div>
      </div>
    </div>
  );
};
