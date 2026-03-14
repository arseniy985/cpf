'use client';

import Link from 'next/link';
import type { ComponentType } from 'react';
import {
  BellDot,
  BriefcaseBusiness,
  CheckCircle2,
  Landmark,
  ShieldAlert,
  WalletCards,
} from 'lucide-react';
import { useDashboardQuery, useNotificationsQuery } from '@/entities/cabinet/api/hooks';
import { useSession } from '@/features/session/model/use-session';
import { formatDateTime, formatMoney } from '@/shared/lib/format';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CabinetEmptyState } from '@/widgets/cabinet-workspace/ui/cabinet-empty-state';
import { CabinetPageHeader } from '@/widgets/cabinet-workspace/ui/cabinet-page-header';
import { CabinetStatCard } from '@/widgets/cabinet-workspace/ui/cabinet-stat-card';
import { CabinetSurface } from '@/widgets/cabinet-workspace/ui/cabinet-surface';
import { StatusBadge } from '@/shared/ui/status-badge';

export default function DashboardOverviewPage() {
  const session = useSession();
  const dashboardQuery = useDashboardQuery();
  const notificationsQuery = useNotificationsQuery();

  if (!session.token || dashboardQuery.isPending) {
    return null;
  }

  const dashboard = dashboardQuery.data?.data;
  const notifications = notificationsQuery.data?.data ?? [];

  if (!session.user || !dashboard) {
    return null;
  }

  const nextActions = [
    session.user.kycStatus !== 'approved'
      ? {
        title: 'Завершить проверку профиля',
        description: 'Заполните анкету и загрузите документы, чтобы открыть все операции в кабинете.',
        href: '/dashboard/kyc',
      }
      : null,
    dashboard.summary.walletBalance < 10000
      ? {
        title: 'Пополнить кошелек',
        description: 'Пополните кошелек, чтобы подтвердить участие в выбранном проекте.',
        href: '/dashboard/wallet',
      }
      : null,
    {
      title: 'Посмотреть новые проекты',
      description: 'Откройте каталог и выберите проект для первой или следующей инвестиции.',
      href: '/projects',
    },
  ].filter(Boolean) as Array<{ title: string; description: string; href: string }>;

  return (
    <div className="space-y-6">
      <CabinetPageHeader
        eyebrow="Рабочий стол"
        title="Обзор кабинета"
        description="Главное по портфелю, кошельку, проверке профиля и последним действиям."
        actions={(
          <>
            <Link href="/projects">
              <Button variant="outline" className="rounded-lg border-slate-200 bg-white">
                Каталог проектов
              </Button>
            </Link>
            <Link href="/dashboard/wallet">
              <Button className="rounded-lg">Пополнить кошелек</Button>
            </Link>
          </>
        )}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CabinetStatCard
          label="Баланс кошелька"
          value={formatMoney(dashboard.summary.walletBalance)}
          hint="Доступно для участия и выводов"
          accent={<IconAccent icon={WalletCards} tone="bg-sky-50 text-sky-700" />}
        />
        <CabinetStatCard
          label="Портфель"
          value={formatMoney(dashboard.summary.portfolioAmount)}
          hint="Сумма подтвержденных и активных участий"
          accent={<IconAccent icon={BriefcaseBusiness} tone="bg-indigo-50 text-indigo-700" />}
        />
        <CabinetStatCard
          label="На проверке"
          value={String(dashboard.summary.applicationsCount)}
          hint="Заявки и новые участия"
          accent={<IconAccent icon={Landmark} tone="bg-amber-50 text-amber-700" />}
        />
        <CabinetStatCard
          label="Непрочитанные"
          value={String(dashboard.summary.unreadNotifications)}
          hint="Системные события и статусы"
          accent={<IconAccent icon={BellDot} tone="bg-emerald-50 text-emerald-700" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <CabinetSurface
          title="Статусы профиля"
          description="Текущий статус основных разделов вашего кабинета."
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <StatusTile label="Почта" status={session.user.emailVerifiedAt ? 'verified' : 'pending'} />
            <StatusTile label="Проверка" status={dashboard.summary.kycStatus ?? 'draft'} />
            <StatusTile label="Кошелек" status={dashboard.summary.walletBalance > 0 ? 'approved' : 'draft'} />
            <StatusTile label="Уведомления" status={dashboard.summary.unreadNotifications > 0 ? 'pending' : 'approved'} />
          </div>
        </CabinetSurface>

        <CabinetSurface
          title="Требует внимания"
          description="Короткий список действий, который держит кабинет в рабочем состоянии."
        >
          <div className="space-y-3">
            {nextActions.map((item) => (
              <Link key={item.title} href={item.href}>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 transition-colors hover:border-slate-300 hover:bg-white">
                  <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </CabinetSurface>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <CabinetSurface
          title="Последние заявки"
          description="Свежие действия по проектам, которые уже находятся в вашем портфеле."
          action={(
            <Link href="/dashboard/portfolio">
              <Button variant="ghost" className="rounded-lg text-slate-600">
                Открыть портфель
              </Button>
            </Link>
          )}
        >
          {dashboard.applications.length === 0 ? (
            <CabinetEmptyState
              title="Портфель пока пуст"
              description="Выберите проект в каталоге и отправьте первую инвестиционную заявку."
              action={(
                <Link href="/projects">
                  <Button className="rounded-lg">Смотреть проекты</Button>
                </Link>
              )}
            />
          ) : (
            <div className="space-y-3">
              {dashboard.applications.slice(0, 4).map((application) => (
                <div key={application.id} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{application.project.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{application.project.location}</p>
                      <p className="mt-2 text-xs text-slate-500">{formatDateTime(application.createdAt)}</p>
                    </div>
                    <div className="space-y-2 sm:text-right">
                      <p className="text-sm font-semibold text-slate-950">{formatMoney(application.amount)}</p>
                      <StatusBadge status={application.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CabinetSurface>

        <CabinetSurface title="Последние события" description="Операционные изменения по заявкам, платежам и проверкам.">
          {notifications.length === 0 ? (
            <CabinetEmptyState
              title="Событий пока нет"
              description="Когда менеджер изменит статус проверки, заявки или операции, это появится здесь."
            />
          ) : (
            <div className="space-y-3">
              {notifications.slice(0, 4).map((notification) => (
                <div key={notification.id} className="rounded-lg border border-slate-200 bg-white px-4 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{notification.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{notification.body}</p>
                      <p className="mt-2 text-xs text-slate-500">{formatDateTime(notification.createdAt)}</p>
                    </div>
                    {!notification.isRead ? (
                      <Badge className="rounded-md border border-indigo-200 bg-indigo-50 text-indigo-700">
                        Новое
                      </Badge>
                    ) : (
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-slate-300" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CabinetSurface>
      </div>

      <CabinetSurface title="Последние проводки" description="Быстрый обзор последних движений средств по кошельку.">
        {dashboard.walletTransactions.length === 0 ? (
          <CabinetEmptyState
            title="Движений пока нет"
            description="После пополнений, подтверждений участия или вывода здесь появятся проводки кошелька."
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {dashboard.walletTransactions.slice(0, 6).map((entry) => (
              <div key={entry.id} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{entry.description ?? entry.type}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatDateTime(entry.occurredAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-950">
                      {entry.direction === 'credit' ? '+' : '-'}{formatMoney(entry.amount)}
                    </p>
                    <div className="mt-2 flex justify-end">
                      <StatusBadge status={entry.status} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CabinetSurface>
    </div>
  );
}

function IconAccent({
  icon: Icon,
  tone,
}: {
  icon: ComponentType<{ className?: string }>;
  tone: string;
}) {
  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tone}`}>
      <Icon className="h-4 w-4" />
    </div>
  );
}

function StatusTile({ label, status }: { label: string; status: string }) {
  const isProblem = status === 'draft' || status === 'pending';

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
        {isProblem ? <ShieldAlert className="h-4 w-4 text-amber-500" /> : <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
      </div>
      <div className="mt-3">
        <StatusBadge status={status} />
      </div>
    </div>
  );
}
