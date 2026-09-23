import React from 'react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onToggleNotifications: () => void;
  unreadCount: number;
  onOpenHelp: () => void;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onToggleNotifications,
  unreadCount,
  onOpenHelp,
  onOpenMobileMenu,
}) => {
  return (
    <header className="fixed top-0 left-0 lg:left-60 right-0 h-16 bg-[#ffffff] border-b border-[#e4e1e7] z-30 flex items-center justify-between px-3 sm:px-6 lg:px-8 transition-all">
      {/* Left: Hamburger menu (mobile) & Section title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 -ml-1 text-[#5e5e67] hover:bg-[#f6f2f8] hover:text-[#1b1b1f] rounded-lg transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="material-symbols-outlined text-[#780037] text-[20px] flex-shrink-0">
            clinical_notes
          </span>
          <span className="text-[0.75rem] text-[#5e5e67] uppercase tracking-wider font-semibold truncate hidden sm:inline">
            Clinical Intake & Monitoring
          </span>
          <span className="text-[0.75rem] text-[#5e5e67] uppercase tracking-wider font-semibold truncate sm:hidden">
            DYNA MIND
          </span>
        </div>
      </div>

      {/* Global Search & Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-2.5 sm:left-3 text-[#5e5e67] text-[18px]">
            search
          </span>
          <input
            id="globalHeaderSearch"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-36 sm:w-56 md:w-72 xl:w-80 h-9.5 pl-8 sm:pl-9 pr-3 rounded-lg border border-[#e4e1e7] bg-[#ffffff] text-[#1b1b1f] text-[0.8125rem] sm:text-[0.875rem] placeholder:text-[#5e5e67] focus:outline-none focus:border-[#9d174d] focus:ring-1 focus:ring-[#9d174d] transition-all"
            placeholder="Search cases..."
            type="text"
          />
        </div>

        <div className="hidden sm:block h-5 w-px bg-[#e4e1e7]" />

        {/* Notifications Button */}
        <button
          id="btnToggleNotifications"
          onClick={onToggleNotifications}
          aria-label="Notifications"
          className="relative p-2 rounded-lg text-[#5e5e67] hover:bg-[#f6f2f8] hover:text-[#1b1b1f] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">
            notifications
          </span>
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a]" />
          )}
        </button>

        {/* Help Button */}
        <button
          id="btnHeaderHelp"
          onClick={onOpenHelp}
          aria-label="Help"
          className="hidden sm:flex p-2 rounded-lg text-[#5e5e67] hover:bg-[#f6f2f8] hover:text-[#1b1b1f] transition-colors cursor-pointer items-center justify-center"
        >
          <span className="material-symbols-outlined text-[20px]">
            help_outline
          </span>
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center pl-0.5 sm:pl-1">
          <img
            alt="Profile Avatar"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-[#e4e1e7]"
            src="https://lh3.googleusercontent.com/aida/AEtjO1WJGGGVsx4YS6Z7QOMFvF-Ct2KhkBNN5SNEVwsd5a_utdCXPwUB0wwgOYynEvgxEJZV6ZRY3mT-MdUnYkzjGSh5G971oKeoFvP42cq0VL5C_t9PnWwyliwnfjh1NfzHxUk5LsxQxptHv5PEAEqjRIQpw3DOy_6x6N0Gx1ytAXfwwETOtwRuz-kEctev2WFgchabuJ2qhmgCyvauqk639nNFSjE5na4ibC16tdniPpvj4IQkXXD5mSj2m5An"
          />
        </div>
      </div>
    </header>
  );
};
