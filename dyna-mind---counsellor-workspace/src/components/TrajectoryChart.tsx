import React, { useState } from 'react';

interface TrajectoryChartProps {
  onProtocolClick?: () => void;
}

export const TrajectoryChart: React.FC<TrajectoryChartProps> = ({ onProtocolClick }) => {
  const [activeSpark, setActiveSpark] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-4 items-stretch">
      {/* Visual Distribution Chart & Telemetry (8 cols) */}
      <div className="xl:col-span-8 bg-[#ffffff] rounded-xl p-3.5 sm:p-4 shadow-sm border border-[#e4e1e7] flex flex-col justify-between">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#780037] text-[20px]">
              donut_small
            </span>
            <span className="text-[1rem] sm:text-[1.125rem] font-semibold text-[#1b1b1f]">
              Instrument Volume & Severity Trajectory
            </span>
          </div>
          <span className="text-[0.75rem] text-[#5e5e67]">Rolling 30-Day Window</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 my-2">
          {/* Distribution Spark 1 */}
          <div 
            onClick={() => setActiveSpark(activeSpark === 'PHQ-9' ? null : 'PHQ-9')}
            onMouseEnter={() => setActiveSpark('PHQ-9')}
            onMouseLeave={() => setActiveSpark(null)}
            className={`bg-[#f6f2f8] p-3 rounded-lg flex flex-col transition-all cursor-pointer ${
              activeSpark === 'PHQ-9' ? 'ring-1 ring-[#780037] bg-[#ffd9e0]/20' : 'hover:bg-[#f0edf2]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[0.75rem] text-[#1b1b1f] font-medium">PHQ-9 Depression</span>
              <span className="text-[0.75rem] text-[#5e5e67] font-semibold">24 cases</span>
            </div>
            <div className="flex items-end gap-1.5 h-10 mt-3 pt-1">
              <div className="flex-1 bg-[#eae7ed] rounded-t h-[40%] hover:bg-[#debfc4] transition-colors" title="Week 1: 4 mild" />
              <div className="flex-1 bg-[#eae7ed] rounded-t h-[65%] hover:bg-[#debfc4] transition-colors" title="Week 2: 7 moderate" />
              <div className="flex-1 bg-[#eae7ed] rounded-t h-[50%] hover:bg-[#debfc4] transition-colors" title="Week 3: 5 mild" />
              <div className="flex-1 bg-[#9d174d] rounded-t h-[85%] hover:opacity-90 transition-colors" title="Week 4: 9 elevated" />
              <div className="flex-1 bg-[#9d174d] rounded-t h-[70%] hover:opacity-90 transition-colors" title="Current: 7 elevated" />
            </div>
            <span className="text-[0.75rem] text-[#5e5e67] mt-1">7 moderate-to-severe</span>
          </div>

          {/* Distribution Spark 2 */}
          <div 
            onClick={() => setActiveSpark(activeSpark === 'GAD-7' ? null : 'GAD-7')}
            onMouseEnter={() => setActiveSpark('GAD-7')}
            onMouseLeave={() => setActiveSpark(null)}
            className={`bg-[#f6f2f8] p-3 rounded-lg flex flex-col transition-all cursor-pointer ${
              activeSpark === 'GAD-7' ? 'ring-1 ring-[#780037] bg-[#ffd9e0]/20' : 'hover:bg-[#f0edf2]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[0.75rem] text-[#1b1b1f] font-medium">GAD-7 Anxiety</span>
              <span className="text-[0.75rem] text-[#5e5e67] font-semibold">18 cases</span>
            </div>
            <div className="flex items-end gap-1.5 h-10 mt-3 pt-1">
              <div className="flex-1 bg-[#eae7ed] rounded-t h-[30%] hover:bg-[#debfc4] transition-colors" title="Week 1: 3 low" />
              <div className="flex-1 bg-[#eae7ed] rounded-t h-[45%] hover:bg-[#debfc4] transition-colors" title="Week 2: 4 mild" />
              <div className="flex-1 bg-[#9d174d] rounded-t h-[60%] hover:opacity-90 transition-colors" title="Week 3: 6 moderate" />
              <div className="flex-1 bg-[#eae7ed] rounded-t h-[50%] hover:bg-[#debfc4] transition-colors" title="Week 4: 5 mild" />
              <div className="flex-1 bg-[#9d174d] rounded-t h-[90%] hover:opacity-90 transition-colors" title="Current: 9 elevated" />
            </div>
            <span className="text-[0.75rem] text-[#5e5e67] mt-1">4 elevated indicators</span>
          </div>

          {/* Distribution Spark 3 */}
          <div 
            onClick={() => setActiveSpark(activeSpark === 'WELLBEING' ? null : 'WELLBEING')}
            onMouseEnter={() => setActiveSpark('WELLBEING')}
            onMouseLeave={() => setActiveSpark(null)}
            className={`bg-[#f6f2f8] p-3 rounded-lg flex flex-col transition-all cursor-pointer ${
              activeSpark === 'WELLBEING' ? 'ring-1 ring-[#780037] bg-[#ffd9e0]/20' : 'hover:bg-[#f0edf2]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[0.75rem] text-[#1b1b1f] font-medium">Wellbeing & Stress</span>
              <span className="text-[0.75rem] text-[#5e5e67] font-semibold">17 cases</span>
            </div>
            <div className="flex items-end gap-1.5 h-10 mt-3 pt-1">
              <div className="flex-1 bg-[#005f25]/40 rounded-t h-[60%] hover:opacity-90 transition-colors" title="Week 1: 60% optimal" />
              <div className="flex-1 bg-[#005f25]/60 rounded-t h-[75%] hover:opacity-90 transition-colors" title="Week 2: 75% optimal" />
              <div className="flex-1 bg-[#005f25]/50 rounded-t h-[68%] hover:opacity-90 transition-colors" title="Week 3: 68% optimal" />
              <div className="flex-1 bg-[#005f25] rounded-t h-[82%] hover:opacity-90 transition-colors" title="Week 4: 82% optimal" />
              <div className="flex-1 bg-[#005f25] rounded-t h-[80%] hover:opacity-90 transition-colors" title="Current: 80% optimal" />
            </div>
            <span className="text-[0.75rem] text-[#5e5e67] mt-1">82% favorable stability</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2 text-[#5e5e67] text-[0.75rem]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#9d174d]" />
            Diagnostic scale cycle: 14 days
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#005f25]" />
            Adherence rate: 89.2%
          </span>
        </div>
      </div>

      {/* Active Assessment Protocol Notice (4 cols) */}
      <div className="xl:col-span-4 bg-[#ffffff] rounded-xl p-3.5 sm:p-4 shadow-sm border border-[#e4e1e7] flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[0.75rem] uppercase tracking-wider text-[#5e5e67] font-semibold">
              Clinical Notice
            </span>
            <h3 className="text-[1rem] sm:text-[1.125rem] font-semibold text-[#1b1b1f] mt-1">
              Automated Triggers Active
            </h3>
          </div>
          <span className="w-8 h-8 rounded-lg bg-[#eae7ed] flex items-center justify-center text-[#780037] flex-shrink-0">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
          </span>
        </div>

        <p className="text-[0.75rem] text-[#5e5e67] my-2 leading-relaxed">
          Critical scores (PHQ-9 ≥ 15, GAD-7 ≥ 15, or suicidal ideation item #9 &gt; 0) generate instantaneous clinical supervisor alerts and lock triage routing to Tier 3 priority.
        </p>

        <div 
          onClick={onProtocolClick}
          className="bg-[#f6f2f8] rounded-lg p-2.5 flex items-center justify-between hover:bg-[#f0edf2] transition-colors cursor-pointer"
        >
          <span className="text-[0.75rem] text-[#1b1b1f] font-semibold">
            Triage protocol: PSS-2026.4
          </span>
          <span className="text-[#004519] text-[0.75rem] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#005f25]" />
            Operational
          </span>
        </div>
      </div>
    </div>
  );
};
