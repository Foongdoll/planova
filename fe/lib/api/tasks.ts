import { apiFetch } from './client';
import type { CreateTaskRequest, Task, UpdateTaskRequest } from '@/lib/types';

export const tasksApi = {
  getByProject: (projectId: number) =>
    apiFetch<Task[]>(`/projects/${projectId}/tasks`),

  create: (projectId: number, data: CreateTaskRequest) =>
    apiFetch<Task>(`/projects/${projectId}/tasks`, { method: 'POST', body: JSON.stringify(data) }),

  update: (taskId: number, data: UpdateTaskRequest) =>
    apiFetch<Task>(`/tasks/${taskId}`, { method: 'PATCH', body: JSON.stringify(data) }),

  delete: (taskId: number) =>
    apiFetch<void>(`/tasks/${taskId}`, { method: 'DELETE' }),
};
