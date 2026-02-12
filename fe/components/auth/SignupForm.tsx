'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const signup = useAuthStore((s) => s.signup);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(email, password);
      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="text-center">
        <h1 className="text-lg font-bold">Planova</h1>
        <p className="mt-0.5 text-xs text-neutral-500">새 계정을 만드세요</p>
      </div>
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-2.5 py-1.5 text-xs text-red-600">{error}</div>
      )}
      <Input label="이메일" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" required />
      <Input label="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6자 이상" minLength={6} required />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? '가입 중...' : '회원가입'}
      </Button>
      <p className="text-center text-xs text-neutral-500">
        이미 계정이 있나요?{' '}
        <Link href="/login" className="font-medium text-neutral-900 hover:underline">
          로그인
        </Link>
      </p>
    </form>
  );
}
