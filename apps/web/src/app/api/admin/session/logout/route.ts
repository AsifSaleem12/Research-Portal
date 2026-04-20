import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  ADMIN_ACCESS_COOKIE,
  ADMIN_REFRESH_COOKIE,
  fetchApiResponse,
} from '../../../../../lib/admin-auth';

export async function POST(request: Request) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get(ADMIN_ACCESS_COOKIE)?.value;
  const secureCookies = shouldUseSecureCookies(request.url);

  if (accessToken) {
    await fetchApiResponse('/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).catch(() => null);
  }

  const response = NextResponse.json({ loggedOut: true });

  response.cookies.set(ADMIN_ACCESS_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: secureCookies,
    path: '/',
    maxAge: 0,
  });

  response.cookies.set(ADMIN_REFRESH_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: secureCookies,
    path: '/',
    maxAge: 0,
  });

  return response;
}

function shouldUseSecureCookies(requestUrl: string) {
  const hostname = new URL(requestUrl).hostname;
  return (
    process.env.NODE_ENV === 'production' &&
    hostname !== 'localhost' &&
    hostname !== '127.0.0.1'
  );
}
