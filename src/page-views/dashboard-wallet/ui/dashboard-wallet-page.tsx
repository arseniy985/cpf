'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useCancelWithdrawalMutation, useDashboardQuery } from '@/entities/cabinet/api/hooks';
import { useSession } from '@/features/session/model/use-session';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { formatDateTime, formatMoney } from '@/shared/lib/format';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DepositFundsForm } from '@/features/deposit-funds/ui/deposit-funds-form';
import { WithdrawFundsForm } from '@/features/withdraw-funds/ui/withdraw-funds-form';
import { CabinetEmptyState } from '@/widgets/cabinet-workspace/ui/cabinet-empty-state';
import { CabinetPageHeader } from '@/widgets/cabinet-workspace/ui/cabinet-page-header';
import { CabinetStatCard } from '@/widgets/cabinet-workspace/ui/cabinet-stat-card';
import { CabinetSurface } from '@/widgets/cabinet-workspace/ui/cabinet-surface';
import { StatusBadge } from '@/shared/ui/status-badge';

export default function DashboardWalletPage() {
  const session = useSession();
  const dashboardQuery = useDashboardQuery();
  const cancelWithdrawalMutation = useCancelWithdrawalMutation();
  const [pendingCancellationId, setPendingCancellationId] = useState<string | null>(null);

  if (!session.token) {
    return null;
  }

  if (dashboardQuery.isPending) {
    return (
      <CabinetEmptyState
        title="Загружаем кошелёк…"
        description="Собираем баланс, платежи и заявки на вывод."
      />
    );
  }

  const dashboard = dashboardQuery.data?.data;

  if (dashboardQuery.isError || !dashboard) {
    return (
      <CabinetEmptyState
        title="Кошелёк временно недоступен"
        description="Не удалось загрузить баланс и журнал операций. Попробуйте снова чуть позже."
      />
    );
  }

  return (
    <div className="space-y-7">
      <CabinetPageHeader
        eyebrow="Кошелёк"
        title="Кошелёк и операции"
        description="Сначала доступный остаток и активные заявки, затем рабочие формы и журнал движений."
      />

      <CabinetSurface
        eyebrow="Баланс"
        title="Деньги под контролем"
        description="Рабочий срез по средствам: что уже доступно, что ушло в ручную обработку и сколько операций накопилось."
        variant="hero"
      >
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] bg-cabinet-ink p-6 text-cabinet-panel-strong shadow-[0_18px_44px_rgba(31,50,66,0.22)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cabinet-accent-soft/90">
              Доступный остаток
            </p>
            <p className="mt-4 font-mono text-[38px] font-semibold tracking-[-0.05em] sm:text-[46px]">
              {formatMoney(dashboard.summary.walletBalance)}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/72">
              Используйте эту сумму для подтверждения участия в проектах или формирования заявки на вывод.
            </p>
          </div>

          <div className="grid gap-3">
            <CabinetStatCard
              label="В очереди на вывод"
              value={formatMoney(dashboard.summary.pendingWithdrawals)}
              hint="Заявки, которые менеджер ещё не закрыл"
              variant="quiet"
            />
            <CabinetStatCard
              label="Платёжных сессий"
              value={String(dashboard.transactions.length)}
              hint="Пополнения и шаги оплаты через платёжный шлюз"
              variant="quiet"
            />
            <CabinetStatCard
              label="Записей в журнале"
              value={String(dashboard.walletTransactions.length)}
              hint="Проводки по дебету и кредиту кошелька"
              variant="quiet"
            />
          </div>
        </div>
      </CabinetSurface>

      <div className="grid gap-4 md:grid-cols-3">
        <CabinetStatCard label="Доступно" value={formatMoney(dashboard.summary.walletBalance)} variant="quiet" />
        <CabinetStatCard label="Платежей" value={String(dashboard.transactions.length)} variant="quiet" />
        <CabinetStatCard label="Операций" value={String(dashboard.walletTransactions.length)} variant="quiet" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <CabinetSurface eyebrow="Пополнение" title="Пополнение">
          <DepositFundsForm />
        </CabinetSurface>

        <CabinetSurface
          eyebrow="Вывод"
          title="Вывод средств"
          description="Заявка будет обработана менеджером вручную."
        >
          <WithdrawFundsForm />
        </CabinetSurface>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <CabinetSurface eyebrow="История" title="История операций">
          {dashboard.walletTransactions.length === 0 ? (
            <CabinetEmptyState
              title="Движений пока нет"
              description="После пополнения, подтверждения участия или вывода здесь появится история проводок."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Операция</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboard.walletTransactions.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-cabinet-ink">{entry.description ?? entry.type}</p>
                        <p className="mt-1 text-xs text-cabinet-muted-ink">{entry.type}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={entry.status} />
                    </TableCell>
                    <TableCell>{formatDateTime(entry.occurredAt)}</TableCell>
                    <TableCell className="text-right font-mono font-medium text-cabinet-ink">
                      {entry.direction === 'credit' ? '+' : '-'}{formatMoney(entry.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CabinetSurface>

        <CabinetSurface
          eyebrow="Текущие операции"
          title="Платежи и выводы"
          description="Активные пополнения и последние заявки на вывод."
          variant="subtle"
        >
          <div className="space-y-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cabinet-muted-ink">Пополнения</p>
              <div className="mt-3 space-y-3">
                {dashboard.transactions.length === 0 ? (
                  <CabinetEmptyState
                    title="Платежей пока нет"
                    description="После первого пополнения здесь появится история платежей."
                    className="px-4 py-8"
                  />
                ) : (
                  dashboard.transactions.map((transaction) => (
                    <div key={transaction.id} className="rounded-[22px] border border-cabinet-border bg-cabinet-panel px-4 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-cabinet-ink">{transaction.gateway}</p>
                          <p className="mt-1 text-sm text-cabinet-muted-ink">{formatMoney(transaction.amount)} · {transaction.type}</p>
                        </div>
                        <StatusBadge status={transaction.status} />
                      </div>
                      {transaction.confirmationUrl ? (
                        <div className="mt-3">
                          <Button
                            asChild
                            variant="outline"
                            className="rounded-full border-cabinet-border bg-cabinet-panel-strong text-cabinet-ink"
                          >
                            <a href={transaction.confirmationUrl} target="_blank" rel="noreferrer">
                              Продолжить оплату
                            </a>
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cabinet-muted-ink">Выводы</p>
              <div className="mt-3 space-y-3">
                {dashboard.withdrawals.length === 0 ? (
                  <CabinetEmptyState
                    title="Заявок на вывод нет"
                    description="Когда вы создадите заявку на вывод, она появится здесь."
                    className="px-4 py-8"
                  />
                ) : (
                  dashboard.withdrawals.map((withdrawal) => (
                    <div key={withdrawal.id} className="rounded-[22px] border border-cabinet-border bg-cabinet-panel-strong px-4 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-mono text-sm font-medium text-cabinet-ink">{formatMoney(withdrawal.amount)}</p>
                          <p className="mt-1 text-sm text-cabinet-muted-ink">{withdrawal.bankName} · {withdrawal.bankAccount}</p>
                          <p className="mt-2 text-xs text-cabinet-muted-ink">{formatDateTime(withdrawal.createdAt)}</p>
                        </div>
                        <div className="space-y-2 text-right">
                          <StatusBadge status={withdrawal.status} />
                          {['pending_review', 'approved'].includes(withdrawal.status) ? (
                            pendingCancellationId === withdrawal.id ? (
                              <div className="max-w-[18rem] space-y-2 rounded-[18px] border border-amber-200 bg-amber-50 px-3 py-3 text-left" aria-live="polite">
                                <p className="text-sm font-semibold text-amber-950">Отменить заявку?</p>
                                <p className="text-sm leading-relaxed text-amber-900">
                                  Заявка на {formatMoney(withdrawal.amount)} будет снята, а резерв в кошельке освободится.
                                </p>
                                <div className="flex flex-wrap justify-end gap-2">
                                  <Button
                                    className="rounded-full"
                                    disabled={cancelWithdrawalMutation.isPending}
                                    onClick={async () => {
                                      try {
                                        await cancelWithdrawalMutation.mutateAsync({ id: withdrawal.id });
                                        setPendingCancellationId(null);
                                        toast.success('Заявка на вывод отменена');
                                      } catch (error) {
                                        toast.error(getApiErrorMessage(error, 'Не удалось отменить заявку на вывод.'));
                                      }
                                    }}
                                  >
                                    {cancelWithdrawalMutation.isPending ? 'Отменяем…' : 'Подтвердить отмену'}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="rounded-full"
                                    disabled={cancelWithdrawalMutation.isPending}
                                    onClick={() => setPendingCancellationId(null)}
                                  >
                                    Оставить
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                variant="ghost"
                                className="rounded-full text-cabinet-muted-ink hover:bg-cabinet-panel hover:text-cabinet-ink"
                                onClick={() => setPendingCancellationId(withdrawal.id)}
                              >
                                <RotateCcw className="h-4 w-4" />
                                Отменить
                              </Button>
                            )
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </CabinetSurface>
      </div>
    </div>
  );
}
