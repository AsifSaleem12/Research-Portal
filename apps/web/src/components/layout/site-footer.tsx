import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-line/70 bg-white/70">
      <div className="container-shell grid gap-8 py-10 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="muted-label">LGU Research Portal</p>
          <h2 className="font-serif text-2xl text-ink">
            Research records, profiles, and academic outputs in one portal.
          </h2>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            Access researchers, projects, publications, departments, and theses through a single institutional interface.
          </p>
        </div>

        <div className="space-y-3 text-sm text-slate-600">
          <p className="font-semibold text-ink">Explore</p>
          <Link href="/researchers" className="block hover:text-accent">
            Researchers
          </Link>
          <Link href="/projects" className="block hover:text-accent">
            Projects
          </Link>
          <Link href="/publications" className="block hover:text-accent">
            Publications
          </Link>
          <Link href="/theses" className="block hover:text-accent">
            Theses
          </Link>
        </div>

        <div className="space-y-3 text-sm text-slate-600">
          <p className="font-semibold text-ink">Support</p>
          <Link href="/about" className="block hover:text-accent">
            About
          </Link>
          <Link href="/help" className="block hover:text-accent">
            Help
          </Link>
          <Link href="/search" className="block hover:text-accent">
            Search
          </Link>
        </div>
      </div>
    </footer>
  );
}
