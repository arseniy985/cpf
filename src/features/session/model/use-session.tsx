'use client';

import { createContext, useContext, useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useMeQuery, useLogoutMutation } from '@/entities/viewer/api/hooks';
import type { AuthUser } from '@/entities/viewer/api/types';
import { ApiClientError } from '@/shared/api/http/client';
import { clearAuthToken, setAuthToken } from '@/shared/lib/auth/token-storage';
import { useAuthTokenState } from '@/shared/lib/auth/use-auth-token';

type SessionValue = {
  token: string | null;
  hasToken: boolean;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  setToken: (token?: string | null) => void;
  clearToken: () => void;
  logout: () => Promise<void>;
};

const defaultSessionValue: SessionValue = {
  token: null,
  hasToken: false,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isError: false,
  error: null,
  setToken: setAuthToken,
  clearToken: clearAuthToken,
  logout: async () => {
    clearAuthToken();
  },
};

const SessionContext = createContext<SessionValue>(defaultSessionValue);

export function AuthSessionProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: AuthUser | null;
}) {
  const { token, isReady } = useAuthTokenState();
  const meQuery = useMeQuery(token, initialUser);
  const logoutMutation = useLogoutMutation();
  const resolvedUser = meQuery.data?.data ?? initialUser;
  const hasToken = Boolean(token || initialUser);

  useEffect(() => {
    if (meQuery.error instanceof ApiClientError && meQuery.error.status === 401) {
      clearAuthToken();
    }
  }, [meQuery.error]);

  const value = useMemo<SessionValue>(() => ({
    token,
    hasToken,
    user: resolvedUser ?? null,
    isAuthenticated: Boolean(resolvedUser),
    // Delay auth redirects until the client hydrates and the auth marker cookie is available.
    isLoading: (!isReady && !initialUser) || (hasToken && meQuery.isPending && !resolvedUser),
    isError: hasToken && meQuery.isError,
    error: meQuery.error,
    setToken: setAuthToken,
    clearToken: clearAuthToken,
    logout: async () => {
      if (!token) {
        clearAuthToken();
        return;
      }

      try {
        await logoutMutation.mutateAsync();
      } finally {
        clearAuthToken();
      }
    },
  }), [hasToken, initialUser, isReady, logoutMutation, meQuery.error, meQuery.isError, meQuery.isPending, resolvedUser, token]);

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}

export function useRequireSession() {
  const router = useRouter();
  const pathname = usePathname();
  const session = useSession();

  useEffect(() => {
    if (!session.isLoading && !session.hasToken) {
      const params = new URLSearchParams();
      params.set('next', pathname);
      router.replace(`/login?${params.toString()}`);
    }
  }, [pathname, router, session.hasToken, session.isLoading]);

  return session;
}
