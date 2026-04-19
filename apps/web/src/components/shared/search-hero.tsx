import Link from 'next/link';
import { Search } from 'lucide-react';

type SearchHeroProps = {
  title: string;
  description: string;
  stats?: { label: string; value: string }[];
};

export function SearchHero({ title, description, stats }: SearchHeroProps) {
  return (
    <section className="container-shell pt-10 sm:pt-12">
      <div className="surface relative overflow-hidden px-6 py-8 sm:px-10 sm:py-10">
        <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-accentSoft blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-sand blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-5">
            <p className="muted-label">LGU Research Portal</p>
            <h1 className="headline-balance max-w-4xl font-serif text-4xl text-ink sm:text-5xl lg:text-[3.6rem]">
              {title}
            </h1>
            <p className="max-w-2xl text-[15px] leading-7 text-slate-600 sm:text-base">
              {description}
            </p>

            <form action="/search" className="flex flex-col gap-3 rounded-[24px] border border-line bg-white p-3 shadow-sm sm:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-2xl px-4">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  name="q"
                  placeholder="Search researchers, publications, projects, or labs"
                  className="w-full bg-transparent py-3 text-sm text-ink outline-none placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                className="rounded-2xl bg-ink px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent"
              >
                Search Portal
              </button>
            </form>

            <div className="flex flex-wrap gap-3 text-sm text-slate-500">
              <span>Topics:</span>
              <Link href="/search?q=artificial+intelligence" className="hover:text-accent">
                Artificial Intelligence
              </Link>
              <Link href="/search?q=cyber+security" className="hover:text-accent">
                Cyber Security
              </Link>
              <Link href="/search?q=smart+energy" className="hover:text-accent">
                Smart Energy
              </Link>
            </div>
          </div>

          {stats?.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[24px] border border-line/80 bg-slate-50/90 p-5"
                >
                  <div className="text-3xl font-semibold text-ink">{stat.value}</div>
                  <div className="mt-2 text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
