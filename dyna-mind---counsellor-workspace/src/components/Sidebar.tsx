import React from 'react';
import { NavTab } from '../types';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unreadCount: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  unreadCount,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems: { tab: NavTab; label: string; icon: string; badge?: number }[] = [
    { tab: 'overview', label: 'Overview', icon: 'grid_view' },
    { tab: 'my-cases', label: 'My Cases', icon: 'folder_shared' },
    { tab: 'assessments', label: 'Assessments', icon: 'assignment' },
    { tab: 'risk-monitoring', label: 'Risk Monitoring', icon: 'crisis_alert' },
    { tab: 'interventions', label: 'Interventions', icon: 'healing' },
    { tab: 'appointments', label: 'Appointments', icon: 'calendar_today' },
    { tab: 'reports', label: 'Reports', icon: 'analytics' },
    { tab: 'messages', label: 'Messages', icon: 'chat_bubble_outline', badge: unreadCount },
  ];

  const workspaceItems: { tab: NavTab; label: string; icon: string }[] = [
    { tab: 'team', label: 'Team', icon: 'group' },
    { tab: 'resources', label: 'Resources', icon: 'menu_book' },
    { tab: 'settings', label: 'Settings', icon: 'settings' },
  ];

  const handleSelectTab = (tab: NavTab) => {
    onTabChange(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-label="Close navigation drawer"
        />
      )}

      <aside 
        id="mainSidebar"
        className={`fixed top-0 left-0 h-screen w-64 lg:w-60 bg-[#ffffff] border-r border-[#e4e1e7] flex flex-col justify-between z-50 select-none shadow-xl lg:shadow-none transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
          {/* Workspace Brand Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-[#e4e1e7]">
            <div className="flex items-center gap-2 min-w-0">
              <img
                alt="Profile Logo"
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                src="https://lh3.googleusercontent.com/aida/AEtjO1WJGGGVsx4YS6Z7QOMFvF-Ct2KhkBNN5SNEVwsd5a_utdCXPwUB0wwgOYynEvgxEJZV6ZRY3mT-MdUnYkzjGSh5G971oKeoFvP42cq0VL5C_t9PnWwyliwnfjh1NfzHxUk5LsxQxptHv5PEAEqjRIQpw3DOy_6x6N0Gx1ytAXfwwETOtwRuz-kEctev2WFgchabuJ2qhmgCyvauqk639nNFSjE5na4ibC16tdniPpvj4IQkXXD5mSj2m5An"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-[1.125rem] font-semibold text-[#1b1b1f] truncate leading-tight tracking-tight">
                  DYNA MIND
                </span>
                <span className="text-[0.75rem] text-[#5e5e67] truncate">
                  Counsellor Workspace
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-[#5e5e67] hover:bg-[#eae7ed] hover:text-[#1b1b1f] transition-colors"
              aria-label="Close navigation"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Primary Navigation */}
          <div className="px-2 py-2">
            <nav className="flex flex-col gap-0.5">
              {navItems.map((item) => {
                const isActive = currentTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => handleSelectTab(item.tab)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-[0.875rem] transition-colors w-full text-left cursor-pointer min-h-[44px] ${
                      isActive
                        ? 'bg-[#ffd9e0] text-[#3f0019] font-semibold'
                        : 'text-[#5e5e67] hover:bg-[#f6f2f8] hover:text-[#1b1b1f] font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px]">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[0.75rem] font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="my-2 border-t border-[#e4e1e7]" />

            <div className="px-3 mb-1.5">
              <span className="text-[0.75rem] uppercase tracking-wider text-[#5e5e67] font-semibold">
                Workspace
              </span>
            </div>

            <nav className="flex flex-col gap-0.5">
              {workspaceItems.map((item) => {
                const isActive = currentTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => handleSelectTab(item.tab)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.875rem] transition-colors w-full text-left cursor-pointer min-h-[44px] ${
                      isActive
                        ? 'bg-[#ffd9e0] text-[#3f0019] font-semibold'
                        : 'text-[#5e5e67] hover:bg-[#f6f2f8] hover:text-[#1b1b1f] font-medium'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

      {/* Counsellor Profile Footer Card */}
      <div className="p-2 border-t border-[#e4e1e7] bg-[#ffffff]">
        <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#f6f2f8]">
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#e0dee9] flex items-center justify-center text-[0.75rem] text-[#62626b] font-semibold">
              AS
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#005f25] border-2 border-[#ffffff] rounded-full" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[0.875rem] text-[#1b1b1f] font-semibold truncate leading-tight">
              Dr. Ananya Sharma
            </span>
            <span className="text-[0.75rem] text-[#5e5e67] truncate">
              Mental Health Counsellor
            </span>
          </div>
        </div>
      </div>
    </aside>
  </>
  );
};
