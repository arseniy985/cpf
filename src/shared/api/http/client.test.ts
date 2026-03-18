import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiClientError, fetchJson } from '@/shared/api/http/client';

const tokenStorageMocks = vi.hoisted(() => ({
  getClientAuthToken: vi.fn((): string | null => null),
  hasAuthSession: vi.fn((): boolean => false),
}));

vi.mock('@/shared/lib/auth/token-storage', () => ({
  getClientAuthToken: tokenStorageMocks.getClientAuthToken,
  hasAuthSession: tokenStorageMocks.hasAuthSession,
}));

describe('fetchJson auth transport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    tokenStorageMocks.getClientAuthToken.mockReturnValue(null);
    tokenStorageMocks.hasAuthSession.mockReturnValue(false);
  });

  it('sends bearer token when a client token is available', async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      expect(init?.headers).toBeInstanceOf(Headers);
      expect((init?.headers as Headers).get('Authorization')).toBe('Bearer direct-token');

      return new Response(JSON.stringify({ data: { ok: true } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    vi.stubGlobal('fetch', fetchMock);
    tokenStorageMocks.getClientAuthToken.mockReturnValue('direct-token');
    tokenStorageMocks.hasAuthSession.mockReturnValue(true);

    await expect(fetchJson<{ data: { ok: boolean } }>('/api/v1/auth/me', { requireAuth: true })).resolves.toEqual({
      data: { ok: true },
    });
  });

  it('allows proxy-backed auth requests without a client token when session presence exists', async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      expect(init?.headers).toBeInstanceOf(Headers);
      expect((init?.headers as Headers).get('Authorization')).toBeNull();

      return new Response(JSON.stringify({ data: { ok: true } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });

    vi.stubGlobal('fetch', fetchMock);
    tokenStorageMocks.hasAuthSession.mockReturnValue(true);

    await expect(fetchJson<{ data: { ok: boolean } }>('/api/v1/auth/me', { requireAuth: true })).resolves.toEqual({
      data: { ok: true },
    });
  });

  it('throws when an authenticated request has no token and no session marker', async () => {
    await expect(fetchJson('/api/v1/auth/me', { requireAuth: true })).rejects.toMatchObject({
      status: 401,
      message: 'Authentication required.',
    } satisfies Partial<ApiClientError>);
  });
});
