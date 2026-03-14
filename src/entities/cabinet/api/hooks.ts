'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthToken } from '@/shared/lib/auth/use-auth-token';
import {
  cancelWithdrawal,
  confirmInvestment,
  createDeposit,
  createInvestmentApplication,
  createWithdrawal,
  fetchCabinetDocuments,
  fetchDashboard,
  fetchInvestmentAgreement,
  fetchInvestments,
  fetchKycDocuments,
  fetchKycProfile,
  fetchNotifications,
  fetchPaymentTransactions,
  fetchWalletTransactions,
  fetchWithdrawals,
  markNotificationAsRead,
  upsertKycProfile,
  uploadKycDocument,
} from './service';

export const cabinetKeys = {
  all: ['cabinet'] as const,
  dashboard: (token: string | null) => [...cabinetKeys.all, 'dashboard', token] as const,
  investments: (token: string | null) => [...cabinetKeys.all, 'investments', token] as const,
  kycProfile: (token: string | null) => [...cabinetKeys.all, 'kyc-profile', token] as const,
  kycDocuments: (token: string | null) => [...cabinetKeys.all, 'kyc-documents', token] as const,
  documents: (token: string | null) => [...cabinetKeys.all, 'documents', token] as const,
  notifications: (token: string | null) => [...cabinetKeys.all, 'notifications', token] as const,
  paymentTransactions: (token: string | null) => [...cabinetKeys.all, 'payment-transactions', token] as const,
  walletTransactions: (token: string | null) => [...cabinetKeys.all, 'wallet-transactions', token] as const,
  withdrawals: (token: string | null) => [...cabinetKeys.all, 'withdrawals', token] as const,
};

export function useDashboardQuery(token?: string | null) {
  const authToken = useAuthToken();
  const currentToken = token ?? authToken;

  return useQuery({
    queryKey: cabinetKeys.dashboard(currentToken),
    queryFn: () => fetchDashboard(),
    enabled: Boolean(currentToken),
    retry: false,
  });
}

export function useInvestmentsQuery(token?: string | null) {
  const authToken = useAuthToken();
  const currentToken = token ?? authToken;

  return useQuery({
    queryKey: cabinetKeys.investments(currentToken),
    queryFn: () => fetchInvestments(),
    enabled: Boolean(currentToken),
  });
}

export function useKycProfileQuery(token?: string | null) {
  const authToken = useAuthToken();
  const currentToken = token ?? authToken;

  return useQuery({
    queryKey: cabinetKeys.kycProfile(currentToken),
    queryFn: () => fetchKycProfile(),
    enabled: Boolean(currentToken),
  });
}

export function useKycDocumentsQuery(token?: string | null) {
  const authToken = useAuthToken();
  const currentToken = token ?? authToken;

  return useQuery({
    queryKey: cabinetKeys.kycDocuments(currentToken),
    queryFn: () => fetchKycDocuments(),
    enabled: Boolean(currentToken),
  });
}

export function useCabinetDocumentsQuery(token?: string | null) {
  const authToken = useAuthToken();
  const currentToken = token ?? authToken;

  return useQuery({
    queryKey: cabinetKeys.documents(currentToken),
    queryFn: () => fetchCabinetDocuments(),
    enabled: Boolean(currentToken),
  });
}

export function useNotificationsQuery(token?: string | null) {
  const authToken = useAuthToken();
  const currentToken = token ?? authToken;

  return useQuery({
    queryKey: cabinetKeys.notifications(currentToken),
    queryFn: () => fetchNotifications(),
    enabled: Boolean(currentToken),
  });
}

export function usePaymentTransactionsQuery(token?: string | null) {
  const authToken = useAuthToken();
  const currentToken = token ?? authToken;

  return useQuery({
    queryKey: cabinetKeys.paymentTransactions(currentToken),
    queryFn: () => fetchPaymentTransactions(),
    enabled: Boolean(currentToken),
  });
}

export function useWalletTransactionsQuery(token?: string | null) {
  const authToken = useAuthToken();
  const currentToken = token ?? authToken;

  return useQuery({
    queryKey: cabinetKeys.walletTransactions(currentToken),
    queryFn: () => fetchWalletTransactions(),
    enabled: Boolean(currentToken),
  });
}

export function useWithdrawalsQuery(token?: string | null) {
  const authToken = useAuthToken();
  const currentToken = token ?? authToken;

  return useQuery({
    queryKey: cabinetKeys.withdrawals(currentToken),
    queryFn: () => fetchWithdrawals(),
    enabled: Boolean(currentToken),
  });
}

export function useCreateInvestmentApplicationMutation() {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: ({
      projectId,
      amount,
      notes,
    }: {
      projectId: string;
      amount: number;
      notes?: string;
    }) =>
      createInvestmentApplication({
        project_id: projectId,
        amount,
        notes,
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: cabinetKeys.dashboard(token) }),
        queryClient.invalidateQueries({ queryKey: cabinetKeys.investments(token) }),
      ]);
    },
  });
}

export function useConfirmInvestmentMutation() {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => confirmInvestment(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: cabinetKeys.dashboard(token) }),
        queryClient.invalidateQueries({ queryKey: cabinetKeys.investments(token) }),
        queryClient.invalidateQueries({ queryKey: cabinetKeys.walletTransactions(token) }),
      ]);
    },
  });
}

export function useInvestmentAgreementMutation() {
  return useMutation({
    mutationFn: ({ id }: { id: string }) => fetchInvestmentAgreement(id),
  });
}

export function useUpsertKycProfileMutation() {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: upsertKycProfile,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: cabinetKeys.dashboard(token) }),
        queryClient.invalidateQueries({ queryKey: cabinetKeys.kycProfile(token) }),
      ]);
    },
  });
}

export function useUploadKycDocumentMutation() {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: ({ kind, file }: { kind: string; file: File }) =>
      uploadKycDocument({ kind, file }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: cabinetKeys.dashboard(token) }),
        queryClient.invalidateQueries({ queryKey: cabinetKeys.kycDocuments(token) }),
        queryClient.invalidateQueries({ queryKey: cabinetKeys.kycProfile(token) }),
      ]);
    },
  });
}

export function useMarkNotificationAsReadMutation() {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => markNotificationAsRead(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: cabinetKeys.dashboard(token) }),
        queryClient.invalidateQueries({ queryKey: cabinetKeys.notifications(token) }),
      ]);
    },
  });
}

export function useCreateDepositMutation() {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: ({ amount }: { amount: number }) => createDeposit(amount),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: cabinetKeys.dashboard(token) }),
        queryClient.invalidateQueries({ queryKey: cabinetKeys.paymentTransactions(token) }),
      ]);
    },
  });
}

export function useCreateWithdrawalMutation() {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: ({
      amount,
      bank_name,
      bank_account,
      comment,
    }: {
      amount: number;
      bank_name: string;
      bank_account: string;
      comment?: string;
    }) =>
      createWithdrawal({
        amount,
        bank_name,
        bank_account,
        comment,
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: cabinetKeys.dashboard(token) }),
        queryClient.invalidateQueries({ queryKey: cabinetKeys.withdrawals(token) }),
        queryClient.invalidateQueries({ queryKey: cabinetKeys.walletTransactions(token) }),
      ]);
    },
  });
}

export function useCancelWithdrawalMutation() {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => cancelWithdrawal(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: cabinetKeys.dashboard(token) }),
        queryClient.invalidateQueries({ queryKey: cabinetKeys.withdrawals(token) }),
        queryClient.invalidateQueries({ queryKey: cabinetKeys.walletTransactions(token) }),
      ]);
    },
  });
}
