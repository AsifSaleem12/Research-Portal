import { PortalSearchBar } from './portal-search-bar';
import { TagList } from './tag-list';

type DetailHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  meta: string[];
  tags?: string[];
  searchScope?: string;
};

export function DetailHero({
  eyebrow,
  title,
  description,
  meta,
  tags,
  searchScope,
}: DetailHeroProps) {
  return (
    <section className="container-shell pt-10 sm:pt-12">
      <div className="surface px-6 py-8 sm:px-10 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-5">
            <p className="muted-label">{eyebrow}</p>
            <h1 className="headline-balance font-serif text-4xl text-ink sm:text-5xl">
              {title}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-slate-600">{description}</p>
            {tags?.length ? <TagList items={tags} /> : null}
            <PortalSearchBar scope={searchScope} className="max-w-3xl" />
          </div>
          <div className="rounded-[24px] border border-line bg-slate-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              At a glance
            </p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              {meta.map((item) => (
                <div key={item} className="border-b border-line/70 pb-3 last:border-none last:pb-0">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
