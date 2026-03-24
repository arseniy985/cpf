'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboardQuery, useNotificationsQuery } from '@/entities/cabinet/api/hooks';
import { useSession } from '@/features/session/model/use-session';
import { formatDate, formatDateTime, formatMoney, formatPercent } from '@/shared/lib/format';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';
import { AppKpiCard } from '@/shared/ui/app-cabinet/app-kpi-card';
import { AppStatusBadge } from '@/shared/ui/app-cabinet/app-status-badge';

export default function InvestorOverviewPage() {
  const session = useSession();
  const dashboardQuery = useDashboardQuery();
  const notificationsQuery = useNotificationsQuery();

  if (dashboardQuery.isPending) {
    return <AppEmptyState title="Кабинет загружается" description="Подтягиваем баланс, заявки и уведомления." />;
  }

  const dashboard = dashboardQuery.data?.data;
  const notifications = notificationsQuery.data?.data ?? [];

  if (!dashboard) {
    return <AppEmptyState title="Кабинет инвестора недоступен" description="Не удалось загрузить основной набор данных для инвестора." />;
  }

  const kycPending = session.user?.kycStatus !== 'approved';
  const operations = [
    ...dashboard.manualDepositRequests.slice(0, 1).map((item) => ({
      id: `deposit-${item.id}`,
      title: 'Пополнение кошелька',
      project: item.bankName,
      amount: `+ ${formatMoney(item.amount, item.currency)}`,
      status: item.status === 'credited' ? 'completed' : 'pending',
      date: formatDateTime(item.createdAt),
    })),
    ...dashboard.applications.slice(0, 2).map((item) => ({
      id: `application-${item.id}`,
      title: 'Заявка на инвестицию',
      project: item.project.title,
      amount: `- ${formatMoney(item.amount)}`,
      status: item.status === 'approved' || item.status === 'confirmed' ? 'completed' : 'pending',
      date: formatDateTime(item.createdAt),
    })),
    ...dashboard.distributionLines.slice(0, 1).map((item) => ({
      id: `distribution-${item.id}`,
      title: 'Выплата дохода',
      project: item.allocation.round.projectTitle,
      amount: `+ ${formatMoney(item.amount)}`,
      status: item.paidAt ? 'completed' : 'pending',
      date: item.paidAt ? formatDate(item.paidAt) : 'Ожидается',
    })),
  ].slice(0, 3);

  const activeInvestments = dashboard.allocations.slice(0, 2);
  const nextDocuments = dashboard.applications
    .flatMap((item) => item.project.documents.slice(0, 1).map((document) => ({
      id: `${item.id}-${document.id}`,
      title: document.title,
      subtitle: item.project.title,
      href: document.fileUrl ?? '/app/investor/documents',
      external: Boolean(document.fileUrl),
    })))
    .slice(0, 2);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Обзор инвестора</h1>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-brand-text-muted">Статус профиля:</span>
            <AppStatusBadge status={kycPending ? 'pending_review' : 'approved'} className={kycPending ? 'bg-brand-warning/10 text-brand-warning' : 'bg-brand-success/10 text-brand-success'} />
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button asChild variant="outline" className="h-11 w-full border-slate-200 bg-white px-6 text-brand-primary hover:bg-brand-secondary sm:w-auto">
            <Link href="/app/investor/wallet">Пополнить кошелек</Link>
          </Button>
          <Button asChild className="h-11 w-full border border-brand-primary bg-brand-primary px-6 text-white hover:bg-brand-primary/90 sm:w-auto">
            <Link href="/app/projects">Выбрать проект</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-3xl border border-brand-warning/30 bg-[#FFFAF0]">
        <div className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-start gap-4">
            <div className="mt-1 shrink-0 rounded-full bg-brand-warning/10 p-2 text-brand-warning">
              <Clock className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="mb-1 text-base font-semibold text-brand-text text-balance">
                {kycPending ? 'Завершите проверку профиля' : 'Следующий шаг по кабинету'}
              </h3>
              <p className="text-sm text-brand-text-muted">
                {kycPending
                  ? 'Для инвестирования в проекты платформы необходимо заполнить анкету и загрузить скан паспорта. Это требование законодательства.'
                  : 'Проверьте активные заявки, документы и историю выплат по текущему портфелю.'}
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Button asChild variant="ghost" className="w-full justify-center text-brand-text hover:bg-brand-secondary hover:text-brand-primary sm:w-auto">
              <Link href={kycPending ? '/app/investor/verification' : '/app/notifications'}>Подробнее</Link>
            </Button>
            <Button asChild className="w-full gap-2 border border-brand-primary bg-brand-primary text-white hover:bg-brand-primary/90 sm:w-auto">
              <Link href={kycPending ? '/app/investor/verification' : '/app/investor/portfolio'}>
                {kycPending ? 'Пройти проверку' : 'Открыть портфель'}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AppKpiCard label="Доступный баланс" value={formatMoney(dashboard.summary.walletBalance)} hint="В кошельке платформы" />
        <AppKpiCard label="Активные заявки" value={String(dashboard.summary.applicationsCount)} hint={`На сумму ${formatMoney(dashboard.summary.pendingAmount)}`} />
        <AppKpiCard label="В инвестициях" value={formatMoney(dashboard.summary.approvedAmount)} hint={`В ${dashboard.summary.allocationsCount} активных проектах`} />
        <AppKpiCard label="Ожидаемые выплаты" value={formatMoney(dashboard.summary.distributionsAmount)} hint={dashboard.distributionLines[0]?.paidAt ? `Ближайшая: ${formatDate(dashboard.distributionLines[0].paidAt)}` : 'Ближайшая выплата ожидается'} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="cabinet-card shadow-none">
            <div className="flex flex-row items-center justify-between border-b border-[#E2E8F0] p-6 pb-4">
              <h2 className="text-lg font-semibold leading-none tracking-tight">Последние операции</h2>
              <Button asChild variant="ghost" size="sm" className="text-brand-primary hover:text-brand-primary">
                <Link href="/app/investor/wallet">Все операции</Link>
              </Button>
            </div>
            <div className="divide-y divide-[#E2E8F0]">
              {operations.length ? operations.map((op) => (
                <div key={op.id} className="flex items-center justify-between p-4 transition-colors hover:bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {op.status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5 text-brand-success" />
                      ) : (
                        <Clock className="h-5 w-5 text-brand-warning" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-brand-text">{op.title}</p>
                      <p className="text-xs text-brand-text-muted">{op.project}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-brand-text">{op.amount}</p>
                    <p className="text-xs text-brand-text-muted">{op.date}</p>
                  </div>
                </div>
              )) : (
                <div className="p-6">
                  <AppEmptyState title="Операций пока нет" description="После первой заявки здесь появятся операции по кошельку и выплатам." />
                </div>
              )}
            </div>
          </div>

          <div className="cabinet-card shadow-none">
            <div className="flex flex-row items-center justify-between border-b border-[#E2E8F0] p-6 pb-4">
              <h2 className="text-lg font-semibold leading-none tracking-tight">Активные инвестиции</h2>
              <Button asChild variant="ghost" size="sm" className="text-brand-primary hover:text-brand-primary">
                <Link href="/app/investor/portfolio">Весь портфель</Link>
              </Button>
            </div>
            <div className="divide-y divide-[#E2E8F0]">
              {activeInvestments.length ? activeInvestments.map((item) => (
                <Link key={item.id} href="/app/investor/portfolio" className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-brand-text">{item.project.title}</p>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="text-xs text-brand-text-muted">{formatPercent(item.project.targetYield)} годовых</span>
                      <span className="text-xs text-brand-text-muted">•</span>
                      <span className="text-xs text-brand-text-muted">до {item.round?.title ?? `${item.project.termMonths} мес.`}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <p className="text-sm font-medium text-brand-text">{formatMoney(item.amount)}</p>
                    <ArrowRight className="h-4 w-4 text-brand-text-muted" />
                  </div>
                </Link>
              )) : (
                <div className="p-6">
                  <AppEmptyState title="Активных инвестиций пока нет" description="После подтверждения заявок здесь появятся активные позиции." />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-3xl border border-transparent bg-brand-secondary/30">
            <div className="p-6 pb-3">
              <h2 className="text-base font-semibold">Уведомления</h2>
            </div>
            <div className="space-y-4 p-6 pt-0">
              {notifications.length ? notifications.slice(0, 2).map((notification) => (
                <div key={notification.id} className="space-y-1">
                  <p className="text-sm font-medium text-brand-text">{notification.title}</p>
                  <p className="text-xs text-brand-text-muted">{notification.body}</p>
                  <p className="mt-1 text-[10px] text-brand-text-muted">{formatDateTime(notification.createdAt)}</p>
                </div>
              )) : (
                <p className="text-sm text-brand-text-muted">Нет новых уведомлений.</p>
              )}
              <Button asChild variant="link" className="h-auto px-0 text-xs">
                <Link href="/app/notifications">Все уведомления</Link>
              </Button>
            </div>
          </div>

          <div className="cabinet-card shadow-none">
            <div className="p-6 pb-3">
              <h2 className="text-base font-semibold">Новые документы</h2>
            </div>
            <div className="space-y-3 p-6 pt-0">
              {nextDocuments.length ? nextDocuments.map((document) => (
                <Link
                  key={document.id}
                  href={document.href}
                  target={document.external ? '_blank' : undefined}
                  rel={document.external ? 'noreferrer' : undefined}
                  className="flex items-start gap-3"
                >
                  <FileText className="mt-0.5 h-4 w-4 text-brand-text-muted" />
                  <div>
                    <p className="cursor-pointer text-sm text-brand-text transition-colors hover:text-brand-primary">{document.title}</p>
                    <p className="text-xs text-brand-text-muted">{document.subtitle}</p>
                  </div>
                </Link>
              )) : (
                <p className="text-sm text-brand-text-muted">Новые документы пока не появились.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
