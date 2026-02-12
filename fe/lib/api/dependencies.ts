import { apiFetch } from './client';
import type { CreateDependencyRequest, Dependency } from '@/lib/types';

export const dependenciesApi = {
  getByProject: (projectId: number) =>
    apiFetch<Dependency[]>(`/projects/${projectId}/dependencies`),

  create: (projectId: number, data: CreateDependencyRequest) =>
    apiFetch<Dependency>(`/projects/${projectId}/dependencies`, { method: 'POST', body: JSON.stringify(data) }),

  delete: (depId: number) =>
    apiFetch<void>(`/dependencies/${depId}`, { method: 'DELETE' }),
};
