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
