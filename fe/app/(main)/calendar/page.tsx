'use client';

import { Header } from '@/components/layout/Header';
import { CalendarView } from '@/components/calendar/CalendarView';

export default function CalendarPage() {
  return (
    <>
      <Header title="캘린더" breadcrumb="워크스페이스" />
      <main className="flex-1 min-h-0 overflow-hidden bg-[#F7F2E8] p-2 sm:p-3 lg:p-4">
        <div className="h-full rounded-xl border border-[#E7DDCB] bg-white shadow-sm overflow-hidden">
          <CalendarView />
        </div>
      </main>
    </>
  );
}
