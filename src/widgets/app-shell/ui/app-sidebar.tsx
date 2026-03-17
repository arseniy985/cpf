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
    <div className="flex h-full flex-col bg-cabinet-primary text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <CPFBrand
          href="/app"
          onClick={onNavigate}
          theme="dark"
          className="transition-[opacity,transform] hover:opacity-100"
        />
      </div>

      <div className="border-b border-white/10 px-5 py-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">Режим работы</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link
            href={getModeRootHref('investor')}
            onClick={onNavigate}
            className={cn(
              'inline-flex h-11 items-center justify-center border px-3 text-sm font-semibold transition-[background-color,border-color,color]',
              activeMode === 'investor'
                ? 'border-cabinet-accent bg-cabinet-accent text-cabinet-primary'
                : 'border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10',
            )}
          >
            Investor
          </Link>
          <Link
            href={ownerAvailable ? getModeRootHref('owner') : '/app/settings'}
            onClick={onNavigate}
            className={cn(
              'inline-flex h-11 items-center justify-center border px-3 text-sm font-semibold transition-[background-color,border-color,color]',
              activeMode === 'owner'
                ? 'border-cabinet-accent bg-cabinet-accent text-cabinet-primary'
                : 'border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10',
              !ownerAvailable && 'text-white/60',
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

      <div className="border-t border-white/10 px-4 py-4">
        <div className="border border-white/10 bg-white/5 p-4">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="mt-1 truncate text-xs text-white/60">{user.email}</p>
          <p className="mt-2 text-xs text-white/60">
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
        inverted ? 'text-white/45' : 'text-cabinet-muted-ink',
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
                'group flex items-center gap-3 border px-3 py-3 transition-[background-color,border-color,color,transform] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-cabinet-accent/20',
                isActive
                  ? 'border-cabinet-accent bg-cabinet-accent text-cabinet-primary'
                  : 'border-white/5 text-white hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/5',
              )}
            >
              <div className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center border transition-[background-color,color,border-color]',
                isActive
                  ? 'border-cabinet-primary/10 bg-cabinet-primary/10'
                  : 'border-white/10 bg-white/5 text-white/80 group-hover:border-white/20 group-hover:bg-white/10',
              )}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{item.label}</p>
                <p className={cn('mt-1 truncate text-xs', isActive ? 'text-cabinet-primary/75' : 'text-white/55')}>
                  {item.description}
                </p>
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
      className="h-11 justify-start rounded-sm border border-white/10 bg-white/5 px-3 text-white hover:bg-white/10 hover:text-white"
    >
      <Link href={href} onClick={onNavigate}>
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
      </Link>
    </Button>
  );
}
