'use client';

import { useMutation } from '@tanstack/react-query';
import { fetchJson } from '@/shared/api/http/client';

export function useProjectSubmissionMutation() {
  return useMutation({
    mutationFn: async (payload: {
      full_name: string;
      email: string;
      phone?: string;
      company_name?: string;
      project_name: string;
      asset_type: string;
      target_amount: number;
      message?: string;
    }) => fetchJson<{ data: { id: string; status: string } }>('/api/v1/project-submissions', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  });
}
