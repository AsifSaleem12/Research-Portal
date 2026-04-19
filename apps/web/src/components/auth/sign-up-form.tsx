'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, Mail, ShieldCheck, User2 } from 'lucide-react';

export function SignUpForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        setError(payload?.message ?? 'Unable to create your account.');
        return;
      }

      setSuccess('Your researcher account has been created. You can sign in from the login page.');
      setName('');
      setEmail('');
      setPassword('');
    } catch {
      setError('Unable to create your account right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-ink" htmlFor="sign-up-name">
          Full Name
        </label>
        <div className="group flex items-center rounded-2xl border border-line bg-white px-4 transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10">
          <User2 className="h-4 w-4 text-slate-400 transition-colors group-focus-within:text-accent" />
          <input
            id="sign-up-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full bg-transparent px-3 py-3 text-sm text-ink outline-none placeholder:text-slate-400"
            placeholder="Enter your full name"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-ink" htmlFor="sign-up-email">
          Email
        </label>
        <div className="group flex items-center rounded-2xl border border-line bg-white px-4 transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10">
          <Mail className="h-4 w-4 text-slate-400 transition-colors group-focus-within:text-accent" />
          <input
            id="sign-up-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full bg-transparent px-3 py-3 text-sm text-ink outline-none placeholder:text-slate-400"
            placeholder="researcher@lgu.edu.pk"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-ink" htmlFor="sign-up-password">
          Password
        </label>
        <div className="group flex items-center rounded-2xl border border-line bg-white px-4 transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10">
          <ShieldCheck className="h-4 w-4 text-slate-400 transition-colors group-focus-within:text-accent" />
          <input
            id="sign-up-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full bg-transparent px-3 py-3 text-sm text-ink outline-none placeholder:text-slate-400"
            placeholder="Create a secure password"
            minLength={8}
            required
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </button>

      <div className="text-center text-sm text-slate-500">
        Already registered?{' '}
        <Link href="/login" className="font-semibold text-accent transition hover:text-ink">
          Sign in
        </Link>
      </div>
    </form>
  );
}
