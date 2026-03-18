'use client';

import { Bell, Search, Menu } from 'lucide-react';
import { useRole } from '../providers/role-provider';
import { Badge } from '../ui/badge';

export function Topbar() {
  const { role } = useRole();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-[#E2E8F0] bg-brand-surface px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button type="button" className="-m-2.5 p-2.5 text-brand-text-muted md:hidden">
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-[#E2E8F0] md:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
        <form className="relative flex flex-1 max-w-2xl" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Поиск
          </label>
          <div className="relative w-full flex items-center">
            <Search
              className="pointer-events-none absolute left-4 h-4 w-4 text-brand-text-muted"
              aria-hidden="true"
            />
            <input
              id="search-field"
              className="block w-full rounded-full border-0 py-2.5 pl-10 pr-12 text-brand-text placeholder:text-brand-text-muted bg-slate-100 focus:bg-white focus:ring-2 focus:ring-brand-accent sm:text-sm outline-none transition-all"
              placeholder="Поиск по проектам, документам, операциям..."
              type="search"
              name="search"
            />
            <button type="submit" className="absolute right-1.5 p-1.5 bg-brand-accent text-white rounded-full hover:bg-brand-accent/90 transition-colors">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-brand-text-muted">Текущая роль:</span>
            <Badge variant="secondary" className="uppercase tracking-wider text-[10px]">
              {role === 'investor' ? 'Инвестор' : 'Владелец объекта'}
            </Badge>
          </div>
          
          <button type="button" className="-m-2.5 p-2.5 text-brand-text-muted hover:text-brand-text relative">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-brand-error ring-2 ring-white" />
          </button>
        </div>
      </div>
    </header>
  );
}
