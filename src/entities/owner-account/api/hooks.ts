'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthToken } from '@/shared/lib/auth/use-auth-token';
import {
  fetchOwnerWorkspace,
  submitOwnerOnboarding,
  updateOwnerAccount,
  updateOwnerBankProfile,
  updateOwnerOrganization,
} from './service';

export const ownerWorkspaceKeys = {
  all: ['owner-workspace'] as const,
  workspace: (token: string | null) => [...ownerWorkspaceKeys.all, 'workspace', token] as const,
};

export function useOwnerWorkspaceQuery(token?: string | null) {
  const authToken = useAuthToken();
  const currentToken = token ?? authToken;

  return useQuery({
    queryKey: ownerWorkspaceKeys.workspace(currentToken),
    queryFn: () => fetchOwnerWorkspace(),
    enabled: Boolean(currentToken),
  });
}

export function useUpdateOwnerAccountMutation() {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: updateOwnerAccount,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ownerWorkspaceKeys.workspace(token) });
    },
  });
}

export function useUpdateOwnerOrganizationMutation() {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: updateOwnerOrganization,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ownerWorkspaceKeys.workspace(token) });
    },
  });
}

export function useUpdateOwnerBankProfileMutation() {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: updateOwnerBankProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ownerWorkspaceKeys.workspace(token) });
    },
  });
}

export function useSubmitOwnerOnboardingMutation() {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: submitOwnerOnboarding,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ownerWorkspaceKeys.workspace(token) });
    },
  });
}
