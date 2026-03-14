'use client';

import { useMutation } from '@tanstack/react-query';
import { fetchJson } from '@/shared/api/http/client';

export function useContactLeadMutation() {
  return useMutation({
    mutationFn: async (payload: {
      full_name: string;
      email: string;
      phone?: string;
      subject: string;
      source?: string;
      message?: string;
    }) => fetchJson<{ data: { id: string; status: string } }>('/api/v1/contact-leads', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  });
}
