import { fetchJson } from '@/shared/api/http/client';
import type {
  OwnerProject,
  OwnerProjectDetailsResponse,
  OwnerProjectDocument,
  OwnerProjectInvestments,
  ProjectReport,
} from './types';

export async function fetchOwnerProjects() {
  return fetchJson<{ data: OwnerProject[] }>('/api/v1/owner/projects', {
    requireAuth: true,
  });
}

export async function fetchOwnerProject(slug: string) {
  return fetchJson<OwnerProjectDetailsResponse>(`/api/v1/owner/projects/${slug}`, {
    requireAuth: true,
  });
}

export async function createOwnerProject(
  payload: {
    slug: string;
    title: string;
    excerpt: string;
    description: string;
    thesis?: string;
    risk_summary?: string;
    location: string;
    asset_type: string;
    risk_level: string;
    payout_frequency: string;
    min_investment: number;
    target_amount: number;
    target_yield: number;
    term_months: number;
    cover_image_url?: string;
  },
) {
  return fetchJson<{ data: OwnerProject }>('/api/v1/owner/projects', {
    method: 'POST',
    requireAuth: true,
    body: JSON.stringify(payload),
  });
}

export async function updateOwnerProject(
  slug: string,
  payload: Partial<{
    slug: string;
    title: string;
    excerpt: string;
    description: string;
    thesis: string;
    risk_summary: string;
    location: string;
    asset_type: string;
    risk_level: string;
    payout_frequency: string;
    min_investment: number;
    target_amount: number;
    target_yield: number;
    term_months: number;
    cover_image_url: string;
    hero_metric: string;
  }>,
) {
  return fetchJson<{ data: OwnerProject }>(`/api/v1/owner/projects/${slug}`, {
    method: 'PATCH',
    requireAuth: true,
    body: JSON.stringify(payload),
  });
}

export async function submitOwnerProjectForReview(slug: string) {
  return fetchJson<{ data: OwnerProject }>(`/api/v1/owner/projects/${slug}/submit-review`, {
    method: 'POST',
    requireAuth: true,
  });
}

export async function fetchOwnerProjectInvestments(slug: string) {
  return fetchJson<OwnerProjectInvestments>(`/api/v1/owner/projects/${slug}/investments`, {
    requireAuth: true,
  });
}

export async function fetchOwnerProjectDocuments(slug: string) {
  return fetchJson<{ data: OwnerProjectDocument[] }>(`/api/v1/owner/projects/${slug}/documents`, {
    requireAuth: true,
  });
}

export async function createOwnerProjectDocument(
  slug: string,
  payload: {
    title: string;
    kind: string;
    label?: string;
    file_url?: string;
    is_public?: boolean;
    sort_order?: number;
  },
) {
  return fetchJson<{ data: OwnerProjectDocument }>(`/api/v1/owner/projects/${slug}/documents`, {
    method: 'POST',
    requireAuth: true,
    body: JSON.stringify(payload),
  });
}

export async function fetchOwnerProjectReports(slug: string) {
  return fetchJson<{ data: ProjectReport[] }>(`/api/v1/owner/projects/${slug}/reports`, {
    requireAuth: true,
  });
}

export async function createOwnerProjectReport(
  slug: string,
  payload: {
    title: string;
    summary?: string;
    file_url?: string;
    report_date: string;
    is_public?: boolean;
  },
) {
  return fetchJson<{ data: ProjectReport }>(`/api/v1/owner/projects/${slug}/reports`, {
    method: 'POST',
    requireAuth: true,
    body: JSON.stringify(payload),
  });
}
