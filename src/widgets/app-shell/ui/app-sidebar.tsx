'use client';

import Link from 'next/link';
import {
  ArrowLeftRight,
  Bell,
  Briefcase,
  Building2,
  Compass,
  CircleDollarSign,
  FileText,
  LayoutDashboard,
  LogOut,
  PieChart,
  Settings,
  UserCheck,
  Users,
  Wallet,
  FolderKanban,
  BarChart3,
} from 'lucide-react';
import type { AuthUser } from '@/entities/viewer/api/types';
import { cn } from '@/shared/lib/classnames';
import { getModeRootHref, type WorkspaceMode } from '../model/navigation';

type AppSidebarProps = {
  pathname: string;
  user: AuthUser;
  activeMode: WorkspaceMode;
  onNavigate?: () => void;
  onLogout?: () => Promise<void>;
};

const investorLinks = [
  { name: 'Обзор', href: '/app/investor', icon: LayoutDashboard },
  { name: 'Каталог проектов', href: '/app/projects', icon: Compass },
  { name: 'Портфель', href: '/app/investor/portfolio', icon: Briefcase },
  { name: 'Кошелек', href: '/app/investor/wallet', icon: Wallet },
  { name: 'Выплаты и доход', href: '/app/investor/payouts', icon: PieChart },
  { name: 'Документы', href: '/app/investor/documents', icon: FileText },
  { name: 'Проверка профиля', href: '/app/investor/verification', icon: UserCheck },
] as const;

const ownerLinks = [
  { name: 'Обзор', href: '/app/owner', icon: LayoutDashboard },
  { name: 'Организация', href: '/app/owner/organization', icon: Building2 },
  { name: 'Проекты', href: '/app/owner/projects', icon: FolderKanban },
  { name: 'Раунды', href: '/app/owner/rounds', icon: CircleDollarSign },
  { name: 'Аллокации', href: '/app/owner/allocations', icon: Users },
  { name: 'Отчетность', href: '/app/owner/reporting', icon: BarChart3 },
  { name: 'Выплаты', href: '/app/owner/payouts', icon: PieChart },
  { name: 'Команда', href: '/app/owner/team', icon: Users },
] as const;

const sharedLinks = [
  { name: 'Уведомления', href: '/app/notifications', icon: Bell },
  { name: 'Настройки', href: '/app/settings', icon: Settings },
] as const;

export function AppSidebar({ pathname, user, activeMode, onNavigate, onLogout }: AppSidebarProps) {
  const ownerAvailable = user.roles.includes('project_owner') || Boolean(user.ownerAccount);
  const links = activeMode === 'investor' ? investorLinks : ownerLinks;
  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'ЦП';

  const nextMode = activeMode === 'investor' ? 'owner' : 'investor';

  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-r border-white/10 bg-brand-primary">
      <div className="flex h-16 shrink-0 items-center border-b border-white/10 px-6">
        <Link href="/app" className="flex items-center gap-2" onClick={onNavigate}>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-accent text-lg font-bold text-white">
            Ц
          </div>
          <span className="text-xl font-bold tracking-tight text-white">ЦПФ</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-1 px-3 py-4">
        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          {activeMode === 'investor' ? 'Кабинет инвестора' : 'Кабинет владельца'}
        </div>
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white',
              )}
            >
              <Icon className={cn('h-4 w-4', isActive ? 'text-brand-accent' : 'text-slate-400')} aria-hidden="true" />
              {link.name}
            </Link>
          );
        })}

        <div className="mb-2 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Общее
        </div>
        {sharedLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white',
              )}
            >
              <Icon className={cn('h-4 w-4', isActive ? 'text-brand-accent' : 'text-slate-400')} aria-hidden="true" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-4 border-t border-white/10 p-4">
        <Link
          href={ownerAvailable || nextMode === 'investor' ? getModeRootHref(nextMode) : '/app/settings'}
          onClick={onNavigate}
          className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          <span className="flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4 text-brand-accent" aria-hidden="true" />
            Режим: {activeMode === 'investor' ? 'Инвестор' : 'Владелец'}
          </span>
        </Link>

        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent text-sm font-medium text-white">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none text-white">{user.name}</span>
            <span className="mt-1 text-xs text-slate-400">{user.email}</span>
          </div>
        </div>

        {onLogout ? (
          <button
            type="button"
            onClick={() => {
              void onLogout();
              onNavigate?.();
            }}
            className="flex w-full items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4 text-slate-400" aria-hidden="true" />
            Выйти
          </button>
        ) : null}
      </div>
    </aside>
  );
}
