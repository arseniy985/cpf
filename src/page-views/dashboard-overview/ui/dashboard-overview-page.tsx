'use client';

import Link from 'next/link';
import type { ComponentType } from 'react';
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  History,
  Landmark,
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
import { DashboardActionRail } from './dashboard-action-rail';
import { DashboardOverviewHero } from './dashboard-overview-hero';

export default function DashboardOverviewPage() {
  const session = useSession();
  const dashboardQuery = useDashboardQuery();
  const notificationsQuery = useNotificationsQuery();

  if (!session.token) {
    return null;
  }

  if (dashboardQuery.isPending) {
    return (
      <CabinetEmptyState
        title="Загружаем обзор кабинета…"
        description="Собираем заявки, уведомления и движение средств."
      />
    );
  }

  const dashboard = dashboardQuery.data?.data;
  const notifications = notificationsQuery.data?.data ?? [];

  if (!session.user || dashboardQuery.isError || !dashboard) {
    return (
      <CabinetEmptyState
        title="Обзор кабинета временно недоступен"
        description="Не удалось загрузить ключевые данные. Обновите страницу или вернитесь чуть позже."
      />
    );
  }

  const latestWalletEntry = dashboard.walletTransactions[0] ?? null;
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
    <div className="space-y-7">
      <CabinetPageHeader
        eyebrow="Кабинет инвестора"
        title="Кабинет без визуального шума"
        description="Сначала ориентиры и обязательные шаги, затем рабочие списки по сделкам, событиям и движению средств."
        actions={(
          <>
            <Button asChild variant="outline" className="rounded-full border-cabinet-border bg-cabinet-panel-strong text-cabinet-ink">
              <Link href="/projects">Каталог проектов</Link>
            </Button>
            <Button asChild className="rounded-full bg-cabinet-ink text-cabinet-panel-strong hover:bg-cabinet-ink/92">
              <Link href="/dashboard/wallet">Пополнить кошелёк</Link>
            </Button>
          </>
        )}
      />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <DashboardOverviewHero summary={dashboard.summary} user={session.user} />
        <DashboardActionRail actions={nextActions} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <CabinetStatCard
          label="Заявок в работе"
          value={String(dashboard.summary.applicationsCount)}
          hint="Черновики, рассмотрение и подтверждение участия"
          accent={<IconAccent icon={Landmark} tone="bg-cabinet-accent-soft text-cabinet-accent-strong" />}
          variant="quiet"
        />
        <CabinetStatCard
          label="Подтверждено в портфеле"
          value={formatMoney(dashboard.summary.approvedAmount)}
          hint="Капитал, который уже закреплён за сделками"
          accent={<IconAccent icon={BriefcaseBusiness} tone="bg-emerald-50 text-cabinet-success" />}
          variant="quiet"
        />
        <CabinetStatCard
          label="Последнее движение"
          value={latestWalletEntry ? formatMoney(latestWalletEntry.amount) : 'Нет данных'}
          hint={latestWalletEntry ? formatDateTime(latestWalletEntry.occurredAt) : 'После первой операции здесь появится якорь по движению средств'}
          accent={<IconAccent icon={History} tone="bg-cabinet-panel-muted text-cabinet-ink" />}
          variant="quiet"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <CabinetSurface
          eyebrow="Заявки"
          title="Последние заявки"
          description="Свежие движения по проектам, которые уже вошли или входят в ваш портфель."
        >
          {dashboard.applications.length === 0 ? (
            <CabinetEmptyState
              title="Портфель пока пуст"
              description="Выберите проект в каталоге и отправьте первую инвестиционную заявку."
              action={(
                <Button asChild className="rounded-full bg-cabinet-ink text-cabinet-panel-strong hover:bg-cabinet-ink/92">
                  <Link href="/projects">Смотреть проекты</Link>
                </Button>
              )}
            />
          ) : (
            <div className="space-y-3">
              {dashboard.applications.slice(0, 4).map((application) => (
                <div
                  key={application.id}
                  className="rounded-[24px] border border-cabinet-border bg-cabinet-panel p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-cabinet-ink">{application.project.title}</p>
                      <p className="mt-1 text-sm text-cabinet-muted-ink">{application.project.location}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-cabinet-muted-ink">
                        <span>{formatDateTime(application.createdAt)}</span>
                        <span className="font-mono text-cabinet-ink">{formatMoney(application.amount)}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <StatusBadge status={application.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CabinetSurface>

        <CabinetSurface
          eyebrow="События"
          title="Последние события"
          description="Только операционные изменения по проверкам, платежам и заявкам."
          variant="subtle"
        >
          {notificationsQuery.isError ? (
            <CabinetEmptyState
              title="События временно недоступны"
              description="Не удалось загрузить ленту уведомлений. Проверьте раздел позже."
            />
          ) : notifications.length === 0 ? (
            <CabinetEmptyState
              title="Событий пока нет"
              description="Когда менеджер изменит статус проверки, заявки или операции, это появится здесь."
            />
          ) : (
            <div className="space-y-3">
              {notifications.slice(0, 4).map((notification) => (
                <div key={notification.id} className="rounded-[22px] border border-cabinet-border bg-cabinet-panel-strong px-4 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-cabinet-ink">{notification.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-cabinet-muted-ink">{notification.body}</p>
                      <p className="mt-2 text-xs text-cabinet-muted-ink">{formatDateTime(notification.createdAt)}</p>
                    </div>
                    {!notification.isRead ? (
                      <Badge className="rounded-full border border-cabinet-accent/20 bg-cabinet-accent-soft text-cabinet-accent-strong">
                        Новое
                      </Badge>
                    ) : (
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-cabinet-success" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CabinetSurface>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <CabinetSurface
          eyebrow="Готовность"
          title="Статусы доступа"
          description="Короткая проверка, всё ли готово для работы с деньгами и документами."
          variant="subtle"
        >
          <div className="grid gap-3">
            <StatusTile label="Почта" status={session.user.emailVerifiedAt ? 'verified' : 'pending'} />
            <StatusTile label="Проверка" status={dashboard.summary.kycStatus ?? 'draft'} />
            <StatusTile label="Кошелёк" status={dashboard.summary.walletBalance > 0 ? 'approved' : 'draft'} />
            <StatusTile label="Уведомления" status={dashboard.summary.unreadNotifications > 0 ? 'pending' : 'approved'} />
          </div>
        </CabinetSurface>

        <CabinetSurface
          eyebrow="Кошелёк"
          title="Последние проводки"
          description="Быстрый обзор последних движений средств по кошельку."
          variant="subtle"
        >
          {dashboard.walletTransactions.length === 0 ? (
            <CabinetEmptyState
              title="Движений пока нет"
              description="После пополнений, подтверждений участия или вывода здесь появятся проводки кошелька."
            />
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {dashboard.walletTransactions.slice(0, 6).map((entry) => (
                <div key={entry.id} className="rounded-[22px] border border-cabinet-border bg-cabinet-panel p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-cabinet-ink">{entry.description ?? entry.type}</p>
                      <p className="mt-1 text-xs text-cabinet-muted-ink">{formatDateTime(entry.occurredAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-semibold text-cabinet-ink">
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
    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}>
      <Icon className="h-4 w-4" />
    </div>
  );
}

function StatusTile({ label, status }: { label: string; status: string }) {
  const isProblem = status === 'draft' || status === 'pending';

  return (
    <div className="rounded-[22px] border border-cabinet-border bg-cabinet-panel px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cabinet-muted-ink">{label}</p>
        {isProblem ? <Clock3 className="h-4 w-4 text-cabinet-warning" /> : <CheckCircle2 className="h-4 w-4 text-cabinet-success" />}
      </div>
      <div className="mt-3">
        <StatusBadge status={status} />
      </div>
    </div>
  );
}
