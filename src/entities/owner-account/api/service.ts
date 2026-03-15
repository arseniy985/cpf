import { fetchJson } from '@/shared/api/http/client';
import type {
  OwnerAccount,
  OwnerBankProfile,
  OwnerOrganization,
  OwnerWorkspaceResponse,
} from './types';

export async function fetchOwnerWorkspace() {
  return fetchJson<OwnerWorkspaceResponse>('/api/v1/owner/workspace', {
    requireAuth: true,
  });
}

export async function updateOwnerAccount(payload: {
  display_name: string;
  slug: string;
  overview?: string;
  website_url?: string;
}) {
  return fetchJson<{ data: OwnerAccount }>('/api/v1/owner/account', {
    method: 'PATCH',
    requireAuth: true,
    body: JSON.stringify(payload),
  });
}

export async function updateOwnerOrganization(payload: {
  legal_name: string;
  brand_name?: string;
  entity_type: string;
  registration_number: string;
  tax_id: string;
  website_url?: string;
  address: string;
  signatory_name: string;
  signatory_role?: string;
  beneficiary_name?: string;
  overview?: string;
}) {
  return fetchJson<{ data: OwnerOrganization }>('/api/v1/owner/organization', {
    method: 'PATCH',
    requireAuth: true,
    body: JSON.stringify(payload),
  });
}

export async function updateOwnerBankProfile(payload: {
  payout_method: string;
  recipient_name: string;
  bank_name: string;
  bank_bik: string;
  bank_account: string;
  correspondent_account: string;
  notes?: string;
}) {
  return fetchJson<{ data: OwnerBankProfile }>('/api/v1/owner/bank-profile', {
    method: 'PATCH',
    requireAuth: true,
    body: JSON.stringify(payload),
  });
}

export async function submitOwnerOnboarding() {
  return fetchJson<OwnerWorkspaceResponse>('/api/v1/owner/onboarding/submit', {
    method: 'POST',
    requireAuth: true,
  });
}
