'use client';

import { createContext, useContext, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useMeQuery, useLogoutMutation } from '@/entities/viewer/api/hooks';
import type { AuthUser } from '@/entities/viewer/api/types';
import { ApiClientError } from '@/shared/api/http/client';
import { clearAuthToken, setAuthToken } from '@/shared/lib/auth/token-storage';
import { useAuthToken } from '@/shared/lib/auth/use-auth-token';

type SessionValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  setToken: (token: string) => void;
  clearToken: () => void;
  logout: () => Promise<void>;
};

const SessionContext = createContext<SessionValue | null>(null);

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const token = useAuthToken();
  const meQuery = useMeQuery();
  const logoutMutation = useLogoutMutation();

  useEffect(() => {
    if (meQuery.error instanceof ApiClientError && meQuery.error.status === 401) {
      clearAuthToken();
    }
  }, [meQuery.error]);

  const value = useMemo<SessionValue>(() => ({
    token,
    user: meQuery.data?.data ?? null,
    isAuthenticated: Boolean(token),
    isLoading: Boolean(token) && meQuery.isPending,
    isError: meQuery.isError,
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
  }), [logoutMutation, meQuery.data, meQuery.error, meQuery.isError, meQuery.isPending, token]);

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within AuthSessionProvider.');
  }

  return context;
}

export function useRequireSession() {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (!session.isLoading && !session.isAuthenticated) {
      router.replace('/login');
    }
  }, [router, session.isAuthenticated, session.isLoading]);

  return session;
}
