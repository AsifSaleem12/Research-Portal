import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '../../../../lib/admin-auth';
import { getAdminApiHeaders } from '../../../../lib/admin-resource-api';

export async function GET(request: Request) {
  const headers = getAdminApiHeaders();

  if (!headers) {
    return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 });
  }

  const requestUrl = new URL(request.url);
  const query = requestUrl.searchParams.toString();
  const suffix = query ? `?${query}` : '';

  const response = await fetch(`${getApiBaseUrl()}/users${suffix}`, {
    method: 'GET',
    headers,
    cache: 'no-store',
  });

  const payload = (await response.json().catch(() => null)) as
    | { message?: string; data?: unknown }
    | null;

  if (!response.ok) {
    return NextResponse.json(
      { message: payload?.message ?? 'Unable to load users.' },
      { status: response.status },
    );
  }

  return NextResponse.json(payload);
}
