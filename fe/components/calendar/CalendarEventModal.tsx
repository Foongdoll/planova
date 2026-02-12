'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCalendarStore } from '@/lib/stores/calendar-store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { NODE_COLOR_PRESETS } from '@/lib/utils/constants';
import type { CalendarEvent } from '@/lib/types';

interface CalendarEventModalProps {
  date: string;
  event: CalendarEvent | null;
  onClose: () => void;
}

export function CalendarEventModal({ date, event, onClose }: CalendarEventModalProps) {
  const { createEvent, updateEvent, deleteEvent } = useCalendarStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(date);
  const [endDate, setEndDate] = useState(date);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [allDay, setAllDay] = useState(true);
  const [color, setColor] = useState('');
  const [saving, setSaving] = useState(false);

  const isEditing = !!event;

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description ?? '');
      setStartDate(event.startDate);
      setEndDate(event.endDate);
      setStartTime(event.startTime ?? '');
      setEndTime(event.endTime ?? '');
      setAllDay(event.allDay);
      setColor(event.color ?? '');
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      if (isEditing) {
        await updateEvent(event.id, {
          title,
          description: description || undefined,
          startDate,
          endDate,
          startTime: allDay ? undefined : startTime || undefined,
          endTime: allDay ? undefined : endTime || undefined,
          allDay,
          color: color || undefined,
        });
      } else {
        await createEvent({
          title,
          description: description || undefined,
          startDate,
          endDate,
          startTime: allDay ? undefined : startTime || undefined,
          endTime: allDay ? undefined : endTime || undefined,
          allDay,
          color: color || undefined,
        });
      }
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!event) return;
    if (confirm('이 일정을 삭제하시겠습니까?')) {
      await deleteEvent(event.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/20"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="relative w-[calc(100%-2rem)] sm:w-full max-w-md mx-4 sm:mx-0 rounded-xl border border-[#E7DDCB] bg-white shadow-xl"
      >
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">
              {isEditing ? '일정 수정' : '새 일정'}
            </h3>
            <button type="button" onClick={onClose} className="rounded-lg hover:bg-[#F2E9DA] transition px-1.5 py-0.5 text-xs">
              ✕
            </button>
          </div>

          <Input
            label="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="일정 제목"
            required
          />

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={allDay}
                onChange={(e) => setAllDay(e.target.checked)}
                className="rounded border-[#E7DDCB] accent-[#8BB86E]"
              />
              종일
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Input
              label="시작일"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              label="종료일"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          {!allDay && (
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="시작 시간"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <Input
                label="종료 시간"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-700">색상</label>
            <div className="flex flex-wrap gap-1">
              {NODE_COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.value || 'default'}
                  type="button"
                  onClick={() => setColor(preset.value)}
                  title={preset.label}
                  className={`h-6 w-6 rounded-md border-2 transition hover:scale-110 ${
                    color === preset.value ? 'ring-2 ring-[#B9D98C] ring-offset-1' : ''
                  }`}
                  style={{
                    backgroundColor: preset.bg,
                    borderColor: preset.border,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-700">설명</label>
            <textarea
              className="w-full rounded-lg border border-[#E7DDCB] bg-white px-2.5 py-1.5 text-xs outline-none focus:border-[#B9D98C] focus:ring-2 focus:ring-[#E8F3D8] transition placeholder:text-neutral-400 min-h-[50px] resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="설명 (선택)"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? '저장 중...' : isEditing ? '수정' : '추가'}
            </Button>
            {isEditing && (
              <Button type="button" onClick={handleDelete} variant="ghost" className="border-red-200 text-red-500 hover:bg-red-50">
                삭제
              </Button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
