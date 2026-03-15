import type { OwnerProject } from '@/entities/owner-project/api/types';

export type OwnerRound = {
  id: string;
  projectId: string;
  projectTitle: string | null;
  projectSlug: string | null;
  slug: string;
  title: string;
  status: string;
  targetAmount: number;
  currentAmount: number;
  minInvestment: number;
  targetYield: number;
  payoutFrequency: string;
  termMonths: number;
  oversubscriptionAllowed: boolean;
  opensAt: string | null;
  closesAt: string | null;
  reviewSubmittedAt: string | null;
  wentLiveAt: string | null;
  closedAt: string | null;
  notes: string | null;
  allocationCount: number;
  distributionCount: number;
};

export type OwnerAllocation = {
  id: string;
  userId: number;
  investorName: string | null;
  investorEmail: string | null;
  amount: number;
  status: string;
  agreementUrl: string | null;
  allocatedAt: string | null;
  settledAt: string | null;
  project: OwnerProject;
  round: OwnerRound;
};

export type OwnerRoundAllocation = OwnerAllocation;

export type OwnerPayoutInstruction = {
  id: string;
  distributionId: string | null;
  distributionTitle: string | null;
  amount: number;
  currency: string;
  direction: string;
  gateway: string;
  status: string;
  externalId: string | null;
  referenceLabel: string | null;
  failureReason: string | null;
  processedAt: string | null;
};

export type OwnerDistributionLine = {
  id: string;
  amount: number;
  status: string;
  failureReason: string | null;
  paidAt: string | null;
  allocation: OwnerAllocation;
  payoutInstruction: OwnerPayoutInstruction | null;
};

export type OwnerDistribution = {
  id: string;
  title: string;
  periodLabel: string;
  periodStart: string | null;
  periodEnd: string | null;
  totalAmount: number;
  linesCount: number;
  status: string;
  payoutMode: string;
  approvedAt: string | null;
  processedAt: string | null;
  paidAt: string | null;
  notes: string | null;
  round: OwnerRound;
  lines: OwnerDistributionLine[];
};

export type OwnerRoundDetailsResponse = {
  data: {
    round: OwnerRound;
    project: OwnerProject;
    allocations: OwnerAllocation[];
    distributions: OwnerDistribution[];
    metrics: {
      allocationCount: number;
      confirmedAmount: number;
      distributedAmount: number;
    };
  };
};

export type OwnerRoundsResponse = {
  data: OwnerRound[];
};

export type OwnerRoundResponse = {
  data: OwnerRound;
};

export type OwnerDistributionResponse = {
  data: OwnerDistribution;
};

export type OwnerPayoutsResponse = {
  data: OwnerPayoutInstruction[];
};
