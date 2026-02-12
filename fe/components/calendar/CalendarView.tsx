'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalendarStore } from '@/lib/stores/calendar-store';
import { useTaskStore } from '@/lib/stores/task-store';
import { useProjectStore } from '@/lib/stores/project-store';
import { CalendarEventModal } from './CalendarEventModal';
import { NODE_COLOR_PRESETS } from '@/lib/utils/constants';
import type { CalendarEvent } from '@/lib/types';

interface CalendarItem {
  id: string;
  title: string;
  color: string;
  startDate: string;
  endDate: string;
  isTask: boolean;
  taskId?: number;
  eventId?: number;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

export function CalendarView() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const { events, fetchEvents } = useCalendarStore();
  const tasks = useTaskStore((s) => s.tasks);
  const { projects, fetchProjects } = useProjectStore();

  // Fetch events for visible range
  useEffect(() => {
    const startDate = formatDate(year, month, 1);
    const endDate = formatDate(year, month, getDaysInMonth(year, month));
    fetchEvents(startDate, endDate);
  }, [year, month, fetchEvents]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Merge tasks + calendar events
  const calendarItems: CalendarItem[] = useMemo(() => {
    const items: CalendarItem[] = [];

    // Tasks with dates
    tasks.forEach((t) => {
      if (t.startDate || t.endDate) {
        items.push({
          id: `task-${t.id}`,
          title: t.title,
          color: t.color || '#CFE8A9',
          startDate: t.startDate || t.endDate!,
          endDate: t.endDate || t.startDate!,
          isTask: true,
          taskId: t.id,
        });
      }
    });

    // Calendar events
    events.forEach((e) => {
      items.push({
        id: `event-${e.id}`,
        title: e.title,
        color: e.color || '#DBEAFE',
        startDate: e.startDate,
        endDate: e.endDate,
        isTask: false,
        eventId: e.id,
      });
    });

    return items;
  }, [tasks, events]);

  const getItemsForDate = useCallback((dateStr: string) => {
    return calendarItems.filter((item) => item.startDate <= dateStr && item.endDate >= dateStr);
  }, [calendarItems]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());

  const prevMonth = () => {
    if (month === 0) { setYear(year - 1); setMonth(11); }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setYear(year + 1); setMonth(0); }
    else setMonth(month + 1);
  };

  const goToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  };

  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setEditingEvent(null);
    setModalOpen(true);
  };

  const handleEventClick = (item: CalendarItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.isTask && item.eventId) {
      const event = events.find((ev) => ev.id === item.eventId);
      if (event) {
        setEditingEvent(event);
        setSelectedDate(event.startDate);
        setModalOpen(true);
      }
    }
  };

  // Build calendar grid
  const cells: { date: number | null; dateStr: string }[] = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push({ date: null, dateStr: '' });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: d, dateStr: formatDate(year, month, d) });
  }
  // Fill remaining to complete last row
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let i = 0; i < remaining; i++) {
      cells.push({ date: null, dateStr: '' });
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between border-b border-[#E7DDCB] px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button onClick={prevMonth} className="h-7 w-7 rounded-lg border border-[#E7DDCB] hover:bg-[#F2E9DA] transition flex items-center justify-center text-xs">
            &lsaquo;
          </button>
          <h2 className="text-xs sm:text-sm font-semibold min-w-[80px] sm:min-w-[100px] text-center">
            {year}년 {MONTH_NAMES[month]}
          </h2>
          <button onClick={nextMonth} className="h-7 w-7 rounded-lg border border-[#E7DDCB] hover:bg-[#F2E9DA] transition flex items-center justify-center text-xs">
            &rsaquo;
          </button>
          <button onClick={goToday} className="rounded-lg border border-[#E7DDCB] hover:bg-[#E8F3D8] transition px-2 py-1 text-[11px] font-medium">
            오늘
          </button>
        </div>
        <button
          onClick={() => { setSelectedDate(todayStr); setEditingEvent(null); setModalOpen(true); }}
          className="rounded-lg bg-[#E8F3D8] hover:bg-[#DDF0C4] transition px-2.5 py-1 text-[11px] sm:text-xs font-medium border border-[#B9D98C]"
        >
          + 일정
        </button>
      </div>

      {/* Weekday headers */}
      <div className="shrink-0 grid grid-cols-7 border-b border-[#E7DDCB]">
        {WEEKDAYS.map((d, i) => (
          <div
            key={d}
            className={`py-1.5 text-center text-[11px] font-medium ${
              i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-neutral-500'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-7 h-full" style={{ gridAutoRows: 'minmax(72px, 1fr)' }}>
          {cells.map((cell, idx) => {
            if (!cell.date) {
              return <div key={idx} className="border-b border-r border-[#F2E9DA] bg-[#FDFCFA]" />;
            }

            const items = getItemsForDate(cell.dateStr);
            const isToday = cell.dateStr === todayStr;
            const dayOfWeek = (firstDay + cell.date - 1) % 7;

            return (
              <div
                key={idx}
                onClick={() => handleDateClick(cell.dateStr)}
                className="border-b border-r border-[#F2E9DA] p-1.5 cursor-pointer hover:bg-[#FFF9EF] transition group"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span
                    className={`text-[11px] font-medium inline-flex h-5 w-5 items-center justify-center rounded-full ${
                      isToday
                        ? 'bg-[#8BB86E] text-white'
                        : dayOfWeek === 0
                        ? 'text-red-400'
                        : dayOfWeek === 6
                        ? 'text-blue-400'
                        : 'text-neutral-700'
                    }`}
                  >
                    {cell.date}
                  </span>
                  <span className="text-[10px] text-neutral-300 opacity-0 group-hover:opacity-100 transition">+</span>
                </div>
                <div className="space-y-0.5">
                  {items.slice(0, 3).map((item) => {
                    const preset = NODE_COLOR_PRESETS.find((p) => p.value === item.color);
                    const bg = preset?.bg || item.color;
                    return (
                      <div
                        key={item.id}
                        onClick={(e) => handleEventClick(item, e)}
                        className="truncate rounded px-1 py-px text-[10px] font-medium cursor-pointer hover:opacity-80 transition"
                        style={{ backgroundColor: bg, color: '#333' }}
                        title={item.title}
                      >
                        {item.isTask && <span className="opacity-50 mr-0.5">T</span>}
                        {item.title}
                      </div>
                    );
                  })}
                  {items.length > 3 && (
                    <div className="text-[10px] text-neutral-400 px-1">+{items.length - 3}개 더</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Modal */}
      <AnimatePresence>
        {modalOpen && (
          <CalendarEventModal
            date={selectedDate!}
            event={editingEvent}
            onClose={() => { setModalOpen(false); setEditingEvent(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
