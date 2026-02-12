import { apiFetch } from './client';
import type { CalendarEvent, CreateCalendarEventRequest, UpdateCalendarEventRequest } from '@/lib/types';

export const calendarApi = {
  getEvents: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    const qs = params.toString();
    return apiFetch<CalendarEvent[]>(`/calendar/events${qs ? `?${qs}` : ''}`);
  },

  create: (data: CreateCalendarEventRequest) =>
    apiFetch<CalendarEvent>('/calendar/events', { method: 'POST', body: JSON.stringify(data) }),

  update: (eventId: number, data: UpdateCalendarEventRequest) =>
    apiFetch<CalendarEvent>(`/calendar/events/${eventId}`, { method: 'PATCH', body: JSON.stringify(data) }),

  delete: (eventId: number) =>
    apiFetch<void>(`/calendar/events/${eventId}`, { method: 'DELETE' }),
};
