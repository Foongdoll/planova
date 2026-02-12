'use client';

import { create } from 'zustand';
import type { Dependency, CreateDependencyRequest } from '@/lib/types';
import { dependenciesApi } from '@/lib/api/dependencies';

interface DependencyState {
  dependencies: Dependency[];
  loading: boolean;
  fetchDependencies: (projectId: number) => Promise<void>;
  createDependency: (projectId: number, data: CreateDependencyRequest) => Promise<Dependency>;
  deleteDependency: (depId: number) => Promise<void>;
}

export const useDependencyStore = create<DependencyState>((set, get) => ({
  dependencies: [],
  loading: false,

  fetchDependencies: async (projectId) => {
    set({ loading: true });
    const dependencies = await dependenciesApi.getByProject(projectId);
    set({ dependencies, loading: false });
  },

  createDependency: async (projectId, data) => {
    const dep = await dependenciesApi.create(projectId, data);
    set({ dependencies: [...get().dependencies, dep] });
    return dep;
  },

  deleteDependency: async (depId) => {
    await dependenciesApi.delete(depId);
    set({ dependencies: get().dependencies.filter((d) => d.id !== depId) });
  },
}));
