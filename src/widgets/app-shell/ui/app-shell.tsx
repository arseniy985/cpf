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
        <div className="cabinet-card mx-auto flex max-w-[1440px] flex-col gap-4 p-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cabinet-muted-ink">Ошибка сессии</p>
            <h1 className="text-2xl font-semibold text-cabinet-ink">Не удалось загрузить кабинет</h1>
            <p className="max-w-2xl text-sm leading-6 text-cabinet-muted-ink">
              {getApiErrorMessage(session.error, 'Профиль пользователя не загрузился. Проверьте `NEXT_PUBLIC_API_BASE_URL` и доступность `/api/v1/auth/me`.')}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="button" className="h-11 rounded-full px-5" onClick={() => router.refresh()}>
              Обновить страницу
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-full border-cabinet-border bg-cabinet-surface px-5 text-cabinet-ink"
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
    <div data-cpf-app-shell="true" className="min-h-screen bg-cabinet-canvas text-cabinet-ink">
      <div className="min-h-screen bg-brand-bg md:pl-64">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 shrink-0 md:block">
          <AppSidebar pathname={pathname} user={session.user} activeMode={activeMode} />
        </aside>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="left"
            className="w-[92vw] max-w-64 border-r-0 bg-cabinet-primary p-0 text-white"
          >
            <AppSidebar
              pathname={pathname}
              user={session.user}
              activeMode={activeMode}
              onNavigate={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>

        <div className="flex min-h-screen min-w-0 flex-col">
          <AppTopbar
            meta={meta}
            activeMode={activeMode}
            user={session.user}
            onOpenMenu={() => setMobileOpen(true)}
            onLogout={session.logout}
          />
          <main id="main-content" className="flex-1">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-6 p-4 sm:p-6 lg:p-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
