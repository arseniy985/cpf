'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthToken } from '@/shared/lib/auth/use-auth-token';
import {
  fetchOwnerOrganizationHistory,
  fetchOwnerProjectHistory,
  fetchOwnerRoundHistory,
} from './service';

const auditLogKeys = {
  all: ['audit-log'] as const,
  ownerOrganization: (token: string | null) => [...auditLogKeys.all, 'owner-organization', token] as const,
  ownerProject: (token: string | null, slug: string) => [...auditLogKeys.all, 'owner-project', token, slug] as const,
  ownerRound: (token: string | null, slug: string) => [...auditLogKeys.all, 'owner-round', token, slug] as const,
};

export function useOwnerOrganizationHistoryQuery(token?: string | null) {
  const authToken = useAuthToken();
  const currentToken = token ?? authToken;

  return useQuery({
    queryKey: auditLogKeys.ownerOrganization(currentToken),
    queryFn: () => fetchOwnerOrganizationHistory(),
    enabled: Boolean(currentToken),
  });
}

export function useOwnerProjectHistoryQuery(slug: string | null, token?: string | null) {
  const authToken = useAuthToken();
  const currentToken = token ?? authToken;

  return useQuery({
    queryKey: auditLogKeys.ownerProject(currentToken, slug ?? ''),
    queryFn: () => fetchOwnerProjectHistory(slug ?? ''),
    enabled: Boolean(currentToken && slug),
  });
}

export function useOwnerRoundHistoryQuery(slug: string | null, token?: string | null) {
  const authToken = useAuthToken();
  const currentToken = token ?? authToken;

  return useQuery({
    queryKey: auditLogKeys.ownerRound(currentToken, slug ?? ''),
    queryFn: () => fetchOwnerRoundHistory(slug ?? ''),
    enabled: Boolean(currentToken && slug),
  });
}
