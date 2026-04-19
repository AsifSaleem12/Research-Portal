import { type NextRequest, NextResponse } from 'next/server';
import {
  adminResourceEndpoints,
  isAdminResourceName,
  proxyAdminApiRequest,
} from '../../../../../lib/admin-resource-api';

export async function GET(
  request: NextRequest,
  { params }: { params: { resource: string } },
) {
  if (!isAdminResourceName(params.resource)) {
    return NextResponse.json({ message: 'Unknown admin resource.' }, { status: 404 });
  }

  const endpoint = adminResourceEndpoints[params.resource];
  const query = request.nextUrl.searchParams.toString();
  const suffix = query ? `?${query}` : '';

  return proxyAdminApiRequest(params.resource, `${endpoint.listPath}${suffix}`, {
    method: 'GET',
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { resource: string } },
) {
  if (!isAdminResourceName(params.resource)) {
    return NextResponse.json({ message: 'Unknown admin resource.' }, { status: 404 });
  }

  const endpoint = adminResourceEndpoints[params.resource];
  const body = await request.json().catch(() => ({}));

  return proxyAdminApiRequest(params.resource, endpoint.collectionPath, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
