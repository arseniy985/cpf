'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCancelManualDepositMutation, useCancelWithdrawalMutation, useDashboardQuery, useManualDepositsQuery, useUploadManualDepositReceiptMutation, useWalletTransactionsQuery, useWithdrawalsQuery } from '@/entities/cabinet/api/hooks';
import { ManualDepositRequestForm } from '@/features/app-forms/ui/manual-deposit-request-form';
import { WithdrawalRequestForm } from '@/features/app-forms/ui/withdrawal-request-form';
import { formatDateTime, formatMoney } from '@/shared/lib/format';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';
import { AppKpiCard } from '@/shared/ui/app-cabinet/app-kpi-card';
import { AppPageHeader } from '@/shared/ui/app-cabinet/app-page-header';
import { AppStatusBadge } from '@/shared/ui/app-cabinet/app-status-badge';
import { AppSurface } from '@/shared/ui/app-cabinet/app-surface';

export default function InvestorWalletPage() {
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawalOpen, setWithdrawalOpen] = useState(false);
  const dashboardQuery = useDashboardQuery();
  const manualDepositsQuery = useManualDepositsQuery();
  const withdrawalsQuery = useWithdrawalsQuery();
  const walletTransactionsQuery = useWalletTransactionsQuery();
  const uploadReceiptMutation = useUploadManualDepositReceiptMutation();
  const cancelDepositMutation = useCancelManualDepositMutation();
  const cancelWithdrawalMutation = useCancelWithdrawalMutation();

  const dashboard = dashboardQuery.data?.data;
  const manualDeposits = manualDepositsQuery.data?.data ?? [];
  const withdrawals = withdrawalsQuery.data?.data ?? [];
  const walletTransactions = walletTransactionsQuery.data?.data ?? [];

  if (dashboardQuery.isPending) {
    return (
      <AppEmptyState
        title="Собираем кошелёк…"
        description="Подтягиваем текущий баланс, заявки на пополнение, заявки на вывод и историю движения средств."
      />
    );
  }

  if (!dashboard) {
    return (
      <AppEmptyState
        title="Кошелёк временно недоступен"
        description="Не удалось загрузить данные кошелька. Попробуйте обновить страницу позже."
      />
    );
  }

  return (
    <div className="space-y-6">
      <AppPageHeader
        eyebrow="Investor workspace"
        title="Кошелёк"
        description="Пополнение и вывод работают только через заявки. Здесь же хранится их история, статусы и движения средств."
        actions={(
          <>
            <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-11 rounded-none border-app-cabinet-border bg-app-cabinet-surface px-4 text-app-cabinet-text">
                  Создать заявку на пополнение
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-none border-app-cabinet-border p-0 sm:max-w-xl">
                <div className="bg-app-cabinet-surface p-6">
                  <DialogHeader>
                    <DialogTitle className="font-sans text-2xl font-semibold text-app-cabinet-text">Заявка на пополнение</DialogTitle>
                    <DialogDescription className="text-app-cabinet-muted">Пополнение проходит через ручную заявку и последующую загрузку подтверждения перевода.</DialogDescription>
                  </DialogHeader>
                  <div className="mt-6">
                    <ManualDepositRequestForm onSuccess={() => setDepositOpen(false)} />
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={withdrawalOpen} onOpenChange={setWithdrawalOpen}>
              <DialogTrigger asChild>
                <Button className="h-11 rounded-none bg-app-cabinet-primary px-4 text-white hover:bg-app-cabinet-primary-strong">
                  Создать заявку на вывод
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-none border-app-cabinet-border p-0 sm:max-w-xl">
                <div className="bg-app-cabinet-surface p-6">
                  <DialogHeader>
                    <DialogTitle className="font-sans text-2xl font-semibold text-app-cabinet-text">Заявка на вывод</DialogTitle>
                    <DialogDescription className="text-app-cabinet-muted">Вывод средств также подтверждается вручную. Проверьте реквизиты до отправки.</DialogDescription>
                  </DialogHeader>
                  <div className="mt-6">
                    <WithdrawalRequestForm onSuccess={() => setWithdrawalOpen(false)} />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <AppKpiCard label="Текущий баланс" value={formatMoney(dashboard.summary.walletBalance)} hint="Доступный остаток на текущий момент." />
        <AppKpiCard label="Пополнения в работе" value={formatMoney(dashboard.summary.pendingManualDeposits)} hint="Сумма заявок на пополнение, ещё не завершённых." tone="warning" />
        <AppKpiCard label="Выводы в работе" value={formatMoney(dashboard.summary.pendingWithdrawals)} hint="Сумма активных заявок на вывод." tone="warning" />
        <AppKpiCard label="Операций" value={String(walletTransactions.length)} hint="Лента движений средств по счёту." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <AppSurface eyebrow="Пополнение" title="Заявки на пополнение" description="После создания заявки загрузите подтверждение перевода, чтобы менеджер мог проверить операцию.">
          {manualDeposits.length ? (
            <div className="space-y-3">
              {manualDeposits.map((request) => (
                <div key={request.id} className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-app-cabinet-text">{formatMoney(request.amount, request.currency)}</p>
                      <p className="mt-1 text-sm text-app-cabinet-muted">{request.referenceCode} · {formatDateTime(request.createdAt)}</p>
                      <p className="mt-2 text-sm leading-6 text-app-cabinet-muted">{request.reviewNote ?? 'Ожидает дальнейших действий по заявке.'}</p>
                    </div>
                    <AppStatusBadge status={request.status} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <label className="inline-flex cursor-pointer items-center justify-center border border-app-cabinet-border bg-app-cabinet-secondary px-3 py-2 text-sm font-semibold text-app-cabinet-text">
                      Загрузить подтверждение
                      <input
                        type="file"
                        className="sr-only"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (!file) {
                            return;
                          }

                          try {
                            await uploadReceiptMutation.mutateAsync({ id: request.id, file });
                            toast.success('Подтверждение перевода загружено');
                          } catch {
                            toast.error('Не удалось загрузить подтверждение перевода');
                          } finally {
                            event.currentTarget.value = '';
                          }
                        }}
                      />
                    </label>
                    {['awaiting_transfer', 'under_review', 'awaiting_user_clarification'].includes(request.status) ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 rounded-none border-app-cabinet-border bg-app-cabinet-surface px-3 text-app-cabinet-text"
                        onClick={() => cancelDepositMutation.mutate({ id: request.id })}
                      >
                        Отменить заявку
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AppEmptyState title="Заявок на пополнение пока нет" description="Чтобы пополнить кошелёк, сначала создайте заявку. Прямого пополнения без заявки в кабинете нет." />
          )}
        </AppSurface>

        <AppSurface eyebrow="Вывод" title="Заявки на вывод" description="Каждая заявка показывает реквизиты, статусы проверки и причину ошибки или задержки, если она есть.">
          {withdrawals.length ? (
            <div className="space-y-3">
              {withdrawals.map((request) => (
                <div key={request.id} className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-app-cabinet-text">{formatMoney(request.amount)}</p>
                      <p className="mt-1 text-sm text-app-cabinet-muted">{request.bankName} · {request.bankAccount}</p>
                      <p className="mt-2 text-sm leading-6 text-app-cabinet-muted">{request.reviewNote ?? request.comment ?? 'Комментарий пока не добавлен.'}</p>
                    </div>
                    <AppStatusBadge status={request.status} />
                  </div>
                  {['pending_review', 'approved'].includes(request.status) ? (
                    <div className="mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 rounded-none border-app-cabinet-border bg-app-cabinet-surface px-3 text-app-cabinet-text"
                        onClick={() => cancelWithdrawalMutation.mutate({ id: request.id })}
                      >
                        Отменить заявку
                      </Button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <AppEmptyState title="Заявок на вывод пока нет" description="Когда понадобится вывести средства, создайте заявку и дождитесь ручной проверки." />
          )}
        </AppSurface>
      </div>

      <AppSurface eyebrow="Движение средств" title="Лента кошелька" description="Все фактические зачисления и списания по кошельку в одном потоке.">
        {walletTransactions.length ? (
          <div className="space-y-3">
            {walletTransactions.map((entry) => (
              <div key={entry.id} className="flex flex-col gap-3 border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-app-cabinet-text">{entry.description ?? entry.type}</p>
                  <p className="mt-1 text-sm text-app-cabinet-muted">{formatDateTime(entry.occurredAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-app-cabinet-text">{entry.direction === 'credit' ? '+' : '-'}{formatMoney(entry.amount, entry.currency)}</p>
                  <AppStatusBadge status={entry.status} className="mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AppEmptyState title="Лента движений пока пуста" description="После первой проведённой заявки на пополнение или вывода здесь появятся реальные проводки." />
        )}
      </AppSurface>
    </div>
  );
}
