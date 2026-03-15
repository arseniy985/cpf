'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthToken } from '@/shared/lib/auth/use-auth-token';
import { ownerKeys } from '@/entities/owner-project/api/hooks';
import { ownerPayoutKeys } from '@/entities/owner-payout/api/hooks';
import {
  approveOwnerDistribution,
  closeOwnerRound,
  createOwnerDistribution,
  createOwnerRound,
  fetchOwnerPayouts,
  fetchOwnerRound,
  fetchOwnerRounds,
  goLiveOwnerRound,
  runOwnerDistributionPayouts,
  submitOwnerRoundForReview,
  updateOwnerRound,
} from './service';

export const ownerRoundKeys = {
  all: ['owner-rounds'] as const,
  list: (token: string | null) => [...ownerRoundKeys.all, 'list', token] as const,
  detail: (token: string | null, slug: string) => [...ownerRoundKeys.all, 'detail', token, slug] as const,
  payouts: (token: string | null) => [...ownerRoundKeys.all, 'payouts', token] as const,
};

export function useOwnerRoundsQuery(token?: string | null) {
  const authToken = useAuthToken();
  const currentToken = token ?? authToken;

  return useQuery({
    queryKey: ownerRoundKeys.list(currentToken),
    queryFn: () => fetchOwnerRounds(),
    enabled: Boolean(currentToken),
  });
}

export function useOwnerRoundQuery(token: string | null | undefined, slug: string | null) {
  const authToken = useAuthToken();
  const currentToken = token ?? authToken;

  return useQuery({
    queryKey: ownerRoundKeys.detail(currentToken, slug ?? ''),
    queryFn: () => fetchOwnerRound(slug ?? ''),
    enabled: Boolean(currentToken && slug),
  });
}

export function useOwnerPayoutsQuery(token?: string | null) {
  const authToken = useAuthToken();
  const currentToken = token ?? authToken;

  return useQuery({
    queryKey: ownerRoundKeys.payouts(currentToken),
    queryFn: () => fetchOwnerPayouts(),
    enabled: Boolean(currentToken),
  });
}

export function useCreateOwnerRoundMutation() {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: createOwnerRound,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ownerRoundKeys.list(token) }),
        queryClient.invalidateQueries({ queryKey: ownerKeys.projects(token) }),
      ]);
    },
  });
}

export function useUpdateOwnerRoundMutation() {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: ({
      slug,
      payload,
    }: {
      slug: string;
      payload: Parameters<typeof updateOwnerRound>[1];
    }) => updateOwnerRound(slug, payload),
    onSuccess: async (_response, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ownerRoundKeys.list(token) }),
        queryClient.invalidateQueries({ queryKey: ownerRoundKeys.detail(token, variables.slug) }),
      ]);
    },
  });
}

function createRoundStateMutation(
  mutate: (slug: string) => Promise<unknown>,
) {
  return function useRoundStateMutation() {
    const queryClient = useQueryClient();
    const token = useAuthToken();

    return useMutation({
      mutationFn: ({ slug }: { slug: string }) => mutate(slug),
      onSuccess: async (_response, variables) => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ownerRoundKeys.list(token) }),
          queryClient.invalidateQueries({ queryKey: ownerRoundKeys.detail(token, variables.slug) }),
        ]);
      },
    });
  };
}

export const useSubmitOwnerRoundForReviewMutation = createRoundStateMutation(submitOwnerRoundForReview);
export const useGoLiveOwnerRoundMutation = createRoundStateMutation(goLiveOwnerRound);
export const useCloseOwnerRoundMutation = createRoundStateMutation(closeOwnerRound);

export function useCreateOwnerDistributionMutation() {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: ({
      roundSlug,
      payload,
    }: {
      roundSlug: string;
      payload: Parameters<typeof createOwnerDistribution>[1];
    }) => createOwnerDistribution(roundSlug, payload),
    onSuccess: async (_response, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ownerRoundKeys.detail(token, variables.roundSlug) }),
        queryClient.invalidateQueries({ queryKey: ownerPayoutKeys.list(token) }),
      ]);
    },
  });
}

function createDistributionMutation(
  mutate: (distributionId: string) => Promise<unknown>,
) {
  return function useDistributionMutation() {
    const queryClient = useQueryClient();
    const token = useAuthToken();

    return useMutation({
      mutationFn: ({
        distributionId,
        roundSlug,
      }: {
        distributionId: string;
        roundSlug: string;
      }) => mutate(distributionId),
      onSuccess: async (_response, variables) => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ownerRoundKeys.detail(token, variables.roundSlug) }),
          queryClient.invalidateQueries({ queryKey: ownerPayoutKeys.list(token) }),
        ]);
      },
    });
  };
}

export const useApproveOwnerDistributionMutation = createDistributionMutation(approveOwnerDistribution);
export const useRunOwnerDistributionPayoutsMutation = createDistributionMutation(runOwnerDistributionPayouts);
