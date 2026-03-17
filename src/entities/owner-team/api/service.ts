import { fetchJson } from '@/shared/api/http/client';
import type { OwnerTeamResponse } from './types';

export async function fetchOwnerTeam() {
  return fetchJson<OwnerTeamResponse>('/api/v1/owner/team', {
    requireAuth: true,
  });
}
