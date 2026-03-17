import type { ReactNode } from 'react';
import { getServerAuthUser } from '@/entities/viewer/api/server';
import { AuthSessionProvider } from '@/features/session/model/use-session';
import { AppShell } from '@/widgets/app-shell';

export default async function CabinetLayout({ children }: { children: ReactNode }) {
  const initialUser = await getServerAuthUser();

  return (
    <AuthSessionProvider initialUser={initialUser}>
      <AppShell>{children}</AppShell>
    </AuthSessionProvider>
  );
}
