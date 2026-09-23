import React from 'react';
import {
  LayoutGrid,
  Bot,
  HeartPulse,
  TrendingUp,
  CalendarRange,
  LifeBuoy,
} from 'lucide-react';
import { NavigationTab } from '../types';

interface NavigationProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onNavigate,
}) => {
  const tabs: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: LayoutGrid },
    { id: 'companion', label: 'Companion', icon: Bot },
    { id: 'checkin', label: 'Check-in', icon: HeartPulse },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'timeline', label: 'Timeline', icon: CalendarRange },
  ];

  return (
    <>
      {/* Floating Emergency Support Pill */}
      <div className="fixed bottom-20 inset-x-0 z-40 px-4 sm:px-6 pointer-events-none max-w-3xl mx-auto">
        <div className="pointer-events-auto flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_4px_16px_rgba(77,72,102,0.08)] border border-surface-container">
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-4 h-4 text-secondary" />
            <span className="text-[12px] text-on-surface-variant font-medium">
              Need immediate help?
            </span>
          </div>
          <button
            onClick={() => onNavigate('emergency-support')}
            className="text-[12px] font-semibold text-secondary hover:text-primary transition-colors cursor-pointer"
            type="button"
          >
            Get Support →
          </button>
        </div>
      </div>

      {/* Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 w-full z-50 pb-[env(safe-area-inset-bottom,0px)] bg-surface/92 backdrop-blur-xl shadow-[0_-2px_14px_rgba(77,72,102,0.06)] border-t border-surface-container/80">
        <div className="flex justify-around items-center h-18 sm:h-20 px-2 max-w-3xl mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 min-w-[56px] h-14 rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'text-primary font-bold scale-105'
                    : 'text-on-surface-variant/80 hover:text-on-surface hover:bg-surface-container-low/50 font-medium'
                }`}
                type="button"
                aria-current={isActive ? 'page' : undefined}
              >
                <div
                  className={`p-1 rounded-full transition-colors ${
                    isActive ? 'bg-secondary-container/60' : ''
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-secondary'}`} />
                </div>
                <span className="text-[11px] leading-none">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
