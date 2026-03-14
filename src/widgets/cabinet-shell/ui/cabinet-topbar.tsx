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
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#f4f5f7]/95 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-lg border-slate-200 bg-white lg:hidden"
            onClick={onOpenMenu}
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Открыть навигацию</span>
          </Button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>{areaLabel}</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span>{meta.section}</span>
            </div>
            <div className="mt-1">
              <h1 className="truncate text-xl font-semibold tracking-tight text-slate-950">{meta.title}</h1>
              <p className="mt-1 hidden text-sm text-slate-600 md:block">{meta.description}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            className="rounded-lg text-slate-600 hover:bg-white hover:text-slate-950"
            onClick={() => void onLogout()}
          >
            <PanelLeftClose className="h-4 w-4" />
            Выйти
          </Button>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700">
            {getInitials(user.name)}
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
