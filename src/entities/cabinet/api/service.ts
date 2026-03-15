import { createIdempotencyKey, fetchJson } from '@/shared/api/http/client';
import type {
  CabinetDocumentsResponse,
  DashboardResponse,
  InvestmentAgreementResponse,
  InvestmentApplication,
  KycDocument,
  KycProfile,
  ManualDepositRequest,
  PaymentTransaction,
  WalletTransaction,
  WithdrawalRequest,
  CabinetNotification,
} from './types';

export async function fetchDashboard() {
  return fetchJson<DashboardResponse>('/api/v1/dashboard', {
    requireAuth: true,
  });
}

export async function fetchInvestments() {
  return fetchJson<{ data: InvestmentApplication[] }>('/api/v1/cabinet/investments', {
    requireAuth: true,
  });
}

export async function fetchInvestment(id: string) {
  return fetchJson<{ data: InvestmentApplication }>(`/api/v1/cabinet/investments/${id}`, {
    requireAuth: true,
  });
}

export async function createInvestmentApplication(
  payload: {
    project_id: string;
    amount: number;
    notes?: string;
  },
) {
  return fetchJson<{ data: InvestmentApplication }>('/api/v1/investment-applications', {
    method: 'POST',
    requireAuth: true,
    body: JSON.stringify(payload),
  });
}

export async function fetchInvestmentAgreement(id: string) {
  return fetchJson<InvestmentAgreementResponse>(`/api/v1/investments/${id}/agreement`, {
    requireAuth: true,
  });
}

export async function confirmInvestment(id: string) {
  return fetchJson<{ data: InvestmentApplication }>(`/api/v1/investments/${id}/confirm`, {
    method: 'POST',
    requireAuth: true,
  });
}

export async function fetchKycProfile() {
  return fetchJson<{ data: KycProfile | null }>('/api/v1/me/kyc', {
    requireAuth: true,
  });
}

export async function upsertKycProfile(
  payload: {
    legal_name: string;
    birth_date?: string;
    tax_id?: string;
    document_number?: string;
    address?: string;
    notes?: string;
  },
) {
  return fetchJson<{ data: KycProfile }>('/api/v1/me/kyc', {
    method: 'POST',
    requireAuth: true,
    body: JSON.stringify(payload),
  });
}

export async function fetchKycDocuments() {
  return fetchJson<{ data: KycDocument[] }>('/api/v1/me/kyc/documents', {
    requireAuth: true,
  });
}

export async function uploadKycDocument(
  payload: {
    kind: string;
    file: File;
  },
) {
  const formData = new FormData();
  formData.set('kind', payload.kind);
  formData.set('file', payload.file);

  return fetchJson<{ data: KycDocument }>('/api/v1/me/kyc/documents', {
    method: 'POST',
    requireAuth: true,
    body: formData,
  });
}

export async function fetchCabinetDocuments() {
  return fetchJson<CabinetDocumentsResponse>('/api/v1/cabinet/documents', {
    requireAuth: true,
  });
}

export async function fetchNotifications() {
  return fetchJson<{ data: CabinetNotification[] }>('/api/v1/cabinet/notifications', {
    requireAuth: true,
  });
}

export async function markNotificationAsRead(id: string) {
  return fetchJson<{ data: CabinetNotification }>(`/api/v1/cabinet/notifications/${id}/read`, {
    method: 'PATCH',
    requireAuth: true,
  });
}

export async function fetchPaymentTransactions() {
  return fetchJson<{ data: PaymentTransaction[] }>('/api/v1/payment-transactions', {
    requireAuth: true,
  });
}

export async function createDeposit(amount: number) {
  return fetchJson<{ data: PaymentTransaction }>('/api/v1/deposits', {
    method: 'POST',
    requireAuth: true,
    idempotencyKey: createIdempotencyKey(),
    body: JSON.stringify({ amount }),
  });
}

export async function fetchWalletTransactions() {
  return fetchJson<{ data: WalletTransaction[] }>('/api/v1/cabinet/transactions', {
    requireAuth: true,
  });
}

export async function fetchWithdrawals() {
  return fetchJson<{ data: WithdrawalRequest[] }>('/api/v1/wallet/withdrawals', {
    requireAuth: true,
  });
}

export async function createWithdrawal(
  payload: {
    amount: number;
    bank_name: string;
    bank_account: string;
    comment?: string;
  },
) {
  return fetchJson<{ data: WithdrawalRequest }>('/api/v1/wallet/withdrawals', {
    method: 'POST',
    requireAuth: true,
    idempotencyKey: createIdempotencyKey(),
    body: JSON.stringify(payload),
  });
}

export async function cancelWithdrawal(id: string) {
  return fetchJson<{ data: WithdrawalRequest }>(`/api/v1/wallet/withdrawals/${id}/cancel`, {
    method: 'POST',
    requireAuth: true,
  });
}

export async function fetchManualDepositRequests() {
  return fetchJson<{ data: ManualDepositRequest[] }>('/api/v1/wallet/manual-deposits', {
    requireAuth: true,
  });
}

export async function createManualDeposit(
  payload: {
    amount: number;
    payer_name: string;
    payer_bank?: string;
    payer_account_last4?: string;
    comment?: string;
  },
) {
  return fetchJson<{ data: ManualDepositRequest }>('/api/v1/wallet/manual-deposits', {
    method: 'POST',
    requireAuth: true,
    idempotencyKey: createIdempotencyKey(),
    body: JSON.stringify(payload),
  });
}

export async function uploadManualDepositReceipt(
  payload: {
    id: string;
    file: File;
  },
) {
  const formData = new FormData();
  formData.set('file', payload.file);

  return fetchJson<{ data: ManualDepositRequest }>(`/api/v1/wallet/manual-deposits/${payload.id}/receipt`, {
    method: 'POST',
    requireAuth: true,
    body: formData,
  });
}

export async function cancelManualDeposit(id: string) {
  return fetchJson<{ data: ManualDepositRequest }>(`/api/v1/wallet/manual-deposits/${id}/cancel`, {
    method: 'POST',
    requireAuth: true,
  });
}
