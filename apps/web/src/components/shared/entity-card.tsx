import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { TagList } from './tag-list';

type EntityCardProps = {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  meta?: string;
  tags?: string[];
};

export function EntityCard({
  href,
  eyebrow,
  title,
  description,
  meta,
  tags,
}: EntityCardProps) {
  return (
    <Link
      href={href}
      className="surface group flex h-full flex-col justify-between p-6 transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <p className="muted-label">{eyebrow}</p>
          <ArrowUpRight className="h-4 w-4 text-slate-400 transition-colors group-hover:text-accent" />
        </div>
        <h3 className="font-serif text-2xl leading-tight text-ink">{title}</h3>
        <p className="line-clamp-4 text-sm leading-6 text-slate-600">{description}</p>
      </div>

      <div className="mt-6 space-y-4">
        {meta ? <p className="text-sm font-medium text-slate-500">{meta}</p> : null}
        {tags?.length ? <TagList items={tags} /> : null}
      </div>
    </Link>
  );
}
