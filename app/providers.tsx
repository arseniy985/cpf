'use client';

import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { AuthSessionProvider } from '@/features/session/model/use-session';
import { createQueryClient } from '@/shared/config/query-client';

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (isServer) {
    return createQueryClient();
  }

  browserQueryClient ??= createQueryClient();

  return browserQueryClient;
}

export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionProvider>
        {children}
        <Toaster position="top-right" />
      </AuthSessionProvider>
    </QueryClientProvider>
  );
}
