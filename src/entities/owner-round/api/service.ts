import { fetchJson } from '@/shared/api/http/client';
import type {
  OwnerDistributionResponse,
  OwnerPayoutsResponse,
  OwnerRoundDetailsResponse,
  OwnerRoundResponse,
  OwnerRoundsResponse,
} from './types';

export async function fetchOwnerRounds() {
  return fetchJson<OwnerRoundsResponse>('/api/v1/owner/rounds', {
    requireAuth: true,
  });
}

export async function fetchOwnerRound(slug: string) {
  return fetchJson<OwnerRoundDetailsResponse>(`/api/v1/owner/rounds/${slug}`, {
    requireAuth: true,
  });
}

export async function createOwnerRound(payload: {
  project_id: string;
  slug: string;
  title: string;
  target_amount: number;
  min_investment: number;
  target_yield: number;
  payout_frequency: string;
  term_months: number;
  oversubscription_allowed: boolean;
  opens_at?: string;
  closes_at?: string;
  notes?: string;
}) {
  return fetchJson<OwnerRoundResponse>('/api/v1/owner/rounds', {
    method: 'POST',
    requireAuth: true,
    body: JSON.stringify(payload),
  });
}

export async function updateOwnerRound(
  slug: string,
  payload: Partial<{
    slug: string;
    title: string;
    target_amount: number;
    min_investment: number;
    target_yield: number;
    payout_frequency: string;
    term_months: number;
    oversubscription_allowed: boolean;
    opens_at?: string;
    closes_at?: string;
    notes?: string;
  }>,
) {
  return fetchJson<OwnerRoundResponse>(`/api/v1/owner/rounds/${slug}`, {
    method: 'PATCH',
    requireAuth: true,
    body: JSON.stringify(payload),
  });
}

export async function submitOwnerRoundForReview(slug: string) {
  return fetchJson<OwnerRoundResponse>(`/api/v1/owner/rounds/${slug}/submit-review`, {
    method: 'POST',
    requireAuth: true,
  });
}

export async function goLiveOwnerRound(slug: string) {
  return fetchJson<OwnerRoundResponse>(`/api/v1/owner/rounds/${slug}/go-live`, {
    method: 'POST',
    requireAuth: true,
  });
}

export async function closeOwnerRound(slug: string) {
  return fetchJson<OwnerRoundResponse>(`/api/v1/owner/rounds/${slug}/close`, {
    method: 'POST',
    requireAuth: true,
  });
}

export async function createOwnerDistribution(
  roundSlug: string,
  payload: {
    title: string;
    period_label: string;
    period_start?: string;
    period_end?: string;
    total_amount: number;
    payout_mode: string;
    notes?: string;
  },
) {
  return fetchJson<OwnerDistributionResponse>(`/api/v1/owner/rounds/${roundSlug}/distributions`, {
    method: 'POST',
    requireAuth: true,
    body: JSON.stringify(payload),
  });
}

export async function approveOwnerDistribution(distributionId: string) {
  return fetchJson<OwnerDistributionResponse>(`/api/v1/owner/distributions/${distributionId}/approve`, {
    method: 'POST',
    requireAuth: true,
  });
}

export async function runOwnerDistributionPayouts(distributionId: string) {
  return fetchJson<OwnerDistributionResponse>(`/api/v1/owner/distributions/${distributionId}/run-payouts`, {
    method: 'POST',
    requireAuth: true,
  });
}

export async function fetchOwnerPayouts() {
  return fetchJson<OwnerPayoutsResponse>('/api/v1/owner/payouts', {
    requireAuth: true,
  });
}
