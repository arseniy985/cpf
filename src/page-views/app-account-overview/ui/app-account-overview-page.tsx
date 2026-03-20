'use client';

import Link from 'next/link';
import { ArrowRight, BriefcaseBusiness, Building2, FileStack, FolderKanban, Landmark, ShieldCheck, WalletCards } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboardQuery, useNotificationsQuery } from '@/entities/cabinet/api/hooks';
import { useOwnerWorkspaceQuery } from '@/entities/owner-account/api/hooks';
import { useOwnerRoundsQuery } from '@/entities/owner-round/api/hooks';
import { useSession } from '@/features/session/model/use-session';
import { formatDateTime, formatMoney } from '@/shared/lib/format';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';
import { AppKpiCard } from '@/shared/ui/app-cabinet/app-kpi-card';
import { AppPageHeader } from '@/shared/ui/app-cabinet/app-page-header';
import { AppStatusBadge } from '@/shared/ui/app-cabinet/app-status-badge';
import { AppSurface } from '@/shared/ui/app-cabinet/app-surface';
import { AppTimeline } from '@/shared/ui/app-cabinet/app-timeline';
import type { TimelineItem } from '@/shared/ui/app-cabinet/app-timeline';

export default function AppAccountOverviewPage() {
  const session = useSession();
  const canUseOwner = session.user?.roles.includes('project_owner') || Boolean(session.user?.ownerAccount);
  const dashboardQuery = useDashboardQuery();
  const notificationsQuery = useNotificationsQuery();
  const ownerWorkspaceQuery = useOwnerWorkspaceQuery(undefined, canUseOwner);
  const ownerRoundsQuery = useOwnerRoundsQuery(undefined, canUseOwner);

  if (!session.user) {
    return null;
  }

  if (dashboardQuery.isPending || (canUseOwner && ownerWorkspaceQuery.isPending)) {
    return (
      <AppEmptyState
        title="Собираем данные…"
        description="Загружаем сводку кабинета."
      />
    );
  }

  const dashboard = dashboardQuery.data?.data;
  const notifications = notificationsQuery.data?.data ?? [];
  const ownerWorkspace = ownerWorkspaceQuery.data?.data ?? null;
  const ownerRounds = ownerRoundsQuery.data?.data ?? [];

  if (!dashboard) {
    return (
      <AppEmptyState
        title="Обзор аккаунта недоступен"
        description="Не удалось загрузить данные. Обновите страницу позже."
      />
    );
  }

  const expectedPayouts = dashboard.distributionLines
    .filter((line) => !line.paidAt)
    .reduce((total, line) => total + line.amount, 0);
  const ownerActiveRounds = ownerRounds.filter((round) => ['ready', 'live', 'settling'].includes(round.status)).length;
  const ownerPrimaryStatus = ownerWorkspace?.onboarding.status ?? 'draft';
  const pendingDepositRequest = dashboard.manualDepositRequests.find((request) => ['awaiting_transfer', 'under_review', 'awaiting_user_clarification'].includes(request.status));
  const pendingWithdrawalRequest = dashboard.withdrawals.find((request) => ['pending_review', 'approved'].includes(request.status));

  const nextSteps = [
    session.user.emailVerifiedAt
      ? null
      : {
          id: 'email',
          title: 'Подтвердить почту',
          description: 'Письмо уже отправлено.',
          href: '/app/settings',
        },
    session.user.kycStatus === 'approved'
      ? null
      : {
          id: 'kyc',
          title: 'Завершить проверку профиля',
          description: 'Заполните анкету и загрузите документы для работы в кабинете.',
          href: '/app/investor/verification',
        },
    pendingDepositRequest
      ? {
          id: 'deposit',
          title: 'Дозагрузить материалы по пополнению',
          description: 'Проверьте комментарий к заявке.',
          href: '/app/investor/wallet',
        }
      : null,
    pendingWithdrawalRequest
      ? {
          id: 'withdrawal',
          title: 'Проверить заявку на вывод',
          description: 'Уточните реквизиты при необходимости.',
          href: '/app/investor/wallet',
        }
      : null,
    canUseOwner && ownerWorkspace && ownerWorkspace.onboarding.status !== 'active'
      ? {
          id: 'owner',
          title: 'Заполнить данные владельца',
          description: 'Нужны сведения о компании для активации раздела владельца.',
          href: '/app/owner/organization',
        }
      : null,
  ].filter(Boolean) as Array<{ id: string; title: string; description: string; href: string }>;

  const accountHistory: TimelineItem[] = [
    ...notifications.slice(0, 3).map((notification) => ({
      id: `notification-${notification.id}`,
      title: notification.title,
      description: notification.body.length > 88 ? `${notification.body.slice(0, 88)}…` : notification.body,
      meta: formatDateTime(notification.createdAt),
      tone: notification.isRead ? 'default' as const : 'warning' as const,
    })),
    ...(ownerWorkspace
      ? ownerWorkspace.actionItems.slice(0, 2).map((action) => ({
      id: `owner-action-${action.key}`,
      title: action.title,
      description: action.description.length > 88 ? `${action.description.slice(0, 88)}…` : action.description,
      meta: 'Кабинет владельца',
      tone: action.tone === 'danger' ? 'warning' as const : 'default' as const,
        }))
      : []),
  ];

  return (
    <div className="space-y-7">
      <AppPageHeader
        eyebrow="Единый Контур"
        title="Обзор кабинета"
        description="Деньги, статусы и ближайшие действия."
        status={<AppStatusBadge status={canUseOwner ? ownerPrimaryStatus : session.user.kycStatus} />}
        actions={(
          <>
            <Button asChild variant="outline" className="h-10 w-full rounded-xl border-app-cabinet-border bg-app-cabinet-surface px-4 text-app-cabinet-text sm:w-auto">
              <Link href="/app/notifications">Открыть уведомления</Link>
            </Button>
            <Button asChild className="h-10 w-full rounded-xl bg-app-cabinet-primary px-4 text-white hover:bg-app-cabinet-primary-strong sm:w-auto">
              <Link href={nextSteps[0]?.href ?? '/app/investor'}>
                Выполнить следующий шаг
              </Link>
            </Button>
          </>
        )}
        summary={(
          <>
            <AppStatusBadge status={session.user.emailVerifiedAt ? 'email verified' : 'email not verified'} />
            <AppStatusBadge status={session.user.kycStatus ?? 'draft'} />
          </>
        )}
      />

      <AppSurface
        eyebrow="В Фокусе"
        title="Следующие шаги"
        action={(
          <Button asChild variant="outline" className="h-10 w-full rounded-xl border-app-cabinet-border bg-app-cabinet-surface px-4 text-app-cabinet-text md:w-auto">
            <Link href="/app/settings">Все настройки</Link>
          </Button>
        )}
      >
        {nextSteps.length === 0 ? (
          <AppEmptyState
            title="Критичных блокеров нет"
            description="Можно переходить к работе с портфелем."
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {nextSteps.slice(0, 3).map((step) => (
              <Link key={step.id} href={step.href} className="min-w-0 rounded-xl border border-app-cabinet-border bg-app-cabinet-secondary/35 px-4 py-4 transition-colors hover:border-app-cabinet-accent">
                <p className="text-sm font-semibold text-app-cabinet-text text-balance">{step.title}</p>
                <p className="mt-2 text-sm leading-6 text-app-cabinet-muted">{step.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-app-cabinet-primary">
                  Открыть <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </AppSurface>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
        <AppKpiCard label="Баланс инвестора" value={formatMoney(dashboard.summary.walletBalance)} icon={WalletCards} tone="accent" />
        <AppKpiCard label="Ожидаемые выплаты" value={formatMoney(expectedPayouts)} icon={Landmark} />
        <AppKpiCard label="Проекты owner" value={String(ownerWorkspace?.summary.projectsCount ?? 0)} icon={FolderKanban} />
        <AppKpiCard label="Активные раунды" value={String(ownerActiveRounds)} icon={Building2} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AppSurface eyebrow="Инвестор" title="Деньги и заявки">
          <div className="grid gap-4 md:grid-cols-2">
            <AppKpiCard label="Активные заявки" value={String(dashboard.summary.applicationsCount)} icon={BriefcaseBusiness} />
            <AppKpiCard label="Подтверждённые инвестиции" value={formatMoney(dashboard.summary.approvedAmount)} icon={ShieldCheck} tone="success" />
            <AppKpiCard label="Ожидают пополнения" value={formatMoney(dashboard.summary.pendingManualDeposits)} icon={WalletCards} tone="warning" />
            <AppKpiCard label="Ожидают вывода" value={formatMoney(dashboard.summary.pendingWithdrawals)} icon={FileStack} tone="warning" />
          </div>
        </AppSurface>

        <AppSurface eyebrow="Владелец" title="Статус раздела владельца">
          {ownerWorkspace ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-app-cabinet-border bg-app-cabinet-secondary/35 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-app-cabinet-text">{ownerWorkspace.account.displayName}</p>
                    <p className="mt-1 text-sm text-app-cabinet-muted">{ownerWorkspace.organization.legalName ?? 'Юрлицо пока не заполнено'}</p>
                  </div>
                  <AppStatusBadge status={ownerWorkspace.onboarding.status} />
                </div>
              </div>
              <div className="grid gap-3">
                {ownerWorkspace.actionItems.slice(0, 3).map((item) => (
                  <Link key={item.key} href={item.href} className="rounded-xl border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4 transition-colors hover:border-app-cabinet-accent">
                    <p className="text-sm font-semibold text-app-cabinet-text">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-app-cabinet-muted">
                      {item.description.length > 76 ? `${item.description.slice(0, 76)}…` : item.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <AppEmptyState
              title="Раздел владельца пока не активирован"
              description="Заполните данные компании, чтобы открыть этот раздел."
              action={(
                <Button asChild className="h-10 rounded-xl bg-app-cabinet-primary px-4 text-white hover:bg-app-cabinet-primary-strong">
                  <Link href="/app/settings">Перейти в настройки</Link>
                </Button>
              )}
            />
          )}
        </AppSurface>
      </div>

      <div className="grid gap-6">
        <AppSurface eyebrow="История" title="Последние изменения">
          {accountHistory.length ? (
            <AppTimeline items={accountHistory} />
          ) : (
            <AppEmptyState title="История пока пуста" description="События появятся после первых действий в кабинете." />
          )}
        </AppSurface>
      </div>
    </div>
  );
}
