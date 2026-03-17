import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getBackendApiOrigin } from '@/shared/api/http/backend-url';
import { AUTH_CLIENT_TOKEN_COOKIE, AUTH_PRESENCE_COOKIE, AUTH_TOKEN_COOKIE } from '@/shared/config/session';

const TOKEN_ISSUING_PATHS = new Set([
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/auth/verify-email-code',
  '/api/v1/auth/refresh',
]);

const LOGOUT_PATH = '/api/v1/auth/logout';

const RESPONSE_HEADER_ALLOWLIST = [
  'content-type',
  'content-disposition',
  'cache-control',
  'etag',
  'last-modified',
];

function isSecureRequest(request: NextRequest) {
  return request.nextUrl.protocol === 'https:';
}

function applyAuthCookies(response: NextResponse, request: NextRequest, token: string | null) {
  const baseOptions = {
    path: '/',
    sameSite: 'lax' as const,
    secure: isSecureRequest(request),
  };

  if (token) {
    response.cookies.set({
      name: AUTH_TOKEN_COOKIE,
      value: token,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      ...baseOptions,
    });
    response.cookies.set({
      name: AUTH_PRESENCE_COOKIE,
      value: '1',
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 30,
      ...baseOptions,
    });
    response.cookies.set({
      name: AUTH_CLIENT_TOKEN_COOKIE,
      value: '',
      httpOnly: false,
      maxAge: 0,
      ...baseOptions,
    });
    return;
  }

  response.cookies.set({
    name: AUTH_TOKEN_COOKIE,
    value: '',
    httpOnly: true,
    maxAge: 0,
    ...baseOptions,
  });
  response.cookies.set({
    name: AUTH_PRESENCE_COOKIE,
    value: '',
    httpOnly: false,
    maxAge: 0,
    ...baseOptions,
  });
  response.cookies.set({
    name: AUTH_CLIENT_TOKEN_COOKIE,
    value: '',
    httpOnly: false,
    maxAge: 0,
    ...baseOptions,
  });
}

function buildBackendUrl(request: NextRequest, path: string[]) {
  const targetPath = `/api/v1/${path.join('/')}`;
  const backendOrigin = getBackendApiOrigin();
  const backendUrl = new URL(`${backendOrigin}${targetPath}`);
  backendUrl.search = request.nextUrl.search;

  return backendUrl;
}

function createForwardHeaders(request: NextRequest) {
  const headers = new Headers();
  const contentType = request.headers.get('content-type');
  const accept = request.headers.get('accept');
  const idempotencyKey = request.headers.get('idempotency-key');
  const authToken = request.cookies.get(AUTH_TOKEN_COOKIE)?.value ?? request.cookies.get(AUTH_CLIENT_TOKEN_COOKIE)?.value;

  if (contentType) {
    headers.set('content-type', contentType);
  }

  if (accept) {
    headers.set('accept', accept);
  }

  if (idempotencyKey) {
    headers.set('idempotency-key', idempotencyKey);
  }

  if (authToken) {
    headers.set('authorization', `Bearer ${authToken}`);
  }

  return headers;
}

async function proxyRequest(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const backendUrl = buildBackendUrl(request, path);
  const pathname = request.nextUrl.pathname;
  const headers = createForwardHeaders(request);
  const method = request.method;
  const body = method === 'GET' || method === 'HEAD' ? undefined : await request.arrayBuffer();

  const upstreamResponse = await fetch(backendUrl, {
    method,
    headers,
    body,
    cache: 'no-store',
    redirect: 'manual',
  });

  const responseHeaders = new Headers();
  RESPONSE_HEADER_ALLOWLIST.forEach((headerName) => {
    const value = upstreamResponse.headers.get(headerName);

    if (value) {
      responseHeaders.set(headerName, value);
    }
  });

  const isJson = upstreamResponse.headers.get('content-type')?.includes('application/json') ?? false;

  if (!isJson) {
    const response = new NextResponse(await upstreamResponse.arrayBuffer(), {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });

    if (upstreamResponse.status === 401 || pathname === LOGOUT_PATH) {
      applyAuthCookies(response, request, null);
    }

    return response;
  }

  const payload = await upstreamResponse.json();
  const token = typeof payload?.data?.token === 'string' ? payload.data.token : null;

  if (token) {
    delete payload.data.token;
  }

  const response = NextResponse.json(payload, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });

  if (token && TOKEN_ISSUING_PATHS.has(pathname)) {
    applyAuthCookies(response, request, token);
  } else if (upstreamResponse.status === 401 || pathname === LOGOUT_PATH) {
    applyAuthCookies(response, request, null);
  }

  return response;
}

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(request, context);
}
