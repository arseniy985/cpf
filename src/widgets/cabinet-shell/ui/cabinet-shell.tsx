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
      <main className="min-h-screen bg-[#f4f5f7] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <Card className="rounded-lg border-slate-200 bg-white shadow-sm">
            <CardContent className="p-10 text-sm text-slate-500">
              Загружаем рабочее пространство...
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
    <div className="min-h-screen bg-[#f4f5f7] text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-[268px] shrink-0 border-r border-slate-200/80 lg:block">
          <CabinetSidebar pathname={pathname} user={session.user} onLogout={session.logout} />
        </aside>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-[300px] border-r border-slate-200 bg-[#fbfbfc] p-0 text-slate-900">
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
          <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-7xl">
              {hasAccess ? (
                children
              ) : (
                <CabinetEmptyState
                  title="Раздел недоступен"
                  description="Для этого рабочего пространства нужна роль инициатора проекта."
                  action={(
                    <Link href="/dashboard">
                      <Button className="rounded-lg">Вернуться в кабинет</Button>
                    </Link>
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
