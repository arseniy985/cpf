import type { OwnerProject } from '@/entities/owner-project/api/types';

export type OwnerAccountSummary = {
  id: string;
  slug: string;
  displayName: string;
  status: string;
};

export type OwnerAccount = {
  id: string;
  slug: string;
  displayName: string;
  status: string;
  overview: string | null;
  websiteUrl: string | null;
};

export type OwnerOrganization = {
  id: string;
  legalName: string | null;
  brandName: string | null;
  entityType: string | null;
  registrationNumber: string | null;
  taxId: string | null;
  websiteUrl: string | null;
  address: string | null;
  signatoryName: string | null;
  signatoryRole: string | null;
  beneficiaryName: string | null;
  overview: string | null;
};

export type OwnerBankProfile = {
  id: string;
  payoutMethod: string;
  status: string;
  recipientName: string | null;
  bankName: string | null;
  bankBik: string | null;
  bankAccount: string | null;
  correspondentAccount: string | null;
  maskedBankAccount: string | null;
  notes: string | null;
};

export type OwnerChecklistItem = {
  key: string;
  title: string;
  description: string;
  completed: boolean;
  href: string;
};

export type OwnerActionItem = {
  key: string;
  title: string;
  description: string;
  href: string;
  tone: string;
};

export type OwnerOnboarding = {
  status: string;
  progressPercent: number;
  checklist: OwnerChecklistItem[];
  canSubmitForReview: boolean;
  submittedAt: string | null;
  reviewedAt: string | null;
  activatedAt: string | null;
  rejectionReason: string | null;
};

export type OwnerWorkspace = {
  account: OwnerAccount;
  organization: OwnerOrganization;
  bankProfile: OwnerBankProfile;
  onboarding: OwnerOnboarding;
  actionItems: OwnerActionItem[];
  summary: {
    projectsCount: number;
    reviewQueueCount: number;
    publishedCount: number;
    totalTargetAmount: number;
    totalRaisedAmount: number;
  };
  latestProjects: OwnerProject[];
};

export type OwnerWorkspaceResponse = {
  data: OwnerWorkspace;
};
