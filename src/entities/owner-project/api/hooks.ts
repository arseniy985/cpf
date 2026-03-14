'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthToken } from '@/shared/lib/auth/use-auth-token';
import {
  createOwnerProject,
  createOwnerProjectDocument,
  createOwnerProjectReport,
  fetchOwnerProject,
  fetchOwnerProjectDocuments,
  fetchOwnerProjectInvestments,
  fetchOwnerProjectReports,
  fetchOwnerProjects,
  submitOwnerProjectForReview,
  updateOwnerProject,
} from './service';

export const ownerKeys = {
  all: ['owner'] as const,
  projects: (token: string | null) => [...ownerKeys.all, 'projects', token] as const,
  project: (token: string | null, slug: string) => [...ownerKeys.all, 'project', token, slug] as const,
  documents: (token: string | null, slug: string) => [...ownerKeys.all, 'documents', token, slug] as const,
  reports: (token: string | null, slug: string) => [...ownerKeys.all, 'reports', token, slug] as const,
  investments: (token: string | null, slug: string) => [...ownerKeys.all, 'investments', token, slug] as const,
};

export function useOwnerProjectsQuery(token?: string | null) {
  const authToken = useAuthToken();
  const currentToken = token ?? authToken;

  return useQuery({
    queryKey: ownerKeys.projects(currentToken),
    queryFn: () => fetchOwnerProjects(),
    enabled: Boolean(currentToken),
  });
}

export function useOwnerProjectQuery(token: string | null | undefined, slug: string | null) {
  const authToken = useAuthToken();
  const currentToken = token ?? authToken;

  return useQuery({
    queryKey: ownerKeys.project(currentToken, slug ?? ''),
    queryFn: () => fetchOwnerProject(slug ?? ''),
    enabled: Boolean(currentToken && slug),
  });
}

export function useOwnerProjectDocumentsQuery(token: string | null | undefined, slug: string | null) {
  const authToken = useAuthToken();
  const currentToken = token ?? authToken;

  return useQuery({
    queryKey: ownerKeys.documents(currentToken, slug ?? ''),
    queryFn: () => fetchOwnerProjectDocuments(slug ?? ''),
    enabled: Boolean(currentToken && slug),
  });
}

export function useOwnerProjectReportsQuery(token: string | null | undefined, slug: string | null) {
  const authToken = useAuthToken();
  const currentToken = token ?? authToken;

  return useQuery({
    queryKey: ownerKeys.reports(currentToken, slug ?? ''),
    queryFn: () => fetchOwnerProjectReports(slug ?? ''),
    enabled: Boolean(currentToken && slug),
  });
}

export function useOwnerProjectInvestmentsQuery(token: string | null | undefined, slug: string | null) {
  const authToken = useAuthToken();
  const currentToken = token ?? authToken;

  return useQuery({
    queryKey: ownerKeys.investments(currentToken, slug ?? ''),
    queryFn: () => fetchOwnerProjectInvestments(slug ?? ''),
    enabled: Boolean(currentToken && slug),
  });
}

export function useCreateOwnerProjectMutation() {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: createOwnerProject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ownerKeys.projects(token) });
    },
  });
}

export function useUpdateOwnerProjectMutation() {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: ({
      slug,
      payload,
    }: {
      slug: string;
      payload: Parameters<typeof updateOwnerProject>[1];
    }) => updateOwnerProject(slug, payload),
    onSuccess: async (_response, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ownerKeys.projects(token) }),
        queryClient.invalidateQueries({ queryKey: ownerKeys.project(token, variables.slug) }),
      ]);
    },
  });
}

export function useSubmitOwnerProjectForReviewMutation() {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: ({ slug }: { slug: string }) => submitOwnerProjectForReview(slug),
    onSuccess: async (_response, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ownerKeys.projects(token) }),
        queryClient.invalidateQueries({ queryKey: ownerKeys.project(token, variables.slug) }),
      ]);
    },
  });
}

export function useCreateOwnerProjectDocumentMutation() {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: ({
      slug,
      ...payload
    }: Parameters<typeof createOwnerProjectDocument>[1] & { slug: string }) =>
      createOwnerProjectDocument(slug, payload),
    onSuccess: async (_response, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ownerKeys.documents(token, variables.slug) }),
        queryClient.invalidateQueries({ queryKey: ownerKeys.project(token, variables.slug) }),
      ]);
    },
  });
}

export function useCreateOwnerProjectReportMutation() {
  const queryClient = useQueryClient();
  const token = useAuthToken();

  return useMutation({
    mutationFn: ({
      slug,
      ...payload
    }: Parameters<typeof createOwnerProjectReport>[1] & { slug: string }) =>
      createOwnerProjectReport(slug, payload),
    onSuccess: async (_response, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ownerKeys.reports(token, variables.slug) }),
        queryClient.invalidateQueries({ queryKey: ownerKeys.project(token, variables.slug) }),
      ]);
    },
  });
}
