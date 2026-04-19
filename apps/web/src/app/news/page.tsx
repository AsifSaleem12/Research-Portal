import { PageIntro } from '../../components/shared/page-intro';
import { getNews } from '../../lib/portal-data';

export default function NewsPage() {
  const items = getNews();

  return (
    <div className="container-shell space-y-8 pb-8">
      <PageIntro
        eyebrow="News & Events"
        title="News & Events"
        description="Research announcements, events, and institutional updates."
        searchScope="news"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="surface p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-copper">
              {item.category}
            </div>
            <h2 className="mt-4 font-serif text-3xl text-ink">{item.title}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">{item.summary}</p>
            <div className="mt-6 text-sm text-slate-500">{item.publishedAt}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
