import { getApiBaseUrl } from './admin-auth';

export type SearchScope =
  | 'all'
  | 'researchers'
  | 'publications'
  | 'projects'
  | 'groups'
  | 'theses'
  | 'departments'
  | 'news';

export type PortalSearchResult = {
  id: string;
  type: string;
  title: string;
  slug: string;
  href: string;
  description: string;
  meta: string;
};

type SearchApiResponse = {
  data?: {
    data?: PortalSearchResult[];
    meta?: {
      total?: number;
      page?: number;
      pageSize?: number;
      pageCount?: number;
      engine?: string;
    };
  };
};

export async function getPortalSearchResults(query: string, scope: SearchScope) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return {
      results: [] as PortalSearchResult[],
      total: 0,
    };
  }

  const params = new URLSearchParams({
    q: trimmedQuery,
    scope,
    page: '1',
    pageSize: '24',
  });

  const response = await fetch(`${getApiBaseUrl()}/search?${params.toString()}`, {
    cache: 'no-store',
  }).catch(() => null);

  if (!response?.ok) {
    return {
      results: [] as PortalSearchResult[],
      total: 0,
    };
  }

  const payload = (await response.json()) as SearchApiResponse;

  return {
    results: payload.data?.data ?? [],
    total: payload.data?.meta?.total ?? 0,
  };
}
