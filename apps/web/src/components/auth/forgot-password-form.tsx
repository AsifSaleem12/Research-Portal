'use client';

import { useState } from 'react';
import Link from 'next/link';
import { KeyRound, Loader2, Mail } from 'lucide-react';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        setError(payload?.message ?? 'Unable to reset password.');
        return;
      }

      setSuccess('Your password has been updated. You can now sign in with the new password.');
      setEmail('');
      setNewPassword('');
    } catch {
      setError('Unable to reset password right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-ink" htmlFor="forgot-email">
          Email
        </label>
        <div className="group flex items-center rounded-2xl border border-line bg-white px-4 transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10">
          <Mail className="h-4 w-4 text-slate-400 transition-colors group-focus-within:text-accent" />
          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full bg-transparent px-3 py-3 text-sm text-ink outline-none placeholder:text-slate-400"
            placeholder="Enter your account email"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-ink" htmlFor="forgot-password">
          New Password
        </label>
        <div className="group flex items-center rounded-2xl border border-line bg-white px-4 transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10">
          <KeyRound className="h-4 w-4 text-slate-400 transition-colors group-focus-within:text-accent" />
          <input
            id="forgot-password"
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="w-full bg-transparent px-3 py-3 text-sm text-ink outline-none placeholder:text-slate-400"
            placeholder="Enter a new password"
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
            Updating password...
          </>
        ) : (
          'Reset Password'
        )}
      </button>

      <div className="text-center text-sm text-slate-500">
        Remembered it?{' '}
        <Link href="/login" className="font-semibold text-accent transition hover:text-ink">
          Back to sign in
        </Link>
      </div>
    </form>
  );
}
