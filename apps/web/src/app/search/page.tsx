import Link from 'next/link';
import { EmptyState } from '../../components/shared/empty-state';
import { PageIntro } from '../../components/shared/page-intro';
import { getPortalSearchResults, SearchScope } from '../../lib/search-api';

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { q?: string; scope?: string };
}) {
  const query = searchParams?.q ?? '';
  const scope = (searchParams?.scope ?? 'all') as SearchScope;
  const { results, total } = await getPortalSearchResults(query, scope);

  return (
    <div className="container-shell space-y-8 pb-8">
      <PageIntro
        eyebrow="Search"
        title="Search"
        description="Search researchers, publications, projects, groups, departments, theses, and news."
        searchScope={scope}
        showSearchBar={false}
      />

      <form action="/search" className="surface flex flex-col gap-4 p-5 sm:flex-row">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search the portal"
          className="min-w-0 flex-1 rounded-2xl border border-line bg-slate-50 px-4 py-3 text-sm outline-none focus:border-accent"
        />
        <select
          name="scope"
          defaultValue={scope}
          className="rounded-2xl border border-line bg-slate-50 px-4 py-3 text-sm outline-none focus:border-accent"
        >
          <option value="all">All content</option>
          <option value="researchers">Researchers</option>
          <option value="publications">Publications</option>
          <option value="projects">Projects</option>
          <option value="groups">Groups</option>
          <option value="theses">Theses</option>
          <option value="departments">Departments</option>
          <option value="news">News</option>
        </select>
        <button
          type="submit"
          className="rounded-2xl bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-accent"
        >
          Search
        </button>
      </form>

      {query && results.length ? (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            {total} results for <span className="font-semibold text-ink">{query}</span>
            <span className="ml-2 text-slate-400">Scope: {scope}</span>
          </p>
          <div className="grid gap-4">
            {results.map((result) => (
              <Link
                key={`${result.type}-${result.href}-${result.title}`}
                href={result.href}
                className="surface block p-6"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  {result.type}
                </div>
                <h2 className="mt-3 font-serif text-2xl text-ink">{result.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{result.description}</p>
                <div className="mt-4 text-sm text-slate-500">{result.meta}</div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          title={query ? 'No results found' : 'Start with a search term'}
          description={
            query
              ? 'Try a broader keyword, a department name, or a researcher name.'
              : 'Search for topics like artificial intelligence, cyber security, smart energy, or a faculty member.'
          }
        />
      )}
    </div>
  );
}
