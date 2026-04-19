'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from 'lucide-react';

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('areeba.ahmed@lgu.edu.pk');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const next = searchParams.get('next') ?? '/admin';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/session/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        setError(payload?.message ?? 'Unable to sign in.');
        return;
      }

      router.push(next.startsWith('/') ? next : '/admin');
      router.refresh();
    } catch {
      setError('Unable to sign in right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-ink" htmlFor="admin-email">
          Email
        </label>
        <div className="group flex items-center rounded-2xl border border-line bg-white px-4 transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10">
          <Mail className="h-4 w-4 text-slate-400 transition-colors group-focus-within:text-accent" />
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full bg-transparent px-3 py-3 text-sm text-ink outline-none placeholder:text-slate-400"
            placeholder="admin@lgu.edu.pk"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-ink" htmlFor="admin-password">
          Password
        </label>
        <div className="group flex items-center rounded-2xl border border-line bg-white px-4 transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10">
          <LockKeyhole className="h-4 w-4 text-slate-400 transition-colors group-focus-within:text-accent" />
          <input
            id="admin-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full bg-transparent px-3 py-3 text-sm text-ink outline-none placeholder:text-slate-400"
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="rounded-full p-1 text-slate-400 transition hover:text-accent"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3 text-sm">
        <Link href="/forgot-password" className="text-slate-500 transition hover:text-accent">
          Forgot password?
        </Link>
        <Link href="/signup" className="font-semibold text-accent transition hover:text-ink">
          Sign up
        </Link>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign in to Admin'
        )}
      </button>
    </form>
  );
}
