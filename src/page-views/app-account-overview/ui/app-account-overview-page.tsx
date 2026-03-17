'use client';

import Link from 'next/link';
import { ArrowRight, BellDot, BriefcaseBusiness, Building2, FileStack, FolderKanban, Landmark, ShieldCheck, WalletCards } from 'lucide-react';
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
        title="Собираем обзор аккаунта…"
        description="Подтягиваем investor и owner данные, чтобы показать деньги, статусы и блокеры в одном экране."
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
        description="Не удалось загрузить агрегированные данные кабинета. Обновите страницу немного позже."
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
          description: 'Без подтверждения почты часть операционных уведомлений останется заблокирована.',
          href: '/app/settings',
        },
    session.user.kycStatus === 'approved'
      ? null
      : {
          id: 'kyc',
          title: 'Завершить проверку профиля',
          description: 'Заполните KYC, чтобы пополнение, заявки и вывод не стопорились на проверке.',
          href: '/app/investor/verification',
        },
    pendingDepositRequest
      ? {
          id: 'deposit',
          title: 'Дозагрузить материалы по пополнению',
          description: 'Заявка на пополнение уже создана. Проверьте комментарий и подтверждение перевода.',
          href: '/app/investor/wallet',
        }
      : null,
    pendingWithdrawalRequest
      ? {
          id: 'withdrawal',
          title: 'Проверить заявку на вывод',
          description: 'У заявки уже есть статус. Уточните реквизиты или дождитесь ручной обработки.',
          href: '/app/investor/wallet',
        }
      : null,
    canUseOwner && ownerWorkspace && ownerWorkspace.onboarding.status !== 'active'
      ? {
          id: 'owner',
          title: 'Закрыть блокеры owner onboarding',
          description: 'Организация ещё не готова к полноценной работе с проектами и раундами.',
          href: '/app/owner/organization',
        }
      : null,
  ].filter(Boolean) as Array<{ id: string; title: string; description: string; href: string }>;

  const accountHistory: TimelineItem[] = [
    ...notifications.slice(0, 3).map((notification) => ({
      id: `notification-${notification.id}`,
      title: notification.title,
      description: notification.body,
      meta: formatDateTime(notification.createdAt),
      tone: notification.isRead ? 'default' as const : 'warning' as const,
    })),
    ...(ownerWorkspace
      ? ownerWorkspace.actionItems.slice(0, 2).map((action) => ({
          id: `owner-action-${action.key}`,
          title: action.title,
          description: action.description,
          meta: 'Owner workspace',
          tone: action.tone === 'danger' ? 'warning' as const : 'default' as const,
        }))
      : []),
  ];

  return (
    <div className="space-y-6">
      <AppPageHeader
        eyebrow="Единый аккаунт"
        title="Обзор кабинета"
        description="В одном экране собраны investor и owner контуры: деньги, статусы, блокеры и ближайшие действия. Переключение ролей не требует второй авторизации."
        status={<AppStatusBadge status={canUseOwner ? ownerPrimaryStatus : session.user.kycStatus} />}
        actions={(
          <>
            <Button asChild variant="outline" className="h-11 rounded-none border-app-cabinet-border bg-app-cabinet-surface px-4 text-app-cabinet-text">
              <Link href="/app/notifications">Открыть уведомления</Link>
            </Button>
            <Button asChild className="h-11 rounded-none bg-app-cabinet-primary px-4 text-white hover:bg-app-cabinet-primary-strong">
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
            {canUseOwner ? <AppStatusBadge status={ownerPrimaryStatus} /> : null}
          </>
        )}
      />

      <AppSurface
        eyebrow="Что делать сейчас"
        title="Приоритетные действия по аккаунту"
        description="Показываем только ближайшие шаги, которые реально двигают кабинет дальше."
        action={(
          <Button asChild variant="outline" className="h-11 rounded-none border-app-cabinet-border bg-app-cabinet-surface px-4 text-app-cabinet-text">
            <Link href="/app/settings">Все настройки</Link>
          </Button>
        )}
      >
        {nextSteps.length === 0 ? (
          <AppEmptyState
            title="Критичных блокеров сейчас нет"
            description="Аккаунт готов к работе. Дальше можно перейти к портфелю, документам или owner-проектам."
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {nextSteps.slice(0, 3).map((step) => (
              <Link key={step.id} href={step.href} className="border border-app-cabinet-border bg-app-cabinet-secondary/35 px-4 py-4 transition-colors hover:border-app-cabinet-accent">
                <p className="text-sm font-semibold text-app-cabinet-text">{step.title}</p>
                <p className="mt-2 text-sm leading-6 text-app-cabinet-muted">{step.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-app-cabinet-primary">
                  Открыть <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </AppSurface>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <AppKpiCard label="Баланс инвестора" value={formatMoney(dashboard.summary.walletBalance)} hint="Доступный остаток в кабинете с учётом текущих заявок." icon={WalletCards} tone="accent" />
        <AppKpiCard label="Ожидаемые выплаты" value={formatMoney(expectedPayouts)} hint="Сумма ближайших начислений по текущему портфелю." icon={Landmark} />
        <AppKpiCard label="Проекты owner" value={String(ownerWorkspace?.summary.projectsCount ?? 0)} hint="Количество проектов в owner workspace." icon={FolderKanban} />
        <AppKpiCard label="Активные раунды" value={String(ownerActiveRounds)} hint="Раунды, которые готовятся, идут или находятся в расчётах." icon={Building2} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AppSurface eyebrow="Investor" title="Ключевые деньги и заявки" description="Данные инвестора выводятся без прокрутки: баланс, активные заявки, подтверждённые инвестиции и ближайшие выплаты.">
          <div className="grid gap-4 md:grid-cols-2">
            <AppKpiCard label="Активные заявки" value={String(dashboard.summary.applicationsCount)} hint="Черновики и заявки, которые ещё не закрыты." icon={BriefcaseBusiness} />
            <AppKpiCard label="Подтверждённые инвестиции" value={formatMoney(dashboard.summary.approvedAmount)} hint="Сумма позиций, уже закреплённых за проектами." icon={ShieldCheck} tone="success" />
            <AppKpiCard label="Ожидают пополнения" value={formatMoney(dashboard.summary.pendingManualDeposits)} hint="Объём заявок на пополнение, которые ещё не проведены." icon={WalletCards} tone="warning" />
            <AppKpiCard label="Ожидают вывода" value={formatMoney(dashboard.summary.pendingWithdrawals)} hint="Сумма заявок на вывод, ещё не завершённых по процессу." icon={FileStack} tone="warning" />
          </div>
        </AppSurface>

        <AppSurface eyebrow="Owner" title="Статус owner workspace" description="Профиль организации, проекты и раунды собраны в один компактный контур.">
          {ownerWorkspace ? (
            <div className="space-y-4">
              <div className="border border-app-cabinet-border bg-app-cabinet-secondary/35 px-4 py-4">
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
                  <Link key={item.key} href={item.href} className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4 transition-colors hover:border-app-cabinet-accent">
                    <p className="text-sm font-semibold text-app-cabinet-text">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-app-cabinet-muted">{item.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <AppEmptyState
              title="Owner workspace пока не активирован"
              description="Когда вы подключите режим владельца, здесь появятся onboarding, проекты, раунды и блокеры по проверке."
              action={(
                <Button asChild className="h-11 rounded-none bg-app-cabinet-primary px-4 text-white hover:bg-app-cabinet-primary-strong">
                  <Link href="/app/settings">Перейти в настройки</Link>
                </Button>
              )}
            />
          )}
        </AppSurface>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <AppSurface eyebrow="История" title="Последние изменения" description="Все важные события по двум ролям собраны в одну ленту без дублирования.">
          {accountHistory.length ? (
            <AppTimeline items={accountHistory} />
          ) : (
            <AppEmptyState title="История пока пуста" description="Когда в аккаунте появятся заявки, проверки или комментарии, лента начнёт заполняться." />
          )}
        </AppSurface>

        <AppSurface eyebrow="Быстрые переходы" title="Документы, выплаты и рабочие контуры" description="Самые частые маршруты, которые нужны в операционной работе.">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { href: '/app/investor/documents', label: 'Документы инвестора', icon: FileStack },
              { href: '/app/investor/payouts', label: 'Выплаты инвестора', icon: Landmark },
              { href: '/app/owner/projects', label: 'Проекты owner', icon: FolderKanban },
              { href: '/app/owner/rounds', label: 'Раунды owner', icon: Building2 },
              { href: '/app/notifications', label: 'Уведомления', icon: BellDot },
              { href: '/app/settings', label: 'Настройки аккаунта', icon: ShieldCheck },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4 transition-colors hover:border-app-cabinet-accent">
                <span className="flex h-10 w-10 items-center justify-center border border-app-cabinet-border bg-app-cabinet-secondary text-app-cabinet-primary">
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 text-sm font-semibold text-app-cabinet-text">{item.label}</span>
              </Link>
            ))}
          </div>
        </AppSurface>
      </div>
    </div>
  );
}
