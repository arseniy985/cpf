'use client';

import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDashboardQuery } from '@/entities/cabinet/api/hooks';
import { ManualDepositRequestForm } from '@/features/app-forms/ui/manual-deposit-request-form';
import { WithdrawalRequestForm } from '@/features/app-forms/ui/withdrawal-request-form';
import { formatDateTime, formatMoney } from '@/shared/lib/format';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';
import { AppStatusBadge } from '@/shared/ui/app-cabinet/app-status-badge';

export default function InvestorWalletPage() {
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawalOpen, setWithdrawalOpen] = useState(false);
  const dashboardQuery = useDashboardQuery();
  const dashboard = dashboardQuery.data?.data;
  const walletTransactions = dashboard?.walletTransactions ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Кошелек</h1>
          <p className="mt-1 text-sm text-brand-text-muted">Управление средствами и история операций</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            className="border-slate-200 bg-white text-brand-primary hover:bg-brand-secondary"
            onClick={() => setWithdrawalOpen(true)}
          >
            Вывести средства
          </Button>
          <Button
            type="button"
            className="border border-brand-primary bg-brand-primary text-white hover:bg-brand-primary/90"
            onClick={() => setDepositOpen(true)}
          >
            Пополнить кошелек
          </Button>
        </div>
      </div>

      {dashboard && dashboard.summary.walletBalance > 0 ? (
        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="cabinet-card shadow-none">
            <div className="space-y-4 p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-text-muted">Доступно сейчас</p>
              <h2 className="text-4xl font-bold tracking-tight text-brand-text">{formatMoney(dashboard.summary.walletBalance)}</h2>
              <p className="max-w-md text-sm leading-6 text-brand-text-muted">
                Здесь собраны последние движения по кошельку: пополнения, списания по инвестициям и служебные операции платформы.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-sm border border-[#E2E8F0] bg-brand-secondary/20 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-brand-text-muted">Пополнения в работе</p>
                  <p className="mt-2 text-lg font-semibold text-brand-text">{dashboard.summary.pendingManualDeposits}</p>
                </div>
                <div className="rounded-sm border border-[#E2E8F0] bg-brand-secondary/20 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-brand-text-muted">Заявки на вывод</p>
                  <p className="mt-2 text-lg font-semibold text-brand-text">{dashboard.summary.pendingWithdrawals}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="cabinet-card shadow-none">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] p-6 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-brand-text">История операций</h3>
                <p className="mt-1 text-sm text-brand-text-muted">Последние движения по балансу с датой и текущим статусом.</p>
              </div>
            </div>
            <div className="divide-y divide-[#E2E8F0]">
              {walletTransactions.length ? walletTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between gap-4 p-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className={transaction.direction === 'credit' ? 'rounded-full bg-brand-success/10 p-2 text-brand-success' : 'rounded-full bg-brand-warning/10 p-2 text-brand-warning'}>
                      {transaction.direction === 'credit' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-brand-text">{transaction.description ?? 'Операция по кошельку'}</p>
                      <p className="mt-1 text-xs text-brand-text-muted">{formatDateTime(transaction.occurredAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={transaction.direction === 'credit' ? 'text-sm font-semibold text-brand-success' : 'text-sm font-semibold text-brand-text'}>
                      {transaction.direction === 'credit' ? '+' : '-'} {formatMoney(transaction.amount, transaction.currency)}
                    </p>
                    <div className="mt-1">
                      <AppStatusBadge status={transaction.status} />
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-6">
                  <AppEmptyState title="История пока пуста" description="После первого пополнения или инвестирования здесь появятся все движения по кошельку." />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <AppEmptyState
          icon={Wallet}
          title="Кошелек пуст"
          description="Пополните кошелек, чтобы начать инвестировать в проекты платформы."
          action={(
            <Button
              type="button"
              className="border border-brand-primary bg-brand-primary text-white hover:bg-brand-primary/90"
              onClick={() => setDepositOpen(true)}
            >
              Пополнить кошелек
            </Button>
          )}
        />
      )}

      <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
        <DialogContent className="rounded-[1.75rem] border-app-cabinet-border p-0 sm:max-w-2xl">
          <div className="bg-app-cabinet-surface p-6">
            <DialogHeader>
              <DialogTitle className="font-sans text-2xl font-semibold text-app-cabinet-text">Заявка на пополнение</DialogTitle>
              <DialogDescription className="text-app-cabinet-muted">
                Укажите сумму и данные отправителя. После создания заявки можно перевести деньги по реквизитам платформы.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6">
              <ManualDepositRequestForm onSuccess={() => setDepositOpen(false)} />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={withdrawalOpen} onOpenChange={setWithdrawalOpen}>
        <DialogContent className="rounded-[1.75rem] border-app-cabinet-border p-0 sm:max-w-2xl">
          <div className="bg-app-cabinet-surface p-6">
            <DialogHeader>
              <DialogTitle className="font-sans text-2xl font-semibold text-app-cabinet-text">Заявка на вывод</DialogTitle>
              <DialogDescription className="text-app-cabinet-muted">
                Укажите сумму и реквизиты. Заявка уйдёт на проверку и появится в истории операций.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6">
              <WithdrawalRequestForm onSuccess={() => setWithdrawalOpen(false)} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
