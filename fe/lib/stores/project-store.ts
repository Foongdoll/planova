'use client';

import { create } from 'zustand';
import type { Project, CreateProjectRequest, UpdateProjectRequest } from '@/lib/types';
import { projectsApi } from '@/lib/api/projects';

interface ProjectState {
  projects: Project[];
  loading: boolean;
  fetchProjects: () => Promise<void>;
  createProject: (data: CreateProjectRequest) => Promise<Project>;
  updateProject: (id: number, data: UpdateProjectRequest) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  loading: false,

  fetchProjects: async () => {
    set({ loading: true });
    const projects = await projectsApi.getAll();
    set({ projects, loading: false });
  },

  createProject: async (data) => {
    const project = await projectsApi.create(data);
    set({ projects: [...get().projects, project] });
    return project;
  },

  updateProject: async (id, data) => {
    const updated = await projectsApi.update(id, data);
    set({ projects: get().projects.map((p) => (p.id === id ? updated : p)) });
  },

  deleteProject: async (id) => {
    await projectsApi.delete(id);
    set({ projects: get().projects.filter((p) => p.id !== id) });
  },
}));
