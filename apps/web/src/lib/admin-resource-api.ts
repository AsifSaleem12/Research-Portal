import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_ACCESS_COOKIE, getApiBaseUrl } from './admin-auth';

export const adminResourceEndpoints = {
  researchers: {
    listPath: '/researchers',
    collectionPath: '/researchers',
    itemPath: '/researchers',
  },
  publications: {
    listPath: '/publications/admin/all',
    collectionPath: '/publications',
    itemPath: '/publications',
  },
  projects: {
    listPath: '/projects/admin/all',
    collectionPath: '/projects',
    itemPath: '/projects',
  },
  theses: {
    listPath: '/theses/admin/all',
    collectionPath: '/theses',
    itemPath: '/theses',
  },
  departments: {
    listPath: '/departments',
    collectionPath: '/departments',
    itemPath: '/departments',
  },
  groups: {
    listPath: '/groups',
    collectionPath: '/groups',
    itemPath: '/groups',
  },
  news: {
    listPath: '/news/admin/all',
    collectionPath: '/news',
    itemPath: '/news',
  },
  'research-areas': {
    listPath: '/research-areas',
    collectionPath: '/research-areas',
    itemPath: '/research-areas',
  },
} as const;

export type AdminResourceName = keyof typeof adminResourceEndpoints;

export function isAdminResourceName(value: string): value is AdminResourceName {
  return value in adminResourceEndpoints;
}

export function getAdminApiHeaders() {
  const accessToken = cookies().get(ADMIN_ACCESS_COOKIE)?.value;

  if (!accessToken) {
    return null;
  }

  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
}

export async function proxyAdminApiRequest(
  resource: AdminResourceName,
  path: string,
  init?: RequestInit,
) {
  const headers = getAdminApiHeaders();

  if (!headers) {
    return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 });
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      ...headers,
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  const payload = (await response.json().catch(() => null)) as
    | { message?: string; data?: unknown }
    | null;

  if (!response.ok) {
    return NextResponse.json(
      { message: payload?.message ?? `Unable to process ${resource}.` },
      { status: response.status },
    );
  }

  return NextResponse.json(payload);
}
