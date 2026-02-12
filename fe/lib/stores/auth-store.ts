'use client';

import { create } from 'zustand';
import type { User } from '@/lib/types';
import { authApi } from '@/lib/api/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  setAuth: (token: string, user: User) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,

  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    set({ token, user });
  },

  login: async (email, password) => {
    const res = await authApi.login({ email, password });
    localStorage.setItem('token', res.token);
    set({ token: res.token, user: res.user });
  },

  signup: async (email, password) => {
    const res = await authApi.signup({ email, password });
    localStorage.setItem('token', res.token);
    set({ token: res.token, user: res.user });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },

  fetchMe: async () => {
    set({ loading: true });
    try {
      const user = await authApi.me();
      set({ user, loading: false });
    } catch {
      localStorage.removeItem('token');
      set({ token: null, user: null, loading: false });
    }
  },

  hydrate: () => {
    const token = localStorage.getItem('token');
    if (token) {
      set({ token });
    }
  },
}));
