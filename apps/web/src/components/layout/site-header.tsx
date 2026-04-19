import Link from 'next/link';
import { Search } from 'lucide-react';
import { cookies } from 'next/headers';
import { ADMIN_ACCESS_COOKIE, getAdminUserFromAccessToken } from '../../lib/admin-auth';

const navItems = [
  { href: '/researchers', label: 'Researchers' },
  { href: '/publications', label: 'Publications' },
  { href: '/projects', label: 'Projects' },
  { href: '/groups', label: 'Research Groups' },
  { href: '/departments', label: 'Departments' },
  { href: '/theses', label: 'Theses' },
];

export function SiteHeader() {
  const isAdminSignedIn = Boolean(
    getAdminUserFromAccessToken(cookies().get(ADMIN_ACCESS_COOKIE)?.value),
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="container-shell flex flex-wrap items-center gap-4 py-4 lg:flex-nowrap lg:gap-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-sm font-bold text-white">
            LGU
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Research Portal
            </div>
            <div className="font-serif text-lg text-ink">Lahore Garrison University</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-700 hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex w-full items-center justify-end gap-3 lg:w-auto lg:flex-1">
          <form
            action="/search"
            className="hidden w-full max-w-sm items-center rounded-full border border-line bg-white px-3 py-2 shadow-sm lg:flex"
          >
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="search"
              name="q"
              placeholder="Search the portal"
              className="w-full bg-transparent px-3 text-sm text-ink outline-none placeholder:text-slate-400"
              aria-label="Search the portal"
            />
            <button
              type="submit"
              className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-accent"
            >
              Search
            </button>
          </form>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:border-accent hover:text-accent lg:hidden"
          >
            <Search className="h-4 w-4" />
            Search
          </Link>
          <Link
            href={isAdminSignedIn ? '/admin' : '/login'}
            className="hidden rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink hover:border-accent hover:text-accent md:inline-flex"
          >
            {isAdminSignedIn ? 'Admin Panel' : 'Login'}
          </Link>
        </div>
      </div>
    </header>
  );
}
