import type { AuditLogEntry } from '@/entities/audit-log/api/types';
import type { LegalDocument } from '@/entities/content/api/types';

export type OwnerTeamMember = {
  id: string;
  role: string;
  status: string;
  userId: string | null;
  name: string;
  email: string;
  lastLoginAt: string | null;
  joinedAt: string | null;
};

export type OwnerTeam = {
  accountId: string;
  accountSlug: string;
  accountName: string;
  members: OwnerTeamMember[];
  legalDocuments: LegalDocument[];
  activity: AuditLogEntry[];
};

export type OwnerTeamResponse = {
  data: OwnerTeam;
};
