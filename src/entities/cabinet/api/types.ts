import type { PublicProjectDocument } from '@/entities/project';
import type { PublicProject } from '@/entities/project/model/public-project';
import type { AuthUser } from '@/entities/viewer/api/types';
import type { LegalDocument } from '@/entities/content/api/types';

export type KycProfile = {
  id: string;
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | string;
  legalName: string;
  birthDate: string | null;
  taxId: string | null;
  documentNumber: string | null;
  address: string | null;
  notes: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
};

export type KycDocument = {
  id: string;
  kind: 'passport' | 'tax_id' | 'address_proof' | 'company_docs' | 'other' | string;
  status: 'pending_review' | 'approved' | 'rejected' | string;
  originalName: string;
  downloadUrl: string;
  reviewComment: string | null;
  createdAt: string;
};

export type InvestmentApplication = {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'confirmed' | string;
  notes: string | null;
  project: PublicProject;
  createdAt: string;
};

export type PaymentTransaction = {
  id: string;
  gateway: string;
  type: string;
  status: 'pending' | 'waiting_for_capture' | 'succeeded' | 'paid' | 'canceled' | string;
  amount: number;
  currency: string;
  externalId: string | null;
  confirmationUrl: string | null;
};

export type WalletTransaction = {
  id: string;
  type: string;
  direction: 'credit' | 'debit' | string;
  status: 'pending' | 'posted' | 'voided' | string;
  amount: number;
  currency: string;
  description: string | null;
  occurredAt: string;
};

export type WithdrawalRequest = {
  id: string;
  amount: number;
  status: 'pending_review' | 'approved' | 'processing_manual_payout' | 'paid' | 'rejected' | 'failed' | 'cancelled' | string;
  bankName: string;
  bankAccount: string;
  comment: string | null;
  reviewNote: string | null;
  createdAt: string;
  reviewedAt: string | null;
  paidAt: string | null;
  cancelledAt: string | null;
};

export type CabinetNotification = {
  id: string;
  type: string;
  title: string;
  body: string;
  actionUrl: string | null;
  isRead: boolean;
  createdAt: string;
};

export type DashboardSummary = {
  applicationsCount: number;
  portfolioAmount: number;
  approvedAmount: number;
  pendingAmount: number;
  walletBalance: number;
  pendingWithdrawals: number;
  unreadNotifications: number;
  kycStatus: string | null;
};

export type DashboardResponse = {
  data: {
    user: AuthUser;
    summary: DashboardSummary;
    applications: InvestmentApplication[];
    transactions: PaymentTransaction[];
    walletTransactions: WalletTransaction[];
    withdrawals: WithdrawalRequest[];
  };
};

export type CabinetDocumentsResponse = {
  data: {
    projectDocuments: PublicProjectDocument[];
    legalDocuments: LegalDocument[];
  };
};

export type InvestmentAgreementResponse = {
  data: {
    investmentId: string;
    agreementUrl: string;
  };
};
