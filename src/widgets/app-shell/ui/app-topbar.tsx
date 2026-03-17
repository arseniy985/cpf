'use client';

import Link from 'next/link';
import { BellDot, ChevronRight, LogOut, Menu, Search } from 'lucide-react';
import type { AuthUser } from '@/entities/viewer/api/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { AppRouteMeta, WorkspaceMode } from '../model/navigation';

type AppTopbarProps = {
  meta: AppRouteMeta;
  activeMode: WorkspaceMode;
  user: AuthUser;
  onOpenMenu: () => void;
  onLogout: () => Promise<void>;
};

export function AppTopbar({
  meta,
  activeMode,
  user,
  onOpenMenu,
  onLogout,
}: AppTopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-cabinet-border bg-cabinet-canvas/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-[72px] max-w-[1440px] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Открыть навигацию"
          className="h-11 w-11 rounded-sm border-cabinet-border bg-cabinet-surface text-cabinet-ink lg:hidden"
          onClick={onOpenMenu}
        >
          <Menu className="h-4 w-4" />
        </Button>

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-cabinet-muted-ink">
            <span>Личный кабинет</span>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{meta.section}</span>
          </div>
          <div className="mt-2 flex min-w-0 flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold text-cabinet-ink sm:text-2xl">{meta.title}</h1>
              <p className="mt-1 hidden text-sm leading-relaxed text-cabinet-muted-ink lg:block">{meta.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="inline-flex h-11 min-w-[240px] items-center gap-2 border border-cabinet-border bg-cabinet-surface px-4 text-left text-sm text-cabinet-muted-ink transition-[border-color,background-color,color] hover:border-cabinet-accent/30 hover:bg-cabinet-panel focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-cabinet-accent/20"
              >
                <Search className="h-4 w-4 text-cabinet-accent-strong" aria-hidden="true" />
                <span className="truncate">Поиск по кабинету, документам и операциям</span>
              </button>
              <Badge className="rounded-sm border-cabinet-border bg-cabinet-panel px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-cabinet-ink">
                {activeMode === 'owner' ? 'Режим Owner' : 'Режим Investor'}
              </Badge>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-sm border-cabinet-border bg-cabinet-surface px-3 text-cabinet-ink hover:bg-cabinet-panel"
              >
                <Link href="/app/notifications" aria-label="Открыть уведомления">
                  <BellDot className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-sm border-cabinet-border bg-cabinet-surface px-3 text-cabinet-ink hover:bg-cabinet-panel"
                onClick={() => void onLogout()}
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Выйти
              </Button>
            </div>
          </div>
        </div>

        <div className="hidden border-l border-cabinet-border pl-4 xl:block">
          <p className="max-w-44 truncate text-sm font-semibold text-cabinet-ink">{user.name}</p>
          <p className="mt-1 max-w-44 truncate text-xs text-cabinet-muted-ink">{user.email}</p>
        </div>
      </div>
    </header>
  );
}
