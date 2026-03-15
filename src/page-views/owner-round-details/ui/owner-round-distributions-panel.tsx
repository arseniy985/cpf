'use client';

import { useState } from 'react';
import { Play, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import {
  useApproveOwnerDistributionMutation,
  useRunOwnerDistributionPayoutsMutation,
} from '@/entities/owner-round/api/hooks';
import type { OwnerDistribution } from '@/entities/owner-round/api/types';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { formatDate, formatMoney } from '@/shared/lib/format';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/shared/ui/status-badge';

export function OwnerRoundDistributionsPanel({
  roundSlug,
  distributions,
}: {
  roundSlug: string;
  distributions: OwnerDistribution[];
}) {
  const approveMutation = useApproveOwnerDistributionMutation();
  const runPayoutsMutation = useRunOwnerDistributionPayoutsMutation();
  const [pendingRunId, setPendingRunId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {distributions.map((distribution) => {
        const canApprove = distribution.status === 'draft';
        const canRunPayouts = distribution.status === 'approved_for_payout';

        return (
          <div
            key={distribution.id}
            className="rounded-[24px] border border-cabinet-border bg-cabinet-panel px-4 py-4"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-medium text-cabinet-ink">{distribution.title}</p>
                  <StatusBadge status={distribution.status} />
                </div>
                <p className="mt-2 text-sm text-cabinet-muted-ink">
                  {distribution.periodLabel} · {formatMoney(distribution.totalAmount)} · {distribution.linesCount} строк
                </p>
                <p className="mt-1 text-xs text-cabinet-muted-ink">
                  {formatDate(distribution.periodStart)} → {formatDate(distribution.periodEnd)}
                </p>
                {distribution.notes ? (
                  <p className="mt-3 text-sm leading-relaxed text-cabinet-muted-ink">{distribution.notes}</p>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2 lg:justify-end">
                {canApprove ? (
                  <Button
                    className="rounded-full"
                    disabled={approveMutation.isPending}
                    onClick={async () => {
                      try {
                        await approveMutation.mutateAsync({
                          distributionId: distribution.id,
                          roundSlug,
                        });
                        toast.success('Реестр согласован и готов к выплате');
                      } catch (error) {
                        toast.error(getApiErrorMessage(error, 'Не удалось согласовать распределение.'));
                      }
                    }}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Согласовать
                  </Button>
                ) : null}

                {canRunPayouts ? (
                  pendingRunId === distribution.id ? (
                    <div className="rounded-[20px] border border-amber-300 bg-amber-50 px-3 py-3 text-sm text-amber-950">
                      <p className="font-semibold">Подтвердите запуск выплат</p>
                      <p className="mt-1 leading-relaxed text-amber-900/90">
                        Система начнёт обработку реестра на {formatMoney(distribution.totalAmount)}. Для записей без
                        реквизитов будет создана задача на ручную обработку.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          className="rounded-full border-amber-300 bg-white text-amber-950"
                          disabled={runPayoutsMutation.isPending}
                          onClick={async () => {
                            try {
                              await runPayoutsMutation.mutateAsync({
                                distributionId: distribution.id,
                                roundSlug,
                              });
                              setPendingRunId(null);
                              toast.success('Выплаты запущены');
                            } catch (error) {
                              toast.error(getApiErrorMessage(error, 'Не удалось запустить выплаты.'));
                            }
                          }}
                        >
                          Подтвердить запуск
                        </Button>
                        <Button
                          variant="ghost"
                          className="rounded-full text-amber-950 hover:bg-amber-100"
                          disabled={runPayoutsMutation.isPending}
                          onClick={() => setPendingRunId(null)}
                        >
                          Отмена
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="rounded-full border-cabinet-border bg-cabinet-panel-strong"
                      disabled={runPayoutsMutation.isPending}
                      onClick={() => setPendingRunId(distribution.id)}
                    >
                      <Play className="h-4 w-4" />
                      Запустить выплаты
                    </Button>
                  )
                ) : null}
              </div>
            </div>

            {distribution.lines.length > 0 ? (
              <div className="mt-4 grid gap-2">
                {distribution.lines.map((line) => (
                  <div
                    key={line.id}
                    className="flex flex-col gap-2 rounded-[20px] border border-cabinet-border/70 bg-cabinet-panel-strong px-3 py-3 text-sm lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-cabinet-ink">
                        {line.allocation.investorName ?? line.allocation.investorEmail ?? 'Инвестор'}
                      </p>
                      <p className="mt-1 truncate text-xs text-cabinet-muted-ink">
                        {line.payoutInstruction?.referenceLabel ?? line.allocation.project.title}
                      </p>
                      {(line.failureReason || line.payoutInstruction?.failureReason) ? (
                        <p className="mt-2 text-xs leading-relaxed text-amber-700">
                          {line.failureReason ?? line.payoutInstruction?.failureReason}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                      <span className="font-mono font-medium text-cabinet-ink">{formatMoney(line.amount)}</span>
                      <StatusBadge status={line.status} />
                      {line.payoutInstruction ? <StatusBadge status={line.payoutInstruction.status} /> : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
