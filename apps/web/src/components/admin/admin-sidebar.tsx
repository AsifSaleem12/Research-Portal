import Link from 'next/link';
import type { AdminSessionUser } from '../../lib/admin-auth';

const adminNav = [
  { href: '/admin/analytics', label: 'Analytics' },
  { href: '/admin/researchers', label: 'Researchers' },
  { href: '/admin/publications', label: 'Publications' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/groups', label: 'Groups' },
  { href: '/admin/theses', label: 'Theses' },
  { href: '/admin/news', label: 'News' },
  { href: '/admin/departments', label: 'Departments' },
  { href: '/admin/research-areas', label: 'Research Areas' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/settings', label: 'Settings' },
];

export function AdminSidebar({ user }: { user: AdminSessionUser }) {
  return (
    <aside className="rounded-[28px] border border-white/60 bg-ink p-5 text-white shadow-card">
      <div className="border-b border-white/10 pb-5">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accentSoft">
          LGU Admin
        </div>
        <div className="mt-2 font-serif text-2xl">Research Office Console</div>
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <div className="text-sm font-semibold text-white">{user.name}</div>
          <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-300">
            {user.role}
          </div>
        </div>
      </div>

      <nav className="mt-5 space-y-2">
        {adminNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-2xl px-4 py-3 text-sm text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
