import { type NextRequest, NextResponse } from 'next/server';
import {
  adminResourceEndpoints,
  isAdminResourceName,
  proxyAdminApiRequest,
} from '../../../../../../lib/admin-resource-api';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { resource: string; id: string } },
) {
  if (!isAdminResourceName(params.resource)) {
    return NextResponse.json({ message: 'Unknown admin resource.' }, { status: 404 });
  }

  const endpoint = adminResourceEndpoints[params.resource];
  const body = await request.json().catch(() => ({}));

  return proxyAdminApiRequest(params.resource, `${endpoint.itemPath}/${params.id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { resource: string; id: string } },
) {
  if (!isAdminResourceName(params.resource)) {
    return NextResponse.json({ message: 'Unknown admin resource.' }, { status: 404 });
  }

  const endpoint = adminResourceEndpoints[params.resource];

  return proxyAdminApiRequest(params.resource, `${endpoint.itemPath}/${params.id}`, {
    method: 'DELETE',
  });
}
