'use client';

import { RotateCcw } from 'lucide-react';
import { useCancelWithdrawalMutation, useDashboardQuery } from '@/entities/cabinet/api/hooks';
import { useSession } from '@/features/session/model/use-session';
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

  if (!session.token || dashboardQuery.isPending) {
    return null;
  }

  const dashboard = dashboardQuery.data?.data;

  if (!dashboard) {
    return null;
  }

  return (
    <div className="space-y-6">
      <CabinetPageHeader
        eyebrow="Кошелек"
        title="Кошелек и операции"
        description="Пополнения, вывод средств и история операций по вашему кабинету."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CabinetStatCard label="Доступно" value={formatMoney(dashboard.summary.walletBalance)} />
        <CabinetStatCard label="В очереди на вывод" value={formatMoney(dashboard.summary.pendingWithdrawals)} />
        <CabinetStatCard label="Платежей" value={String(dashboard.transactions.length)} />
        <CabinetStatCard label="Операций" value={String(dashboard.walletTransactions.length)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <CabinetSurface title="Пополнение">
          <DepositFundsForm />
        </CabinetSurface>

        <CabinetSurface title="Вывод средств" description="Заявка будет обработана менеджером вручную.">
          <WithdrawFundsForm />
        </CabinetSurface>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <CabinetSurface title="История операций">
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
                        <p className="font-medium text-slate-950">{entry.description ?? entry.type}</p>
                        <p className="mt-1 text-xs text-slate-500">{entry.type}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={entry.status} />
                    </TableCell>
                    <TableCell>{formatDateTime(entry.occurredAt)}</TableCell>
                    <TableCell className="text-right font-medium text-slate-950">
                      {entry.direction === 'credit' ? '+' : '-'}{formatMoney(entry.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CabinetSurface>

        <CabinetSurface title="Платежи и выводы" description="Последние пополнения и заявки на вывод.">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Пополнения</p>
              <div className="mt-3 space-y-3">
                {dashboard.transactions.length === 0 ? (
                  <CabinetEmptyState
                    title="Платежей пока нет"
                    description="После первого пополнения здесь появится история платежей."
                    className="px-4 py-8"
                  />
                ) : (
                  dashboard.transactions.map((transaction) => (
                    <div key={transaction.id} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-slate-950">{transaction.gateway}</p>
                          <p className="mt-1 text-sm text-slate-600">{formatMoney(transaction.amount)} · {transaction.type}</p>
                        </div>
                        <StatusBadge status={transaction.status} />
                      </div>
                      {transaction.confirmationUrl ? (
                        <div className="mt-3">
                          <a href={transaction.confirmationUrl} target="_blank" rel="noreferrer">
                            <Button variant="outline" className="rounded-lg border-slate-200 bg-white">
                              Продолжить оплату
                            </Button>
                          </a>
                        </div>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Выводы</p>
              <div className="mt-3 space-y-3">
                {dashboard.withdrawals.length === 0 ? (
                  <CabinetEmptyState
                    title="Заявок на вывод нет"
                    description="Когда вы создадите заявку на вывод, она появится здесь."
                    className="px-4 py-8"
                  />
                ) : (
                  dashboard.withdrawals.map((withdrawal) => (
                    <div key={withdrawal.id} className="rounded-lg border border-slate-200 bg-white px-4 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-slate-950">{formatMoney(withdrawal.amount)}</p>
                          <p className="mt-1 text-sm text-slate-600">{withdrawal.bankName} · {withdrawal.bankAccount}</p>
                          <p className="mt-2 text-xs text-slate-500">{formatDateTime(withdrawal.createdAt)}</p>
                        </div>
                        <div className="space-y-2 text-right">
                          <StatusBadge status={withdrawal.status} />
                          {['pending_review', 'approved'].includes(withdrawal.status) ? (
                            <Button
                              variant="ghost"
                              className="rounded-lg"
                              onClick={async () => {
                                try {
                                  await cancelWithdrawalMutation.mutateAsync({ id: withdrawal.id });
                                } catch {
                                  return;
                                }
                              }}
                            >
                              <RotateCcw className="h-4 w-4" />
                              Отменить
                            </Button>
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
