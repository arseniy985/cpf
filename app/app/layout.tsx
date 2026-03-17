import type { ReactNode } from 'react';
import { AuthSessionBoundary } from '@/features/session/ui/auth-session-boundary';
import { AppShell } from '@/widgets/app-shell';

export default function CabinetLayout({ children }: { children: ReactNode }) {
  return (
    <AuthSessionBoundary>
      <AppShell>{children}</AppShell>
    </AuthSessionBoundary>
  );
}
