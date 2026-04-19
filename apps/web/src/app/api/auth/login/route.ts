import { NextResponse } from 'next/server';
import {
  getApiBaseUrl,
  getApiErrorMessage,
  parseBackendAuthPayload,
} from '../../../../lib/admin-auth';

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };

  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email ?? '',
        password: body.password ?? '',
      }),
      cache: 'no-store',
    });
  } catch {
    return NextResponse.json(
      { message: 'Authentication service is unavailable right now. Please try again.' },
      { status: 503 },
    );
  }

  const payload = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    return NextResponse.json(
      { message: getApiErrorMessage(payload, 'Unable to sign in.') },
      { status: response.status },
    );
  }

  const auth = parseBackendAuthPayload(payload);

  if (!auth) {
    return NextResponse.json(
      { message: 'Unexpected login response from the API.' },
      { status: 502 },
    );
  }

  return NextResponse.json({
    user: auth.user,
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
  });
}
