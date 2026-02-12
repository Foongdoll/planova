import { apiFetch } from './client';
import type { CreateProjectRequest, Project, UpdateProjectRequest } from '@/lib/types';

export const projectsApi = {
  getAll: () =>
    apiFetch<Project[]>('/projects'),

  getById: (id: number) =>
    apiFetch<Project>(`/projects/${id}`),

  create: (data: CreateProjectRequest) =>
    apiFetch<Project>('/projects', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: UpdateProjectRequest) =>
    apiFetch<Project>(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  delete: (id: number) =>
    apiFetch<void>(`/projects/${id}`, { method: 'DELETE' }),
};
