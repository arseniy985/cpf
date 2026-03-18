'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useRole } from '../providers/role-provider';
import { 
  LayoutDashboard, 
  Briefcase, 
  Wallet, 
  PieChart, 
  FileText, 
  UserCheck,
  Building2,
  FolderKanban,
  CircleDollarSign,
  Users,
  BarChart3,
  Settings,
  Bell,
  ArrowLeftRight
} from 'lucide-react';

const investorLinks = [
  { name: 'Обзор', href: '/app/investor', icon: LayoutDashboard },
  { name: 'Портфель', href: '/app/investor/portfolio', icon: Briefcase },
  { name: 'Кошелек', href: '/app/investor/wallet', icon: Wallet },
  { name: 'Выплаты и доход', href: '/app/investor/payouts', icon: PieChart },
  { name: 'Документы', href: '/app/investor/documents', icon: FileText },
  { name: 'Проверка профиля', href: '/app/investor/verification', icon: UserCheck },
];

const ownerLinks = [
  { name: 'Обзор', href: '/app/owner', icon: LayoutDashboard },
  { name: 'Организация', href: '/app/owner/organization', icon: Building2 },
  { name: 'Проекты', href: '/app/owner/projects', icon: FolderKanban },
  { name: 'Раунды', href: '/app/owner/rounds', icon: CircleDollarSign },
  { name: 'Аллокации', href: '/app/owner/allocations', icon: Users },
  { name: 'Отчетность', href: '/app/owner/reporting', icon: BarChart3 },
  { name: 'Выплаты', href: '/app/owner/payouts', icon: PieChart },
  { name: 'Команда', href: '/app/owner/team', icon: Users },
];

const sharedLinks = [
  { name: 'Уведомления', href: '/app/notifications', icon: Bell },
  { name: 'Настройки', href: '/app/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { role, toggleRole } = useRole();

  const links = role === 'investor' ? investorLinks : ownerLinks;

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-brand-primary bg-brand-primary hidden md:flex">
      {/* Logo Area */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-white/10">
        <Link href="/app" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-accent rounded-xl flex items-center justify-center text-white font-bold text-lg">
            Ц
          </div>
          <span className="font-bold text-xl tracking-tight text-white">ЦПФ</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="mb-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {role === 'investor' ? 'Кабинет инвестора' : 'Кабинет владельца'}
        </div>
        {links.map((link) => {
          const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-white/10 text-white" 
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-brand-accent" : "text-slate-400")} />
              {link.name}
            </Link>
          );
        })}

        <div className="mt-8 mb-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Общее
        </div>
        {sharedLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-white/10 text-white" 
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-brand-accent" : "text-slate-400")} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Area: Role Switcher & User */}
      <div className="border-t border-white/10 p-4 space-y-4">
        <button
          onClick={toggleRole}
          className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4 text-brand-accent" />
            Режим: {role === 'investor' ? 'Инвестор' : 'Владелец'}
          </span>
        </button>
        
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-full bg-brand-accent flex items-center justify-center text-white font-medium text-sm">
            АИ
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white leading-none">Алексей И.</span>
            <span className="text-xs text-slate-400 mt-1">alex@example.com</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
