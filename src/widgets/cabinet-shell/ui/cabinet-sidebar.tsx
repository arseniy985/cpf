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
    <div className="flex h-full flex-col bg-cabinet-panel px-4 pb-4 pt-5">
      <div>
        <CabinetBrand
          className="border border-cabinet-border/70 bg-cabinet-panel-strong px-4 py-3"
          onClick={onNavigate}
        />
      </div>

      <div className="pt-4">
        <div className="rounded-[24px] border border-cabinet-border/70 bg-cabinet-panel-strong p-4 shadow-[0_18px_40px_rgba(31,50,66,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cabinet-accent-strong">
                Активный профиль
              </p>
              <p className="mt-2 truncate text-sm font-semibold text-cabinet-ink">{user.name}</p>
              <p className="mt-1 truncate text-xs text-cabinet-muted-ink">{user.email}</p>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cabinet-ink text-sm font-semibold text-cabinet-panel-strong">
              {getInitials(user.name)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-6">
          {groups.map((group) => (
            <div key={group.id}>
              {group.label ? (
                <div className="px-3 pb-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cabinet-muted-ink">{group.label}</p>
                </div>
              ) : null}
              <div className="space-y-1.5">
                {group.items.map((item) => {
                  const isActive = isCabinetItemActive(pathname, item);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        'group flex items-center gap-3 rounded-2xl border px-3 py-3 transition-[background-color,border-color,color,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabinet-accent/30',
                        isActive
                          ? 'border-cabinet-ink bg-cabinet-ink text-cabinet-panel-strong shadow-[0_14px_34px_rgba(31,50,66,0.16)]'
                          : 'border-transparent text-cabinet-ink hover:-translate-y-0.5 hover:border-cabinet-border hover:bg-cabinet-panel-strong',
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition-colors',
                          isActive
                            ? 'border-white/10 bg-white/10 text-cabinet-panel-strong'
                            : 'border-cabinet-border/70 bg-cabinet-panel-muted text-cabinet-accent-strong group-hover:bg-cabinet-accent-soft',
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex min-w-0 items-center gap-2">
                        <p className="truncate text-sm font-medium">{item.label}</p>
                        {isActive ? <CircleDot className="h-3.5 w-3.5 shrink-0 text-cabinet-accent-soft" /> : null}
                      </div>
                    </Link>
                  );
                })}
              </div>
              {group.id === 'investor' ? (
                <p className="px-3 pt-3 text-xs leading-relaxed text-cabinet-muted-ink">
                  Деньги, статус проверки и действия собраны в одном рабочем контуре.
                </p>
              ) : null}
            </div>
          ))}
        </nav>
      </div>

      <div className="pt-4">
        <Separator className="bg-cabinet-border/80" />
        <div className="mt-4 space-y-2">
          {cabinetUtilityLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href} onClick={onNavigate}>
                <Button
                  variant="outline"
                  width="full"
                  className="justify-start rounded-2xl border-cabinet-border bg-cabinet-panel-strong text-cabinet-ink hover:bg-cabinet-accent-soft"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
          <Button
            variant="ghost"
            width="full"
            className="justify-start rounded-2xl text-cabinet-muted-ink hover:bg-cabinet-panel-strong hover:text-cabinet-ink"
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
