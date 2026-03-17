'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useRequireSession } from '@/features/session/model/use-session';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { getAppRouteMeta, type WorkspaceMode } from '../model/navigation';
import { AppSidebar } from './app-sidebar';
import { AppShellSkeleton } from './app-shell-skeleton';
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

  if (session.isLoading || (session.hasToken && !session.user && !session.isError)) {
    return <AppShellSkeleton />;
  }

  if (session.isError) {
    return (
      <main id="main-content" className="min-h-screen bg-cabinet-canvas px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 border border-cabinet-border bg-cabinet-surface p-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cabinet-muted-ink">Ошибка сессии</p>
            <h1 className="text-2xl font-semibold text-cabinet-ink">Не удалось загрузить кабинет</h1>
            <p className="max-w-2xl text-sm leading-6 text-cabinet-muted-ink">
              {getApiErrorMessage(session.error, 'Профиль пользователя не загрузился. Проверьте `NEXT_PUBLIC_API_BASE_URL` и доступность `/api/v1/auth/me`.')}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="button" className="rounded-none" onClick={() => router.refresh()}>
              Обновить страницу
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-none"
              onClick={async () => {
                await session.logout();
                router.replace('/login');
              }}
            >
              Сбросить сессию
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (!session.user) {
    return null;
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
