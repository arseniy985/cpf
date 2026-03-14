import { getAuthToken } from '@/shared/lib/auth/token-storage';

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly errors?: Record<string, string[]>,
    public readonly code?: string,
    public readonly traceId?: string,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

export function getApiBaseUrl() {
  const value = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (!value) {
    return null;
  }

  return trimTrailingSlash(value);
}

type ApiErrorPayload = {
  code?: string;
  message?: string;
  errors?: Record<string, string[]>;
  details?: Record<string, string[]>;
  traceId?: string;
};

type ApiRequestInit = Omit<RequestInit, 'body'> & {
  authToken?: string;
  requireAuth?: boolean;
  body?: BodyInit | FormData | null;
  idempotencyKey?: string;
};

function shouldSetJsonContentType(body: BodyInit | FormData | null | undefined) {
  if (!body) {
    return false;
  }

  return !(body instanceof FormData);
}

export function buildApiUrl(path: string) {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    throw new ApiClientError('API base URL is not configured.');
  }

  return `${baseUrl}${path}`;
}

export async function fetchJson<T>(path: string, init?: ApiRequestInit): Promise<T> {
  const url = buildApiUrl(path);
  const headers = new Headers(init?.headers);
  const authToken = init?.authToken ?? (init?.requireAuth ? getAuthToken() : null);

  headers.set('Accept', 'application/json');

  if (init?.requireAuth && !authToken) {
    throw new ApiClientError('Authentication required.', 401);
  }

  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }

  if (init?.idempotencyKey) {
    headers.set('Idempotency-Key', init.idempotencyKey);
  }

  if (shouldSetJsonContentType(init?.body) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...init,
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    let payload: ApiErrorPayload | undefined;

    try {
      payload = (await response.json()) as typeof payload;
    } catch {
      payload = undefined;
    }

    throw new ApiClientError(
      payload?.message ?? `API request failed: ${response.status}`,
      response.status,
      payload?.errors ?? payload?.details,
      payload?.code,
      payload?.traceId,
    );
  }

  return response.json() as Promise<T>;
}

export function createIdempotencyKey() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `cpf-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
