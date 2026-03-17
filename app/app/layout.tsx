import type { ReactNode } from 'react';
import { AppShell } from '@/widgets/app-shell';

export default function CabinetLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
