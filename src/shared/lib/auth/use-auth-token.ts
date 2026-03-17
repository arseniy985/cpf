'use client';

import { useEffect, useState } from 'react';
import { getAuthToken, subscribeAuthToken } from './token-storage';

export function useAuthTokenState() {
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const syncToken = () => {
      const nextToken = getAuthToken();
      setToken(nextToken);
      setIsReady(true);
    };

    syncToken();

    return subscribeAuthToken(syncToken);
  }, []);

  return { token, isReady };
}

export function useAuthToken() {
  return useAuthTokenState().token;
}
