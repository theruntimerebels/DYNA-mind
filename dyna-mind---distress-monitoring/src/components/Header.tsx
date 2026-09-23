import React from 'react';
import { Menu, Lock } from 'lucide-react';
import { ASSETS } from '../data/mockData';
import { NavigationTab } from '../types';

interface HeaderProps {
  currentTab: NavigationTab;
  isVoiceActive?: boolean;
  onOpenDrawer: () => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  isVoiceActive,
  onOpenDrawer,
  onNavigate,
}) => {
  const getTabTitle = (tab: NavigationTab) => {
    switch (tab) {
      case 'home':
        return 'Home';
      case 'companion':
        return isVoiceActive ? 'Voice Companion' : 'AI Companion';
      case 'checkin':
        return 'Wellbeing Check In';
      case 'insights':
        return 'My Insights';
      case 'timeline':
        return 'Case Timeline';
      case 'resources':
        return 'Resources';
      case 'emergency-support':
        return 'Emergency Support';
      case 'settings':
        return 'Settings';
      default:
        return 'DYNA MIND';
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-[env(safe-area-inset-top,0px)] bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(77,72,102,0.05)] border-b border-surface-container/60">
      <div className="h-28 px-4 sm:px-6 flex flex-col justify-between py-2.5 max-w-3xl mx-auto">
        {/* Top row */}
        <div className="flex items-center justify-between gap-2">
          {/* Logo & Brand */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer group"
          >
            <img
              src={ASSETS.emblem}
              alt="DYNA MIND Emblem"
              className="h-8 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[18px] text-primary tracking-tight truncate font-headline">
                  DYNA MIND
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-secondary text-[10px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                  Balanced
                </span>
              </div>
              <span className="text-[10px] leading-tight text-on-surface-variant truncate max-w-[190px] sm:max-w-xs font-normal">
                Dynamic Mental-health Insight & Neuropsychological Distress Prediction
              </span>
            </div>
          </button>

          {/* Drawer Button & Profile */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              aria-label="Open menu drawer"
              onClick={onOpenDrawer}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-secondary hover:bg-surface-container-low transition-colors cursor-pointer"
              type="button"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('settings')}
              aria-label="Open settings and profile"
              className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:ring-2 hover:ring-secondary/40 transition-all"
              type="button"
            >
              <img
                src={ASSETS.avatar}
                alt="Elena Profile"
                className="w-8 h-8 rounded-full object-cover shadow-[0_2px_6px_rgba(77,72,102,0.12)] border border-white"
                referrerPolicy="no-referrer"
              />
            </button>
          </div>
        </div>

        {/* Sub row with security and page title */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          {isVoiceActive ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/60 text-on-secondary-container">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
              <span className="text-[10px] font-semibold tracking-normal">
                Voice Session Live • Cryptographically Private
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/40 text-on-secondary-container">
              <Lock className="w-3 h-3 text-secondary" />
              <span className="text-[10px] font-semibold tracking-normal">
                Your conversations are private & protected
              </span>
            </div>
          )}

          <div className="text-[12px] font-semibold text-primary truncate max-w-[140px] text-right font-headline">
            {getTabTitle(currentTab)}
          </div>
        </div>
      </div>
    </header>
  );
};
