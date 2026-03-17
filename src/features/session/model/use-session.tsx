'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
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

const defaultSessionValue: SessionValue = {
  token: null,
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

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const token = useAuthToken();
  const meQuery = useMeQuery();
  const logoutMutation = useLogoutMutation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (meQuery.error instanceof ApiClientError && meQuery.error.status === 401) {
      clearAuthToken();
    }
  }, [meQuery.error]);

  const value = useMemo<SessionValue>(() => ({
    token,
    user: meQuery.data?.data ?? null,
    isAuthenticated: Boolean(token),
    // Delay auth redirects until the client hydrates and localStorage token is read.
    isLoading: !isReady || (Boolean(token) && meQuery.isPending),
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
  }), [isReady, logoutMutation, meQuery.data, meQuery.error, meQuery.isError, meQuery.isPending, token]);

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
  const session = useSession();

  useEffect(() => {
    if (!session.isLoading && !session.isAuthenticated) {
      router.replace('/login');
    }
  }, [router, session.isAuthenticated, session.isLoading]);

  return session;
}
