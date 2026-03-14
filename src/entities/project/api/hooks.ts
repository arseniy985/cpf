'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import {
  estimateProject,
  fetchProjectBySlug,
  fetchProjectFaq,
  fetchProjectForecast,
  fetchProjects,
} from './service';
import { projectKeys } from './keys';

export function useProjectsQuery(search: string, filter: string) {
  return useQuery({
    queryKey: projectKeys.list(search, filter),
    queryFn: () => fetchProjects(search, filter),
  });
}

export function useProjectQuery(slug: string) {
  return useQuery({
    queryKey: projectKeys.detail(slug),
    queryFn: () => fetchProjectBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useProjectFaqQuery(slug: string) {
  return useQuery({
    queryKey: [...projectKeys.detail(slug), 'faq'],
    queryFn: () => fetchProjectFaq(slug),
    enabled: Boolean(slug),
  });
}

export function useProjectForecastQuery(slug: string, amount?: number, termMonths?: number) {
  return useQuery({
    queryKey: [...projectKeys.detail(slug), 'forecast', amount ?? null, termMonths ?? null],
    queryFn: () => fetchProjectForecast(slug, amount, termMonths),
    enabled: Boolean(slug),
  });
}

export function useProjectEstimateMutation() {
  return useMutation({
    mutationFn: estimateProject,
  });
}
