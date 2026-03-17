'use client';

import type { ReactNode } from 'react';
import { AuthSessionProvider } from '@/features/session/model/use-session';

export function AuthSessionBoundary({ children }: { children: ReactNode }) {
  return <AuthSessionProvider>{children}</AuthSessionProvider>;
}
