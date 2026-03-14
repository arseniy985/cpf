import { CabinetShell } from '@/widgets/cabinet-shell';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CabinetShell>{children}</CabinetShell>;
}
