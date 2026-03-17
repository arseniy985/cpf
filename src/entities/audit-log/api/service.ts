import { fetchJson } from '@/shared/api/http/client';
import type { AuditLogResponse } from './types';

export async function fetchOwnerOrganizationHistory() {
  return fetchJson<AuditLogResponse>('/api/v1/owner/organization/history', {
    requireAuth: true,
  });
}

export async function fetchOwnerProjectHistory(slug: string) {
  return fetchJson<AuditLogResponse>(`/api/v1/owner/projects/${slug}/history`, {
    requireAuth: true,
  });
}

export async function fetchOwnerRoundHistory(slug: string) {
  return fetchJson<AuditLogResponse>(`/api/v1/owner/rounds/${slug}/history`, {
    requireAuth: true,
  });
}
