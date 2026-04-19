'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-shell py-10 sm:py-14">
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-[36px] border border-white/70 bg-white/90 shadow-card backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(31,92,163,0.24),transparent_55%),linear-gradient(135deg,rgba(15,35,65,0.06),rgba(176,106,36,0.08))]" />
        <div className="absolute -left-12 top-20 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -right-12 bottom-8 h-40 w-40 rounded-full bg-copper/10 blur-3xl" />

        <div className="relative p-6 sm:p-8 lg:p-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-accent/30 hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to research portal
          </Link>

          <div className="mt-8 rounded-[30px] border border-line/80 bg-white px-6 py-7 shadow-[0_20px_50px_rgba(15,35,65,0.06)] sm:px-8 sm:py-8">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              {eyebrow}
            </div>
            <h1 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{description}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
