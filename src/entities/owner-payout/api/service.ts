import { fetchJson } from '@/shared/api/http/client';
import type { OwnerPayoutInstruction } from './types';

export async function fetchOwnerPayouts() {
  return fetchJson<{ data: OwnerPayoutInstruction[] }>('/api/v1/owner/payouts', {
    requireAuth: true,
  });
}
