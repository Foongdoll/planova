'use client';

import { create } from 'zustand';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '@/lib/types';
import { tasksApi } from '@/lib/api/tasks';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  fetchTasks: (projectId: number) => Promise<void>;
  createTask: (projectId: number, data: CreateTaskRequest) => Promise<Task>;
  updateTask: (taskId: number, data: UpdateTaskRequest) => Promise<Task>;
  deleteTask: (taskId: number) => Promise<void>;
  updatePosition: (taskId: number, x: number, y: number) => Promise<void>;
  setTasks: (tasks: Task[]) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,

  fetchTasks: async (projectId) => {
    set({ loading: true });
    const tasks = await tasksApi.getByProject(projectId);
    set({ tasks, loading: false });
  },

  createTask: async (projectId, data) => {
    const task = await tasksApi.create(projectId, data);
    set({ tasks: [...get().tasks, task] });
    return task;
  },

  updateTask: async (taskId, data) => {
    const updated = await tasksApi.update(taskId, data);
    set({ tasks: get().tasks.map((t) => (t.id === taskId ? updated : t)) });
    return updated;
  },

  deleteTask: async (taskId) => {
    await tasksApi.delete(taskId);
    set({ tasks: get().tasks.filter((t) => t.id !== taskId) });
  },

  updatePosition: async (taskId, x, y) => {
    const updated = await tasksApi.update(taskId, { positionX: x, positionY: y });
    set({ tasks: get().tasks.map((t) => (t.id === taskId ? updated : t)) });
  },

  setTasks: (tasks) => set({ tasks }),
}));
