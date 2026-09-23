import React from 'react';
import {
  X,
  LayoutGrid,
  Bot,
  HeartPulse,
  TrendingUp,
  CalendarRange,
  BookOpen,
  AlertCircle,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SideDrawerProps {
  isOpen: boolean;
  currentTab: NavigationTab;
  onClose: () => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  currentTab,
  onClose,
  onNavigate,
}) => {
  const links: {
    id: NavigationTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    isEmergency?: boolean;
  }[] = [
    { id: 'home', label: 'Home', icon: LayoutGrid },
    { id: 'companion', label: 'AI Companion', icon: Bot },
    { id: 'checkin', label: 'Wellbeing Check-in', icon: HeartPulse },
    { id: 'insights', label: 'My Insights', icon: TrendingUp },
    { id: 'timeline', label: 'Case Timeline', icon: CalendarRange },
    { id: 'resources', label: 'Resources & Grounding', icon: BookOpen },
    {
      id: 'emergency-support',
      label: 'Emergency Support',
      icon: AlertCircle,
      isEmergency: true,
    },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-50 bg-primary/40 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-72 sm:w-80 bg-surface-bright shadow-[0_20px_40px_-8px_rgba(77,72,102,0.18)] transform transition-transform duration-300 ease-in-out flex flex-col pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] border-l border-surface-container ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        id="side-drawer"
      >
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-surface-container/60">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-secondary" />
            <span className="font-semibold text-[18px] text-primary font-headline">
              Navigation
            </span>
          </div>
          <button
            aria-label="Close menu drawer"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-secondary hover:bg-surface-container-low transition-colors cursor-pointer"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-1.5 no-scrollbar">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;

            if (link.isEmergency) {
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    onClose();
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-tertiary-container hover:bg-tertiary-fixed/40 transition-colors text-left font-semibold cursor-pointer mt-2 bg-tertiary-fixed/20"
                  type="button"
                >
                  <Icon className="w-5 h-5 text-tertiary-container shrink-0" />
                  <span className="text-[15px]">{link.label}</span>
                </button>
              );
            }

            return (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  onClose();
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-secondary-container text-primary font-semibold shadow-xs'
                    : 'text-on-surface hover:bg-surface-container-low'
                }`}
                type="button"
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? 'text-primary' : 'text-secondary'
                  }`}
                />
                <span className="text-[15px]">{link.label}</span>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-surface-container bg-surface-container-lowest/50">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-primary">DYNA MIND v2.4</span>
            <span className="text-[10px] text-on-surface-variant leading-tight">
              Cryptographically isolated longitudinal distress monitoring for civil proceedings.
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
