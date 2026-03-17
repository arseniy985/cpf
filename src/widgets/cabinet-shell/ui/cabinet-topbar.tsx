'use client';

import { ChevronRight, Menu, PanelLeftClose } from 'lucide-react';
import type { AuthUser } from '@/entities/viewer/api/types';
import { Button } from '@/components/ui/button';
import type { CabinetRouteMeta } from '../model/navigation';

type CabinetTopbarProps = {
  meta: CabinetRouteMeta;
  areaLabel: string;
  user: AuthUser;
  onOpenMenu: () => void;
  onLogout: () => Promise<void>;
};

export function CabinetTopbar({
  meta,
  areaLabel,
  user,
  onOpenMenu,
  onLogout,
}: CabinetTopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-cabinet-border/80 bg-cabinet-canvas/90 backdrop-blur-xl">
      <div className="flex min-h-18 items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-[14px] border-cabinet-border bg-cabinet-panel-strong lg:hidden"
            onClick={onOpenMenu}
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Открыть навигацию</span>
          </Button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-cabinet-muted-ink">
              <span>{areaLabel}</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span>{meta.section}</span>
            </div>
            <p className="mt-1 hidden text-sm text-cabinet-muted-ink md:block">{meta.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            className="rounded-[14px] text-cabinet-muted-ink hover:bg-cabinet-panel hover:text-cabinet-ink"
            onClick={() => void onLogout()}
          >
            <PanelLeftClose className="h-4 w-4" />
            Выйти
          </Button>
          <div className="flex items-center gap-3 rounded-[14px] border border-cabinet-border bg-cabinet-panel-strong px-3 py-2 shadow-[0_10px_24px_rgba(17,35,63,0.04)]">
            <div className="hidden text-right sm:block">
              <p className="max-w-40 truncate text-sm font-medium text-cabinet-ink">{user.name}</p>
              <p className="text-xs text-cabinet-muted-ink">{meta.section}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-cabinet-ink text-sm font-semibold text-cabinet-panel-strong">
              {getInitials(user.name)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function getInitials(name: string) {
  const tokens = name.trim().split(/\s+/).filter(Boolean);

  return tokens.slice(0, 2).map((token) => token[0]?.toUpperCase()).join('') || 'ЦП';
}
