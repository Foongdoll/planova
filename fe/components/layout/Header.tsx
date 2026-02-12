'use client';

import { useAuthStore } from '@/lib/stores/auth-store';
import { useUiStore } from '@/lib/stores/ui-store';

interface HeaderProps {
  title?: string;
  breadcrumb?: string;
}

export function Header({ title = '대시보드', breadcrumb = '워크스페이스' }: HeaderProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <header className="h-12 lg:h-14 shrink-0 border-b border-[#E7DDCB] bg-white">
      <div className="h-full px-3 lg:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 lg:gap-3 min-w-0">
          {/* Hamburger for mobile */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden shrink-0 h-8 w-8 rounded-lg border border-[#E7DDCB] hover:bg-[#F2E9DA] transition flex items-center justify-center"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
          <span className="text-xs text-neutral-500 hidden sm:block">{breadcrumb}</span>
          <span className="h-3 w-px bg-[#E7DDCB] hidden sm:block" />
          <span className="text-xs lg:text-sm font-semibold truncate">{title}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {user && <span className="text-[11px] text-neutral-500 hidden md:block">{user.email}</span>}
          <button
            onClick={logout}
            className="rounded-lg border border-[#E7DDCB] bg-[#FFF9EF] px-2.5 py-1.5 text-xs hover:bg-[#F2E9DA] transition"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}
