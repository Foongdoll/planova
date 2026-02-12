'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="text-center">
        <h1 className="text-lg font-bold">Planova</h1>
        <p className="mt-0.5 text-xs text-neutral-500">로그인하여 시작하세요</p>
      </div>
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-2.5 py-1.5 text-xs text-red-600">{error}</div>
      )}
      <Input label="이메일" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" required />
      <Input label="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6자 이상" required />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? '로그인 중...' : '로그인'}
      </Button>
      <p className="text-center text-xs text-neutral-500">
        계정이 없나요?{' '}
        <Link href="/signup" className="font-medium text-neutral-900 hover:underline">
          회원가입
        </Link>
      </p>
    </form>
  );
}
