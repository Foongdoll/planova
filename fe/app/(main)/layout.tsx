'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthGuard } from '@/lib/hooks/use-auth-guard';
import { useUiStore } from '@/lib/stores/ui-store';
import { Spinner } from '@/components/ui/Spinner';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useAuthGuard();
  const { sidebarOpen, setSidebarOpen } = useUiStore();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full relative">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar: hidden on mobile unless toggled */}
      <div
        className={`fixed inset-y-0 left-0 z-40 lg:relative lg:z-0 transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {children}
      </div>
    </div>
  );
}
