import { NextResponse } from 'next/server';
import {
  ADMIN_ACCESS_COOKIE,
  ADMIN_REFRESH_COOKIE,
  fetchApiResponse,
  getApiErrorMessage,
  isAdminRole,
  parseBackendAuthPayload,
} from '../../../../../lib/admin-auth';

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const secureCookies = shouldUseSecureCookies(request.url);

  let response: Response;

  try {
    response = await fetchApiResponse('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email ?? '',
        password: body.password ?? '',
      }),
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

  if (!isAdminRole(auth.user.role)) {
    return NextResponse.json(
      { message: 'This account does not have permission to access the admin panel.' },
      { status: 403 },
    );
  }

  const nextResponse = NextResponse.json({
    user: auth.user,
  });

  nextResponse.cookies.set(ADMIN_ACCESS_COOKIE, auth.accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: secureCookies,
    path: '/',
    maxAge: 60 * 15,
  });

  nextResponse.cookies.set(ADMIN_REFRESH_COOKIE, auth.refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: secureCookies,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return nextResponse;
}

function shouldUseSecureCookies(requestUrl: string) {
  const hostname = new URL(requestUrl).hostname;
  return (
    process.env.NODE_ENV === 'production' &&
    hostname !== 'localhost' &&
    hostname !== '127.0.0.1'
  );
}
