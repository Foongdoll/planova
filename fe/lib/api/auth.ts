import { apiFetch } from './client';
import type { AuthResponse, LoginRequest, SignupRequest, User } from '@/lib/types';

export const authApi = {
  signup: (data: SignupRequest) =>
    apiFetch<AuthResponse>('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: LoginRequest) =>
    apiFetch<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  me: () =>
    apiFetch<User>('/auth/me'),
};
