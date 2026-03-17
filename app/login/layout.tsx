import type { ReactNode } from 'react';
import { AuthSessionBoundary } from '@/features/session/ui/auth-session-boundary';

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <AuthSessionBoundary>{children}</AuthSessionBoundary>;
}
