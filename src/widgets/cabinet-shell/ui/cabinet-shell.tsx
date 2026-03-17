'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet';
import { useRequireSession } from '@/features/session/model/use-session';
import { getCabinetAreaLabel, getCabinetRouteMeta } from '../model/navigation';
import Link from 'next/link';
import { CabinetEmptyState } from '@/widgets/cabinet-workspace/ui/cabinet-empty-state';
import { CabinetSidebar } from './cabinet-sidebar';
import { CabinetTopbar } from './cabinet-topbar';

export function CabinetShell({
  children,
  requiredRole,
}: {
  children: ReactNode;
  requiredRole?: string;
}) {
  const pathname = usePathname();
  const session = useRequireSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!session.isAuthenticated || session.isLoading || !session.user) {
    return (
      <main className="min-h-screen bg-cabinet-canvas p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <Card className="rounded-[18px] border-cabinet-border bg-cabinet-panel-strong shadow-[0_16px_34px_rgba(17,35,63,0.05)]">
            <CardContent className="p-10 text-sm text-cabinet-muted-ink">
              Загружаем рабочее пространство…
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const meta = getCabinetRouteMeta(pathname);
  const areaLabel = getCabinetAreaLabel(pathname);
  const hasAccess = requiredRole ? session.user.roles.includes(requiredRole) : true;

  return (
    <div className="min-h-screen bg-cabinet-canvas text-cabinet-ink">
      <div className="flex min-h-screen">
        <aside className="hidden w-[286px] shrink-0 border-r border-cabinet-border/80 lg:block">
          <CabinetSidebar pathname={pathname} user={session.user} onLogout={session.logout} />
        </aside>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-[320px] border-r border-cabinet-border bg-cabinet-panel p-0 text-cabinet-ink">
            <CabinetSidebar
              pathname={pathname}
              user={session.user}
              onNavigate={() => setMobileOpen(false)}
              onLogout={session.logout}
            />
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 flex-1 flex-col">
          <CabinetTopbar
            meta={meta}
            areaLabel={areaLabel}
            user={session.user}
            onOpenMenu={() => setMobileOpen(true)}
            onLogout={session.logout}
          />
          <main id="main-content" className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-7xl">
              {hasAccess ? (
                children
              ) : (
                <CabinetEmptyState
                  title="Раздел недоступен"
                  description="Для этого рабочего пространства нужна роль инициатора проекта."
                  action={(
                    <Button asChild className="rounded-lg">
                      <Link href="/dashboard">Вернуться в кабинет</Link>
                    </Button>
                  )}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
