import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
  AUTH_TOKEN_COOKIE,
  PROTECTED_ROUTE_PREFIXES,
} from '@/shared/config/session';

function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  const hasSession = Boolean(request.cookies.get(AUTH_TOKEN_COOKIE)?.value);

  if (hasSession) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('next', `${pathname}${search}`);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/app/:path*', '/dashboard/:path*', '/owner/:path*'],
};
