'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function AdminLogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);

    try {
      await fetch('/api/admin/session/logout', {
        method: 'POST',
      });
    } finally {
      router.push('/login');
      router.refresh();
      setIsSubmitting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSubmitting}
      className="rounded-full border border-line px-4 py-2 text-sm text-slate-700 transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isSubmitting ? 'Signing out...' : 'Logout'}
    </button>
  );
}
