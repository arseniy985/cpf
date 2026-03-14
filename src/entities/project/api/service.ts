import { fetchJson } from '@/shared/api/http/client';
import type { ApiProjectResponse, ApiProjectsResponse, ProjectFaqItem, ProjectForecast } from './types';
import {
  mapApiProjectToPublicProject,
  type PublicProject,
} from '@/entities/project/model/public-project';
import { getFallbackProjectBySlug, getFallbackProjects } from '@/entities/project/model/projects';

function mapProjects(raw: ApiProjectsResponse): PublicProject[] {
  return raw.data.map(mapApiProjectToPublicProject);
}

export async function fetchProjects(search: string, filter: string) {
  try {
    const query = new URLSearchParams();

    if (search.trim()) {
      query.set('filter[title]', search.trim());
    }

    if (filter !== 'Все') {
      query.set('filter[asset_type]', filter);
    }

    const suffix = query.size > 0 ? `?${query.toString()}` : '';
    const response = await fetchJson<ApiProjectsResponse>(`/api/v1/projects${suffix}`);

    return mapProjects(response);
  } catch {
    return getFallbackProjects({ search, filter });
  }
}

export async function fetchProjectBySlug(slug: string) {
  try {
    const response = await fetchJson<ApiProjectResponse>(`/api/v1/projects/${slug}`);

    return mapApiProjectToPublicProject(response.data);
  } catch {
    return getFallbackProjectBySlug(slug);
  }
}

export async function fetchProjectFaq(slug: string) {
  const response = await fetchJson<{ data: ProjectFaqItem[] }>(`/api/v1/projects/${slug}/faq`);

  return response.data;
}

export async function fetchProjectForecast(slug: string, amount?: number, termMonths?: number) {
  const query = new URLSearchParams();

  if (typeof amount === 'number' && Number.isFinite(amount)) {
    query.set('amount', String(amount));
  }

  if (typeof termMonths === 'number' && Number.isFinite(termMonths)) {
    query.set('term_months', String(termMonths));
  }

  const suffix = query.size > 0 ? `?${query.toString()}` : '';
  const response = await fetchJson<{ data: ProjectForecast }>(`/api/v1/projects/${slug}/payout-forecast${suffix}`);

  return response.data;
}

export async function estimateProject(payload: {
  project_id: string;
  amount: number;
  term_months?: number;
}) {
  const response = await fetchJson<{ data: ProjectForecast }>('/api/v1/calculator/estimate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return response.data;
}
