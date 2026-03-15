'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthToken } from '@/shared/lib/auth/use-auth-token';
import {
  fetchMe,
  forgotPassword,
  login,
  logout,
  refreshToken,
  register,
  requestEmailCode,
  resetPassword,
  updateInvestorPayoutProfile,
  updateProfile,
  verifyEmailCode,
} from './service';

const authKeys = {
  all: ['auth'] as const,
  me: (token: string | null) => [...authKeys.all, 'me', token] as const,
};

export function useLoginMutation() {
  return useMutation({
    mutationFn: login,
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: register,
  });
}

export function useRequestEmailCodeMutation() {
  return useMutation({
    mutationFn: requestEmailCode,
  });
}

export function useVerifyEmailCodeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyEmailCode,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: authKeys.me(response.data.token) });
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: resetPassword,
  });
}

export function useMeQuery(token?: string | null) {
  const authToken = useAuthToken();

  return useQuery({
    queryKey: authKeys.me(token ?? authToken),
    queryFn: () => fetchMe(),
    enabled: Boolean(token ?? authToken),
    retry: false,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.me(token) });
    },
  });
}

export function useUpdateInvestorPayoutProfileMutation() {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: updateInvestorPayoutProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.me(token) });
    },
  });
}

export function useRefreshTokenMutation() {
  return useMutation({
    mutationFn: ({ deviceName }: { deviceName: string }) => refreshToken(deviceName),
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}
