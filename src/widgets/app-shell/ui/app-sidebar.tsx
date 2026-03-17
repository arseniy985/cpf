'use client';

import Link from 'next/link';
import { HelpCircle, LifeBuoy, Settings2 } from 'lucide-react';
import type { AuthUser } from '@/entities/viewer/api/types';
import { Button } from '@/components/ui/button';
import { CPFBrand } from '@/shared/ui/cpf-brand';
import { cn } from '@/shared/lib/classnames';
import {
  getModeRootHref,
  investorNavigation,
  isNavItemActive,
  ownerNavigation,
  sharedNavigation,
  type WorkspaceMode,
} from '../model/navigation';

type AppSidebarProps = {
  pathname: string;
  user: AuthUser;
  activeMode: WorkspaceMode;
  onNavigate?: () => void;
};

export function AppSidebar({
  pathname,
  user,
  activeMode,
  onNavigate,
}: AppSidebarProps) {
  const ownerAvailable = user.roles.includes('project_owner');
  const currentNav = activeMode === 'owner' ? ownerNavigation : investorNavigation;

  return (
    <div className="flex h-full flex-col border-r border-cabinet-border bg-gradient-to-b from-cabinet-panel to-cabinet-surface text-cabinet-ink">
      <div className="border-b border-cabinet-border px-5 py-5">
        <CPFBrand
          href="/app"
          onClick={onNavigate}
          theme="light"
          className="transition-[opacity,transform] hover:opacity-100"
        />
      </div>

      <div className="border-b border-cabinet-border px-5 py-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cabinet-muted-ink">Режим работы</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link
            href={getModeRootHref('investor')}
            onClick={onNavigate}
            className={cn(
              'inline-flex h-11 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition-[background-color,border-color,color]',
              activeMode === 'investor'
                ? 'border-cabinet-accent-strong bg-cabinet-accent-strong text-white'
                : 'border-cabinet-border bg-cabinet-surface text-cabinet-ink hover:border-cabinet-accent/45 hover:bg-cabinet-panel',
            )}
          >
            Investor
          </Link>
          <Link
            href={ownerAvailable ? getModeRootHref('owner') : '/app/settings'}
            onClick={onNavigate}
            className={cn(
              'inline-flex h-11 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition-[background-color,border-color,color]',
              activeMode === 'owner'
                ? 'border-cabinet-accent-strong bg-cabinet-accent-strong text-white'
                : 'border-cabinet-border bg-cabinet-surface text-cabinet-ink hover:border-cabinet-accent/45 hover:bg-cabinet-panel',
              !ownerAvailable && 'text-cabinet-muted-ink',
            )}
          >
            Owner
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <SidebarSection
          label={activeMode === 'owner' ? 'Owner Workspace' : 'Investor Workspace'}
          items={currentNav}
          pathname={pathname}
          onNavigate={onNavigate}
          inverted
        />
        <SidebarSection
          label="Shared"
          items={sharedNavigation}
          pathname={pathname}
          onNavigate={onNavigate}
          inverted
          className="mt-6"
        />
      </div>

      <div className="border-t border-cabinet-border px-4 py-4">
        <div className="rounded-xl border border-cabinet-border bg-cabinet-surface p-4">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="mt-1 truncate text-xs text-cabinet-muted-ink">{user.email}</p>
          <p className="mt-2 text-xs text-cabinet-muted-ink">
            {ownerAvailable ? 'Доступны режимы investor и owner' : 'Доступен режим investor'}
          </p>
        </div>

        <div className="mt-3 grid gap-2">
          <UtilityLink href="/app/settings" icon={Settings2} label="Настройки аккаунта" onNavigate={onNavigate} />
          <UtilityLink href="/documents" icon={HelpCircle} label="Юридические документы" onNavigate={onNavigate} />
          <UtilityLink href="/contacts" icon={LifeBuoy} label="Поддержка" onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}

function SidebarSection({
  label,
  items,
  pathname,
  onNavigate,
  inverted = false,
  className,
}: {
  label: string;
  items: typeof investorNavigation;
  pathname: string;
  onNavigate?: () => void;
  inverted?: boolean;
  className?: string;
}) {
  return (
    <section className={className}>
      <p className={cn(
        'px-2 text-[11px] font-semibold uppercase tracking-[0.18em]',
        inverted ? 'text-cabinet-muted-ink' : 'text-cabinet-muted-ink',
      )}>
        {label}
      </p>
      <div className="mt-3 space-y-1.5">
        {items.map((item) => {
          const isActive = isNavItemActive(pathname, item);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'group flex items-center gap-3 rounded-xl border px-3 py-3 transition-[background-color,border-color,color,transform] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-cabinet-accent/20',
                isActive
                  ? 'border-cabinet-accent/40 bg-cabinet-accent-soft text-cabinet-accent-strong'
                  : 'border-transparent text-cabinet-ink hover:-translate-y-0.5 hover:border-cabinet-border hover:bg-cabinet-surface',
              )}
            >
              <div className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-[background-color,color,border-color]',
                isActive
                  ? 'border-cabinet-accent/30 bg-white'
                  : 'border-cabinet-border bg-cabinet-surface text-cabinet-muted-ink group-hover:border-cabinet-accent/30 group-hover:text-cabinet-accent-strong',
              )}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{item.label}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function UtilityLink({
  href,
  icon: Icon,
  label,
  onNavigate,
}: {
  href: string;
  icon: typeof Settings2;
  label: string;
  onNavigate?: () => void;
}) {
  return (
    <Button
      asChild
      variant="ghost"
      className="h-11 justify-start rounded-xl border border-cabinet-border bg-cabinet-surface px-3 text-cabinet-ink hover:bg-cabinet-panel hover:text-cabinet-ink"
    >
      <Link href={href} onClick={onNavigate}>
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
      </Link>
    </Button>
  );
}
