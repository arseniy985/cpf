'use client';

import { useSyncExternalStore } from 'react';
import { getAuthToken, subscribeAuthToken } from './token-storage';

export function useAuthToken() {
  return useSyncExternalStore(subscribeAuthToken, getAuthToken, () => null);
}
