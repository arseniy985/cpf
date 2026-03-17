'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useRequireSession } from '@/features/session/model/use-session';
import { getAppRouteMeta, type WorkspaceMode } from '../model/navigation';
import { AppSidebar } from './app-sidebar';
import { AppTopbar } from './app-topbar';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useRequireSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const ownerAvailable = session.user?.roles.includes('project_owner') ?? false;
  const activeMode = useMemo<WorkspaceMode>(() => {
    if (pathname.startsWith('/app/owner') && ownerAvailable) {
      return 'owner';
    }

    return 'investor';
  }, [ownerAvailable, pathname]);
  const meta = getAppRouteMeta(pathname);

  useEffect(() => {
    if (!session.user) {
      return;
    }

    if (pathname.startsWith('/app/owner') && !ownerAvailable) {
      router.replace('/app/settings');
    }
  }, [ownerAvailable, pathname, router, session.user]);

  if (!session.user || session.isLoading) {
    return (
      <main id="main-content" className="min-h-screen bg-cabinet-canvas px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1440px] border border-cabinet-border bg-cabinet-surface p-6 text-sm text-cabinet-muted-ink">
          Загружаем кабинет…
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-cabinet-canvas text-cabinet-ink">
      <div className="flex min-h-screen">
        <aside className="hidden w-[320px] shrink-0 lg:block">
          <AppSidebar pathname={pathname} user={session.user} activeMode={activeMode} />
        </aside>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="left"
            className="w-[92vw] max-w-[340px] border-r-0 bg-cabinet-primary p-0 text-white"
          >
            <AppSidebar
              pathname={pathname}
              user={session.user}
              activeMode={activeMode}
              onNavigate={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 flex-1 flex-col">
          <AppTopbar
            meta={meta}
            activeMode={activeMode}
            user={session.user}
            onOpenMenu={() => setMobileOpen(true)}
            onLogout={session.logout}
          />
          <main id="main-content" className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
