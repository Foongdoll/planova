import { apiFetch } from './client';
import type { Task } from '@/lib/types';

export const scheduleApi = {
  recalculate: (projectId: number) =>
    apiFetch<Task[]>(`/projects/${projectId}/recalculate`, { method: 'POST' }),
};
