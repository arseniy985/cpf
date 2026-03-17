'use client';

import { useEffect, useState } from 'react';
import { getAuthToken, subscribeAuthToken } from './token-storage';

export function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const syncToken = () => {
      setToken(getAuthToken());
    };

    syncToken();

    return subscribeAuthToken(syncToken);
  }, []);

  return token;
}
