'use client';

import { create } from 'zustand';
import type { CalendarEvent, CreateCalendarEventRequest, UpdateCalendarEventRequest } from '@/lib/types';
import { calendarApi } from '@/lib/api/calendar';

interface CalendarState {
  events: CalendarEvent[];
  loading: boolean;
  fetchEvents: (startDate?: string, endDate?: string) => Promise<void>;
  createEvent: (data: CreateCalendarEventRequest) => Promise<CalendarEvent>;
  updateEvent: (eventId: number, data: UpdateCalendarEventRequest) => Promise<CalendarEvent>;
  deleteEvent: (eventId: number) => Promise<void>;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  events: [],
  loading: false,

  fetchEvents: async (startDate, endDate) => {
    set({ loading: true });
    const events = await calendarApi.getEvents(startDate, endDate);
    set({ events, loading: false });
  },

  createEvent: async (data) => {
    const event = await calendarApi.create(data);
    set({ events: [...get().events, event] });
    return event;
  },

  updateEvent: async (eventId, data) => {
    const updated = await calendarApi.update(eventId, data);
    set({ events: get().events.map((e) => (e.id === eventId ? updated : e)) });
    return updated;
  },

  deleteEvent: async (eventId) => {
    await calendarApi.delete(eventId);
    set({ events: get().events.filter((e) => e.id !== eventId) });
  },
}));
