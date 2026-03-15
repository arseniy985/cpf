'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthToken } from '@/shared/lib/auth/use-auth-token';
import { fetchOwnerPayouts } from './service';

export const ownerPayoutKeys = {
  all: ['owner-payouts'] as const,
  list: (token: string | null) => [...ownerPayoutKeys.all, 'list', token] as const,
};

export function useOwnerPayoutsQuery(token?: string | null) {
  const authToken = useAuthToken();
  const currentToken = token ?? authToken;

  return useQuery({
    queryKey: ownerPayoutKeys.list(currentToken),
    queryFn: () => fetchOwnerPayouts(),
    enabled: Boolean(currentToken),
  });
}
