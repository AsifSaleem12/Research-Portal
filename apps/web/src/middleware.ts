import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
  ADMIN_ACCESS_COOKIE,
  getAdminRedirectTarget,
  getAdminUserFromAccessToken,
} from './lib/admin-auth';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const accessToken = request.cookies.get(ADMIN_ACCESS_COOKIE)?.value;
  const adminUser = getAdminUserFromAccessToken(accessToken);

  if (pathname.startsWith('/admin') && !adminUser) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/login' && adminUser) {
    const next = request.nextUrl.searchParams.get('next');
    const target = new URL(getAdminRedirectTarget(next), request.url);
    return NextResponse.redirect(target);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
