import React from 'react';
import { MOCK_NOTIFICATIONS } from '../data/mockData';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCase?: (caseId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectCase,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[1px]"
      onClick={onClose}
    >
      <div 
        className="absolute top-16 left-3 right-3 sm:left-auto sm:right-6 w-auto sm:w-96 bg-[#ffffff] rounded-2xl border border-[#e4e1e7] shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#e4e1e7] bg-[#f6f2f8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#780037] text-[18px]">
              notifications
            </span>
            <h4 className="text-[0.875rem] font-semibold text-[#1b1b1f]">
              Clinical Alerts & Triage Triggers
            </h4>
          </div>
          <button 
            onClick={onClose}
            className="text-[0.75rem] text-[#5e5e67] hover:text-[#1b1b1f] p-1 cursor-pointer"
          >
            Dismiss
          </button>
        </div>

        <div className="divide-y divide-[#e4e1e7] max-h-96 overflow-y-auto">
          {MOCK_NOTIFICATIONS.map((notif) => {
            const isCritical = notif.severity === 'critical';
            const isWarning = notif.severity === 'warning';

            return (
              <div 
                key={notif.id}
                onClick={() => {
                  if (notif.title.includes('#DM-')) {
                    const match = notif.title.match(/#DM-\d+/);
                    if (match && onSelectCase) onSelectCase(match[0]);
                  }
                  onClose();
                }}
                className="p-3.5 hover:bg-[#f6f2f8] transition-colors cursor-pointer text-[#1b1b1f]"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[0.75rem] font-bold ${
                    isCritical ? 'text-[#ba1a1a]' : isWarning ? 'text-[#780037]' : 'text-[#1b1b1f]'
                  }`}>
                    {notif.title}
                  </span>
                  <span className="text-[10px] text-[#5e5e67]">{notif.time}</span>
                </div>
                <p className="text-[0.75rem] text-[#5e5e67] leading-relaxed">
                  {notif.message}
                </p>
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-[#f6f2f8] border-t border-[#e4e1e7] text-center">
          <span className="text-[0.75rem] text-[#780037] font-semibold hover:underline cursor-pointer">
            View All Audit Logs →
          </span>
        </div>
      </div>
    </div>
  );
};
