'use client';

import Link from 'next/link';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { BriefcaseBusiness, Clock3, FileStack, Landmark, ShieldCheck, WalletCards } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboardQuery, useNotificationsQuery } from '@/entities/cabinet/api/hooks';
import { useSession } from '@/features/session/model/use-session';
import { formatDate, formatDateTime, formatMoney } from '@/shared/lib/format';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';
import { AppKpiCard } from '@/shared/ui/app-cabinet/app-kpi-card';
import { AppPageHeader } from '@/shared/ui/app-cabinet/app-page-header';
import { AppStatusBadge } from '@/shared/ui/app-cabinet/app-status-badge';
import { AppSurface } from '@/shared/ui/app-cabinet/app-surface';

export default function InvestorOverviewPage() {
  const session = useSession();
  const dashboardQuery = useDashboardQuery();
  const notificationsQuery = useNotificationsQuery();

  if (dashboardQuery.isPending) {
    return (
      <AppEmptyState
        title="Собираем investor workspace…"
        description="Подтягиваем баланс, статусы KYC, заявки, уведомления и ближайшие выплаты."
      />
    );
  }

  const dashboard = dashboardQuery.data?.data;
  const notifications = notificationsQuery.data?.data ?? [];

  if (!dashboard || !session.user) {
    return (
      <AppEmptyState
        title="Investor workspace недоступен"
        description="Не удалось загрузить основной набор данных для инвестора."
      />
    );
  }

  const chartData = dashboard.distributionLines
    .slice(0, 6)
    .map((line, index) => ({
      label: `#${index + 1}`,
      amount: line.amount,
    }));
  const nextSteps = [
    session.user.kycStatus === 'approved'
      ? null
      : {
          href: '/app/investor/verification',
          title: 'Завершить KYC',
          description: 'Без подтверждённого профиля часть финансовых операций будет заблокирована.',
        },
    dashboard.summary.pendingManualDeposits > 0
      ? {
          href: '/app/investor/wallet',
          title: 'Проверить заявку на пополнение',
          description: 'Пополнение работает только через заявку. Убедитесь, что приложены все материалы.',
        }
      : {
          href: '/app/investor/wallet',
          title: 'Создать заявку на пополнение',
          description: 'Если нужен новый баланс под сделку, отправьте заявку на пополнение заранее.',
        },
    dashboard.summary.applicationsCount > 0
      ? {
          href: '/app/investor/portfolio',
          title: 'Открыть активные заявки',
          description: 'Проверьте статус заявок и документы по текущим позициям.',
        }
      : {
          href: '/app/investor/portfolio',
          title: 'Создать первую заявку',
          description: 'Если портфель пуст, начните с инвестиционной заявки по доступному проекту.',
        },
  ].filter((step): step is { href: string; title: string; description: string } => Boolean(step));

  return (
    <div className="space-y-6">
      <AppPageHeader
        eyebrow="Investor workspace"
        title="Обзор инвестора"
        description="Первый экран отвечает на три вопроса: сколько денег доступно, что заблокировано и какой шаг нужно сделать следующим."
        status={<AppStatusBadge status={session.user.kycStatus ?? 'draft'} />}
        actions={(
          <>
            <Button asChild variant="outline" className="h-11 rounded-none border-app-cabinet-border bg-app-cabinet-surface px-4 text-app-cabinet-text">
              <Link href="/app/investor/documents">Открыть документы</Link>
            </Button>
            <Button asChild className="h-11 rounded-none bg-app-cabinet-primary px-4 text-white hover:bg-app-cabinet-primary-strong">
              <Link href={nextSteps[0]?.href ?? '/app/investor/wallet'}>Выполнить следующий шаг</Link>
            </Button>
          </>
        )}
        summary={(
          <>
            <AppStatusBadge status={session.user.emailVerifiedAt ? 'email verified' : 'email not verified'} />
            <AppStatusBadge status={dashboard.summary.pendingManualDeposits > 0 ? 'awaiting_transfer' : 'approved'} />
            <AppStatusBadge status={dashboard.summary.pendingWithdrawals > 0 ? 'pending_review' : 'approved'} />
          </>
        )}
      />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <AppKpiCard label="Баланс" value={formatMoney(dashboard.summary.walletBalance)} hint="Доступно под новые заявки и подтверждения участия." icon={WalletCards} tone="accent" />
        <AppKpiCard label="Активные заявки" value={String(dashboard.summary.applicationsCount)} hint="Черновики, ожидание проверки и подтверждения." icon={BriefcaseBusiness} />
        <AppKpiCard label="Подтверждённые инвестиции" value={formatMoney(dashboard.summary.approvedAmount)} hint="Сумма портфеля, уже закреплённая за проектами." icon={ShieldCheck} tone="success" />
        <AppKpiCard label="Ожидаемые выплаты" value={formatMoney(dashboard.distributionLines.filter((line) => !line.paidAt).reduce((sum, line) => sum + line.amount, 0))} hint="Начисления, которые ещё не перешли в фактическую выплату." icon={Landmark} />
      </div>

      <AppSurface eyebrow="Что делать сейчас" title="Приоритетные действия" description="Показываем только ближайшие обязательные шаги без второстепенных сценариев.">
        <div className="grid gap-4 lg:grid-cols-3">
          {nextSteps.map((step) => (
            <Link key={step.title} href={step.href} className="border border-app-cabinet-border bg-app-cabinet-secondary/35 px-4 py-4 transition-colors hover:border-app-cabinet-accent">
              <p className="text-sm font-semibold text-app-cabinet-text">{step.title}</p>
              <p className="mt-2 text-sm leading-6 text-app-cabinet-muted">{step.description}</p>
            </Link>
          ))}
        </div>
      </AppSurface>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <AppSurface eyebrow="Портфель" title="Мини-виджет портфеля" description="Последние заявки и инвестиции, чтобы без перехода видеть, где сейчас находится капитал.">
          {dashboard.applications.length ? (
            <div className="space-y-3">
              {dashboard.applications.slice(0, 4).map((application) => (
                <div key={application.id} className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-app-cabinet-text">{application.project.title}</p>
                      <p className="mt-1 text-sm text-app-cabinet-muted">{application.round?.title ?? 'Раунд не указан'}</p>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs uppercase tracking-[0.16em] text-app-cabinet-muted">
                        <span>{formatDateTime(application.createdAt)}</span>
                        <span>{formatMoney(application.amount)}</span>
                      </div>
                    </div>
                    <AppStatusBadge status={application.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AppEmptyState title="Портфель пока пуст" description="Создайте первую инвестиционную заявку, чтобы портфель начал заполняться." />
          )}
        </AppSurface>

        <AppSurface eyebrow="Выплаты" title="Мини-виджет выплат" description="Компактный вид по начислениям и ближайшим поступлениям.">
          {chartData.length ? (
            <div className="space-y-4">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid stroke="#D5E1EC" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: '#5B6B7C', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(value) => formatMoney(Number(value ?? 0))} />
                    <Area type="monotone" dataKey="amount" stroke="#0E2A47" fill="#5FAEE3" fillOpacity={0.18} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="grid gap-3">
                {dashboard.distributionLines.slice(0, 3).map((line) => (
                  <div key={line.id} className="flex items-start justify-between gap-3 border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
                    <div>
                      <p className="text-sm font-semibold text-app-cabinet-text">{line.allocation.round.projectTitle}</p>
                      <p className="mt-1 text-sm text-app-cabinet-muted">{line.allocation.round.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-app-cabinet-text">{formatMoney(line.amount)}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-app-cabinet-muted">{line.paidAt ? formatDate(line.paidAt) : 'Ожидается'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <AppEmptyState title="Начислений пока нет" description="Когда проект перейдёт к выплатам, здесь появятся ожидаемые и завершённые начисления." />
          )}
        </AppSurface>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <AppSurface eyebrow="Операции" title="Последние операции" description="Последние движения средств по кошельку и подтверждения участия.">
          {dashboard.walletTransactions.length ? (
            <div className="space-y-3">
              {dashboard.walletTransactions.slice(0, 4).map((entry) => (
                <div key={entry.id} className="flex items-start justify-between gap-4 border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
                  <div>
                    <p className="text-sm font-semibold text-app-cabinet-text">{entry.description ?? entry.type}</p>
                    <p className="mt-1 text-sm text-app-cabinet-muted">{formatDateTime(entry.occurredAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-app-cabinet-text">{entry.direction === 'credit' ? '+' : '-'}{formatMoney(entry.amount)}</p>
                    <AppStatusBadge status={entry.status} className="mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AppEmptyState title="Операций пока нет" description="После первой заявки на пополнение, подтверждения участия или вывода здесь появится история." />
          )}
        </AppSurface>

        <AppSurface eyebrow="Уведомления" title="Последние уведомления" description="Ближайшие изменения по заявкам, проверке профиля и движениям средств.">
          {notifications.length ? (
            <div className="space-y-3">
              {notifications.slice(0, 4).map((notification) => (
                <div key={notification.id} className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-app-cabinet-text">{notification.title}</p>
                      <p className="mt-1 text-sm leading-6 text-app-cabinet-muted">{notification.body}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-app-cabinet-muted">{formatDateTime(notification.createdAt)}</p>
                    </div>
                    {!notification.isRead ? <Clock3 className="mt-1 h-4 w-4 text-app-cabinet-warning" aria-hidden="true" /> : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AppEmptyState title="Уведомлений пока нет" description="Когда появятся изменения по операциям, заявкам или проверке, они окажутся здесь." />
          )}
        </AppSurface>
      </div>
    </div>
  );
}
