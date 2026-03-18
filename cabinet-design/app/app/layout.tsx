import { RoleProvider } from '@/components/providers/role-provider';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProvider>
      <div className="min-h-screen bg-brand-bg">
        <Sidebar />
        <div className="md:pl-64 flex flex-col min-h-screen">
          <Topbar />
          <main className="flex-1">
            <div className="mx-auto max-w-[1440px] p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </RoleProvider>
  );
}
