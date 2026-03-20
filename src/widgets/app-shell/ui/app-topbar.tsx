'use client';

import Link from 'next/link';
import { Bell, Menu, Search, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AppRouteMeta, WorkspaceMode } from '../model/navigation';

type AppTopbarProps = {
  meta: AppRouteMeta;
  activeMode: WorkspaceMode;
  onOpenMenu: () => void;
};

export function AppTopbar({ meta, activeMode, onOpenMenu }: AppTopbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-[#E2E8F0] bg-brand-surface px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenMenu}
        className="-m-2.5 rounded-full p-2.5 text-brand-text-muted transition-colors hover:bg-slate-100 hover:text-brand-text md:hidden"
        aria-label="Открыть меню кабинета"
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="h-6 w-px bg-[#E2E8F0] md:hidden" aria-hidden="true" />

      <div className="flex flex-1 items-center gap-x-4 self-stretch lg:gap-x-6">
        <div className="min-w-0 flex-1 md:hidden">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-text-muted">{meta.section}</p>
          <h1 className="truncate text-sm font-semibold text-brand-text">{meta.title}</h1>
        </div>

        <form className="relative hidden max-w-2xl flex-1 md:flex" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Поиск
          </label>
          <div className="relative flex w-full items-center">
            <Search className="pointer-events-none absolute left-4 h-4 w-4 text-brand-text-muted" aria-hidden="true" />
            <input
              id="search-field"
              className="block w-full rounded-full border-0 bg-slate-100 py-2.5 pl-10 pr-12 text-brand-text outline-none transition-[background-color,box-shadow] placeholder:text-brand-text-muted focus:bg-white focus:ring-2 focus:ring-brand-accent sm:text-sm"
              placeholder="Поиск по проектам, документам, операциям…"
              type="search"
              name="search"
            />
            <button
              type="submit"
              className="absolute right-1.5 rounded-full bg-brand-accent p-1.5 text-white transition-colors hover:bg-brand-accent/90"
              aria-label="Запустить поиск"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-sm text-brand-text-muted">Текущая роль:</span>
            <div className="rounded-full bg-brand-secondary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-primary">
              {activeMode === 'investor' ? 'Инвестор' : 'Владелец объекта'}
            </div>
          </div>

          <Button
            asChild
            variant="ghost"
            size="icon"
            className="-m-2.5 hidden rounded-full p-2.5 text-brand-text-muted hover:bg-slate-100 hover:text-brand-text md:inline-flex"
          >
            <Link href="/app/settings" aria-label="Открыть настройки">
              <Settings2 className="h-5 w-5" aria-hidden="true" />
            </Link>
          </Button>

          <Button asChild variant="ghost" size="icon" className="-m-2.5 relative rounded-full p-2.5 text-brand-text-muted hover:bg-slate-100 hover:text-brand-text">
            <Link href="/app/notifications" aria-label="View notifications">
              <Bell className="h-5 w-5" aria-hidden="true" />
              <span className="absolute right-2.5 top-2 block h-2 w-2 rounded-full bg-brand-error ring-2 ring-white" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
