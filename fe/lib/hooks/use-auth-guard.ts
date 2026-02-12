'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';

export function useAuthGuard() {
  const router = useRouter();
  const { token, user, fetchMe, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.replace('/login');
      return;
    }
    if (!user) {
      fetchMe();
    }
  }, [token, user, fetchMe, router]);

  return { user, loading: !user && !!token };
}
