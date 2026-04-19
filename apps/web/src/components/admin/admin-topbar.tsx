import type { AdminSessionUser } from '../../lib/admin-auth';
import { AdminLogoutButton } from './admin-logout-button';

export function AdminTopbar({ user }: { user: AdminSessionUser }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-line bg-white/90 px-6 py-5 shadow-card">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          Admin Workspace
        </div>
        <div className="mt-2 text-sm text-slate-600">
          Review submissions, publish approved records, and manage institutional content.
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-full bg-accentSoft px-4 py-2 text-sm font-semibold text-accent">
          Portal Administration
        </div>
        <div className="rounded-full border border-line px-4 py-2 text-sm text-slate-700">
          Signed in as {user.name} ({user.role})
        </div>
        <AdminLogoutButton />
      </div>
    </div>
  );
}
