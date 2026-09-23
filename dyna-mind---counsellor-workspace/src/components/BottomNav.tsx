import React from 'react';
import { NavTab } from '../types';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenMobileMenu: () => void;
  flaggedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  onOpenMobileMenu,
  flaggedCount,
}) => {
  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 h-16 bg-[#ffffff] border-t border-[#e4e1e7] lg:hidden z-30 flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_rgba(0,0,0,0.04)]"
    >
      {/* Overview */}
      <button
        onClick={() => onTabChange('overview')}
        className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors cursor-pointer min-w-[50px] ${
          currentTab === 'overview' ? 'text-[#780037]' : 'text-[#5e5e67]'
        }`}
      >
        <span className={`material-symbols-outlined text-[22px] ${currentTab === 'overview' ? 'font-variation-settings-fill' : ''}`}>
          grid_view
        </span>
        <span className={`text-[10px] mt-0.5 tracking-tight ${currentTab === 'overview' ? 'font-bold text-[#780037]' : 'font-medium'}`}>
          Overview
        </span>
      </button>

      {/* Assessments */}
      <button
        onClick={() => onTabChange('assessments')}
        className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors cursor-pointer min-w-[50px] ${
          currentTab === 'assessments' ? 'text-[#780037]' : 'text-[#5e5e67]'
        }`}
      >
        <span className="material-symbols-outlined text-[22px]">
          assignment
        </span>
        <span className={`text-[10px] mt-0.5 tracking-tight ${currentTab === 'assessments' ? 'font-bold text-[#780037]' : 'font-medium'}`}>
          Assessments
        </span>
      </button>

      {/* My Cases */}
      <button
        onClick={() => onTabChange('my-cases')}
        className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors cursor-pointer min-w-[50px] ${
          currentTab === 'my-cases' ? 'text-[#780037]' : 'text-[#5e5e67]'
        }`}
      >
        <span className="material-symbols-outlined text-[22px]">
          folder_shared
        </span>
        <span className={`text-[10px] mt-0.5 tracking-tight ${currentTab === 'my-cases' ? 'font-bold text-[#780037]' : 'font-medium'}`}>
          Cases
        </span>
      </button>

      {/* Risk Monitoring */}
      <button
        onClick={() => onTabChange('risk-monitoring')}
        className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors cursor-pointer min-w-[50px] ${
          currentTab === 'risk-monitoring' ? 'text-[#ba1a1a]' : 'text-[#5e5e67]'
        }`}
      >
        <div className="relative">
          <span className="material-symbols-outlined text-[22px]">
            crisis_alert
          </span>
          {flaggedCount > 0 && (
            <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse" />
          )}
        </div>
        <span className={`text-[10px] mt-0.5 tracking-tight ${currentTab === 'risk-monitoring' ? 'font-bold text-[#ba1a1a]' : 'font-medium'}`}>
          Risk
        </span>
      </button>

      {/* More / Menu */}
      <button
        onClick={onOpenMobileMenu}
        className="flex flex-col items-center justify-center flex-1 h-full py-1 text-[#5e5e67] hover:text-[#1b1b1f] transition-colors cursor-pointer min-w-[50px]"
      >
        <span className="material-symbols-outlined text-[22px]">
          menu
        </span>
        <span className="text-[10px] font-medium mt-0.5 tracking-tight">
          More
        </span>
      </button>
    </nav>
  );
};
