import React from 'react';

interface MetricCardsProps {
  completedCount: number;
  pendingCount: number;
  flaggedCount: number;
  dueCount: number;
  onFilterByMetric?: (metricType: 'COMPLETED' | 'PENDING' | 'FLAGGED' | 'DUE') => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  completedCount,
  pendingCount,
  flaggedCount,
  dueCount,
  onFilterByMetric,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
      {/* Metric 1: Completed */}
      <div 
        id="metricCardCompleted"
        onClick={() => onFilterByMetric && onFilterByMetric('COMPLETED')}
        className="relative overflow-hidden bg-[#ffffff] rounded-xl p-3 sm:p-4 shadow-xs border border-[#e4e1e7] flex flex-col justify-between hover:border-[#debfc4] transition-all cursor-pointer min-h-[110px] sm:min-h-[125px]"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[0.6875rem] sm:text-[0.75rem] uppercase tracking-wider text-[#5e5e67] font-semibold truncate">
            Completed
          </span>
          <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] font-semibold text-[#005f25] bg-[#f6f2f8] px-1.5 sm:px-2 py-0.5 rounded">
            <span className="material-symbols-outlined text-[12px] sm:text-[13px]">trending_up</span> +12%
          </span>
        </div>
        <div className="flex items-baseline gap-1 sm:gap-1.5 mb-0.5">
          <span className="text-[1.5rem] sm:text-[1.75rem] lg:text-[2rem] text-[#1b1b1f] font-bold tracking-tight leading-none tabular-nums">
            {completedCount}
          </span>
          <span className="text-[0.6875rem] sm:text-[0.75rem] text-[#5e5e67]">subs</span>
        </div>
        <p className="text-[0.6875rem] text-[#5e5e67] truncate hidden sm:block">This month vs. 37 prior cycle</p>
        
        {/* Indicator bar */}
        <div className="mt-2 sm:mt-2.5 w-full bg-[#eae7ed] rounded-full h-1 overflow-hidden">
          <div className="bg-[#004519] h-1 rounded-full w-[84%]" />
        </div>
      </div>

      {/* Metric 2: Pending */}
      <div 
        id="metricCardPending"
        onClick={() => onFilterByMetric && onFilterByMetric('PENDING')}
        className="relative overflow-hidden bg-[#ffffff] rounded-xl p-3 sm:p-4 shadow-xs border border-[#e4e1e7] flex flex-col justify-between hover:border-[#debfc4] transition-all cursor-pointer min-h-[110px] sm:min-h-[125px]"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[0.6875rem] sm:text-[0.75rem] uppercase tracking-wider text-[#5e5e67] font-semibold truncate">
            Pending
          </span>
          <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] font-semibold text-[#5e5e67] bg-[#f6f2f8] px-1.5 sm:px-2 py-0.5 rounded">
            <span className="material-symbols-outlined text-[12px] sm:text-[13px]">hourglass_empty</span> Active
          </span>
        </div>
        <div className="flex items-baseline gap-1 sm:gap-1.5 mb-0.5">
          <span className="text-[1.5rem] sm:text-[1.75rem] lg:text-[2rem] text-[#1b1b1f] font-bold tracking-tight leading-none tabular-nums">
            {pendingCount}
          </span>
          <span className="text-[0.6875rem] sm:text-[0.75rem] text-[#5e5e67]">intake</span>
        </div>
        <p className="text-[0.6875rem] text-[#5e5e67] truncate hidden sm:block">Awaiting client response</p>
        
        <div className="mt-2 sm:mt-2.5 w-full bg-[#eae7ed] rounded-full h-1 overflow-hidden">
          <div className="bg-[#5e5e67] h-1 rounded-full w-[38%]" />
        </div>
      </div>

      {/* Metric 3: Flagged (Critical Attention) */}
      <div 
        id="metricCardFlagged"
        onClick={() => onFilterByMetric && onFilterByMetric('FLAGGED')}
        className="relative overflow-hidden bg-[#ffffff] rounded-xl p-3 sm:p-4 shadow-xs border border-[#e4e1e7] flex flex-col justify-between hover:border-[#ffdad6] transition-all cursor-pointer min-h-[110px] sm:min-h-[125px]"
      >
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#ba1a1a]" />
        <div className="flex items-center justify-between mb-2 pl-1">
          <span className="text-[0.6875rem] sm:text-[0.75rem] uppercase tracking-wider text-[#ba1a1a] font-semibold truncate">
            Flagged
          </span>
          <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] font-semibold text-[#ba1a1a] bg-[#ffdad6]/60 px-1.5 sm:px-2 py-0.5 rounded">
            <span className="material-symbols-outlined text-[12px] sm:text-[13px]">priority_high</span> Action
          </span>
        </div>
        <div className="flex items-baseline gap-1 sm:gap-1.5 mb-0.5 pl-1">
          <span className="text-[1.5rem] sm:text-[1.75rem] lg:text-[2rem] text-[#ba1a1a] font-bold tracking-tight leading-none tabular-nums">
            {flaggedCount}
          </span>
          <span className="text-[0.6875rem] sm:text-[0.75rem] text-[#5e5e67]">elevated</span>
        </div>
        <p className="text-[0.6875rem] text-[#5e5e67] truncate pl-1 hidden sm:block">Requiring rapid review</p>
        
        <div className="mt-2 sm:mt-2.5 w-full bg-[#eae7ed] rounded-full h-1 overflow-hidden pl-1">
          <div className="bg-[#ba1a1a] h-1 rounded-full w-[65%]" />
        </div>
      </div>

      {/* Metric 4: Due for Schedule */}
      <div 
        id="metricCardDue"
        onClick={() => onFilterByMetric && onFilterByMetric('DUE')}
        className="relative overflow-hidden bg-[#ffffff] rounded-xl p-3 sm:p-4 shadow-xs border border-[#e4e1e7] flex flex-col justify-between hover:border-[#debfc4] transition-all cursor-pointer min-h-[110px] sm:min-h-[125px]"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[0.6875rem] sm:text-[0.75rem] uppercase tracking-wider text-[#5e5e67] font-semibold truncate">
            Due
          </span>
          <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] font-semibold text-[#574146] bg-[#eae7ed] px-1.5 sm:px-2 py-0.5 rounded">
            <span className="material-symbols-outlined text-[12px] sm:text-[13px]">calendar_clock</span> Retest
          </span>
        </div>
        <div className="flex items-baseline gap-1 sm:gap-1.5 mb-0.5">
          <span className="text-[1.5rem] sm:text-[1.75rem] lg:text-[2rem] text-[#1b1b1f] font-bold tracking-tight leading-none tabular-nums">
            {dueCount}
          </span>
          <span className="text-[0.6875rem] sm:text-[0.75rem] text-[#5e5e67]">pending</span>
        </div>
        <p className="text-[0.6875rem] text-[#5e5e67] truncate hidden sm:block">Re-test cycle this week</p>
        
        <div className="mt-2 sm:mt-2.5 w-full bg-[#eae7ed] rounded-full h-1 overflow-hidden">
          <div className="bg-[#8b7076] h-1 rounded-full w-[45%]" />
        </div>
      </div>
    </div>
  );
};
