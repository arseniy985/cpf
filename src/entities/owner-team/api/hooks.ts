'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthToken } from '@/shared/lib/auth/use-auth-token';
import { fetchOwnerTeam } from './service';

const ownerTeamKeys = {
  all: ['owner-team'] as const,
  team: (token: string | null) => [...ownerTeamKeys.all, 'team', token] as const,
};

export function useOwnerTeamQuery(token?: string | null) {
  const authToken = useAuthToken();
  const currentToken = token ?? authToken;

  return useQuery({
    queryKey: ownerTeamKeys.team(currentToken),
    queryFn: () => fetchOwnerTeam(),
    enabled: Boolean(currentToken),
  });
}
