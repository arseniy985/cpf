'use client';

import Link from 'next/link';
import { CircleDot } from 'lucide-react';
import type { AuthUser } from '@/entities/viewer/api/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/shared/lib/classnames';
import {
  cabinetUtilityLinks,
  getCabinetNavigation,
  isCabinetItemActive,
} from '../model/navigation';
import { CabinetBrand } from './cabinet-brand';

type CabinetSidebarProps = {
  pathname: string;
  user: AuthUser;
  onNavigate?: () => void;
  onLogout: () => Promise<void>;
};

export function CabinetSidebar({
  pathname,
  user,
  onNavigate,
  onLogout,
}: CabinetSidebarProps) {
  const groups = getCabinetNavigation(user.roles);

  return (
    <div className="flex h-full flex-col bg-[#fbfbfc]">
      <div className="px-4 pt-4">
        <CabinetBrand
          className="border border-slate-200 bg-white px-3 py-3"
          onClick={onNavigate}
        />
      </div>

      <div className="px-4 pt-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-950">{user.name}</p>
              <p className="mt-1 truncate text-xs text-slate-500">{user.email}</p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-sm font-semibold text-white">
              {getInitials(user.name)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <nav className="space-y-5">
          {groups.map((group) => (
            <div key={group.id}>
              {group.label ? (
                <div className="px-2 pb-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{group.label}</p>
                </div>
              ) : null}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = isCabinetItemActive(pathname, item);
                  const Icon = item.icon;

                  return (
                    <Link key={item.href} href={item.href} onClick={onNavigate}>
                      <div
                        className={cn(
                          'group flex items-start gap-3 rounded-lg border px-3 py-3 transition-colors',
                          isActive
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-950',
                        )}
                      >
                        <div
                          className={cn(
                            'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors',
                            isActive
                              ? 'border-white/10 bg-white/10 text-white'
                              : 'border-slate-200 bg-slate-100 text-slate-500 group-hover:border-slate-200 group-hover:bg-slate-100 group-hover:text-slate-800',
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium">{item.label}</p>
                            {isActive ? <CircleDot className="h-3.5 w-3.5 shrink-0" /> : null}
                          </div>
                          <p className={cn('mt-1 text-xs leading-relaxed', isActive ? 'text-white/70' : 'text-slate-500')}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="px-4 pb-4">
        <Separator className="bg-slate-200" />
        <div className="mt-4 space-y-2">
          {cabinetUtilityLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href} onClick={onNavigate}>
                <Button variant="outline" width="full" className="justify-start rounded-lg border-slate-200 bg-white text-slate-700">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
          <Button
            variant="ghost"
            width="full"
            className="justify-start rounded-lg text-slate-600 hover:bg-white hover:text-slate-950"
            onClick={() => void onLogout()}
          >
            Выйти из кабинета
          </Button>
        </div>
      </div>
    </div>
  );
}

function getInitials(name: string) {
  const tokens = name.trim().split(/\s+/).filter(Boolean);

  return tokens.slice(0, 2).map((token) => token[0]?.toUpperCase()).join('') || 'ЦП';
}
