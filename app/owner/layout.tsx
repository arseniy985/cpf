import { CabinetShell } from '@/widgets/cabinet-shell';

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CabinetShell requiredRole="project_owner">{children}</CabinetShell>;
}
