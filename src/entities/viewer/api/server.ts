import { cookies } from 'next/headers';
import { getBackendApiOrigin } from '@/shared/api/http/backend-url';
import { AUTH_CLIENT_TOKEN_COOKIE, AUTH_TOKEN_COOKIE } from '@/shared/config/session';
import type { AuthUser } from './types';

export async function getServerAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value ?? cookieStore.get(AUTH_CLIENT_TOKEN_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const response = await fetch(`${getBackendApiOrigin()}/api/v1/auth/me`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as { data: AuthUser };

  return payload.data;
}
