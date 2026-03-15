'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { useConfirmInvestmentMutation, useDashboardQuery, useInvestmentAgreementMutation } from '@/entities/cabinet/api/hooks';
import { useSession } from '@/features/session/model/use-session';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { formatDate, formatDateTime, formatMoney } from '@/shared/lib/format';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CabinetEmptyState } from '@/widgets/cabinet-workspace/ui/cabinet-empty-state';
import { CabinetPageHeader } from '@/widgets/cabinet-workspace/ui/cabinet-page-header';
import { CabinetStatCard } from '@/widgets/cabinet-workspace/ui/cabinet-stat-card';
import { CabinetSurface } from '@/widgets/cabinet-workspace/ui/cabinet-surface';
import { StatusBadge } from '@/shared/ui/status-badge';

export default function DashboardPortfolioPage() {
  const session = useSession();
  const dashboardQuery = useDashboardQuery();
  const agreementMutation = useInvestmentAgreementMutation();
  const confirmMutation = useConfirmInvestmentMutation();
  const [handledIds, setHandledIds] = useState<string[]>([]);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  if (!session.token) {
    return null;
  }

  if (dashboardQuery.isPending) {
    return (
      <CabinetEmptyState
        title="Загружаем портфель…"
        description="Собираем заявки, участия и последние начисления."
      />
    );
  }

  const dashboard = dashboardQuery.data?.data;

  if (dashboardQuery.isError || !dashboard) {
    return (
      <CabinetEmptyState
        title="Портфель временно недоступен"
        description="Не удалось загрузить заявки и участия. Обновите страницу или попробуйте позже."
      />
    );
  }

  return (
    <div className="space-y-6">
      <CabinetPageHeader
        eyebrow="Портфель"
        title="Портфель и заявки"
        description="Полный цикл инвестиционной заявки: от подачи до подтверждения участия и получения документов."
        actions={(
          <Button asChild className="rounded-lg">
            <Link href="/projects">Выбрать проект</Link>
          </Button>
        )}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CabinetStatCard label="Всего заявок" value={String(dashboard.summary.applicationsCount)} />
        <CabinetStatCard label="Подтвержденных участий" value={String(dashboard.summary.allocationsCount)} />
        <CabinetStatCard label="На рассмотрении" value={formatMoney(dashboard.summary.pendingAmount)} />
        <CabinetStatCard label="Портфель" value={formatMoney(dashboard.summary.portfolioAmount)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <CabinetSurface
          title="Заявки и подтверждения"
          description="Здесь вы видите заявки, договоры и подтверждение участия через кошелек."
        >
          {dashboard.applications.length === 0 ? (
            <CabinetEmptyState
              title="Заявок пока нет"
              description="Откройте каталог, выберите проект и отправьте первую инвестиционную заявку."
              action={(
                <Button asChild className="rounded-lg">
                  <Link href="/projects">Открыть каталог</Link>
                </Button>
              )}
            />
          ) : (
            <>
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Проект</TableHead>
                      <TableHead>Раунд</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Сумма</TableHead>
                      <TableHead>Создано</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboard.applications.map((application) => {
                      const confirmLocked = handledIds.includes(application.id) || application.status === 'confirmed';
                      const confirmArmed = confirmingId === application.id;

                      return (
                        <TableRow key={application.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-cabinet-ink">{application.project.title}</p>
                              <p className="mt-1 text-sm text-cabinet-muted-ink">{application.project.location}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {application.round ? (
                              <div>
                                <p className="font-medium text-cabinet-ink">{application.round.title}</p>
                                <p className="mt-1 text-xs text-cabinet-muted-ink">{application.round.slug}</p>
                              </div>
                            ) : (
                              <span className="text-sm text-cabinet-muted-ink">Раунд назначается</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={application.status} />
                          </TableCell>
                          <TableCell>{formatMoney(application.amount)}</TableCell>
                          <TableCell>{formatDateTime(application.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <InvestmentActions
                              applicationId={application.id}
                              amount={application.amount}
                              confirmArmed={confirmArmed}
                              confirmLocked={confirmLocked}
                              confirmPending={confirmMutation.isPending}
                              agreementPending={agreementMutation.isPending}
                              onOpenAgreement={async () => {
                                try {
                                  const response = await agreementMutation.mutateAsync({ id: application.id });
                                  window.open(response.data.agreementUrl, '_blank', 'noopener,noreferrer');
                                } catch (error) {
                                  toast.error(getApiErrorMessage(error, 'Не удалось открыть договор. Попробуйте еще раз.'));
                                }
                              }}
                              onStartConfirm={() => setConfirmingId(application.id)}
                              onCancelConfirm={() => setConfirmingId(null)}
                              onConfirm={async () => {
                                try {
                                  await confirmMutation.mutateAsync({ id: application.id });
                                  setHandledIds((current) => [...current, application.id]);
                                  setConfirmingId(null);
                                  toast.success('Участие подтверждено');
                                } catch (error) {
                                  toast.error(getApiErrorMessage(error, 'Не удалось подтвердить участие.'));
                                }
                              }}
                              align="end"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="grid gap-3 lg:hidden">
                {dashboard.applications.map((application) => {
                  const confirmLocked = handledIds.includes(application.id) || application.status === 'confirmed';
                  const confirmArmed = confirmingId === application.id;

                  return (
                    <div key={application.id} className="rounded-[24px] border border-cabinet-border bg-cabinet-panel px-4 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-cabinet-ink">{application.project.title}</p>
                          <p className="mt-1 text-sm text-cabinet-muted-ink">{application.project.location}</p>
                        </div>
                        <StatusBadge status={application.status} />
                      </div>
                      <div className="mt-4 grid gap-2 text-sm text-cabinet-muted-ink">
                        <p>Раунд: {application.round?.title ?? 'Назначается'}</p>
                        <p>Сумма: {formatMoney(application.amount)}</p>
                        <p>Создано: {formatDateTime(application.createdAt)}</p>
                      </div>
                      <div className="mt-4">
                        <InvestmentActions
                          applicationId={application.id}
                          amount={application.amount}
                          confirmArmed={confirmArmed}
                          confirmLocked={confirmLocked}
                          confirmPending={confirmMutation.isPending}
                          agreementPending={agreementMutation.isPending}
                          onOpenAgreement={async () => {
                            try {
                              const response = await agreementMutation.mutateAsync({ id: application.id });
                              window.open(response.data.agreementUrl, '_blank', 'noopener,noreferrer');
                            } catch (error) {
                              toast.error(getApiErrorMessage(error, 'Не удалось открыть договор. Попробуйте еще раз.'));
                            }
                          }}
                          onStartConfirm={() => setConfirmingId(application.id)}
                          onCancelConfirm={() => setConfirmingId(null)}
                          onConfirm={async () => {
                            try {
                              await confirmMutation.mutateAsync({ id: application.id });
                              setHandledIds((current) => [...current, application.id]);
                              setConfirmingId(null);
                              toast.success('Участие подтверждено');
                            } catch (error) {
                              toast.error(getApiErrorMessage(error, 'Не удалось подтвердить участие.'));
                            }
                          }}
                          align="start"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {(agreementMutation.isError || confirmMutation.isError) ? (
            <p className="mt-4 text-sm text-rose-600">
              {getApiErrorMessage(agreementMutation.error ?? confirmMutation.error, 'Не удалось выполнить действие по заявке.')}
            </p>
          ) : null}
        </CabinetSurface>

        <div className="space-y-6">
          <CabinetSurface
            title="Подтвержденные участия"
            description="Ваши подтвержденные участия с привязкой к действующему раунду."
            variant="subtle"
          >
            {dashboard.allocations.length === 0 ? (
              <CabinetEmptyState
                title="Подтвержденных участий пока нет"
                description="После подтверждения участия через кошелек здесь появятся реальные позиции в портфеле."
                className="px-4 py-8"
              />
            ) : (
              <div className="space-y-3">
                {dashboard.allocations.map((allocation) => (
                  <div key={allocation.id} className="rounded-[22px] border border-cabinet-border bg-cabinet-panel px-4 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-medium text-cabinet-ink">{allocation.project.title}</p>
                        <p className="mt-1 text-sm text-cabinet-muted-ink">
                          {allocation.round.title} · {formatPayoutFrequency(allocation.round.payoutFrequency)}
                        </p>
                      </div>
                      <StatusBadge status={allocation.status} />
                    </div>
                    <div className="mt-4 grid gap-2 text-sm text-cabinet-muted-ink">
                      <p>Сумма участия: <span className="font-medium text-cabinet-ink">{formatMoney(allocation.amount)}</span></p>
                      <p>Дата: {formatDateTime(allocation.allocatedAt)}</p>
                      <p>Доходность проекта: {allocation.project.targetYield.toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CabinetSurface>

          <CabinetSurface
            title="Начисления и выплаты"
            description="Здесь видно, что уже начислено, что выплачено и какие выплаты еще обрабатываются."
            variant="subtle"
          >
            {dashboard.distributionLines.length === 0 ? (
              <CabinetEmptyState
                title="Начислений пока нет"
                description="Когда владелец сформирует реестр выплат, здесь появится начисление и его статус."
                className="px-4 py-8"
              />
            ) : (
              <div className="space-y-3">
                {dashboard.distributionLines.map((line) => (
                  <div key={line.id} className="rounded-[22px] border border-cabinet-border bg-cabinet-panel-strong px-4 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-medium text-cabinet-ink">{line.payoutInstruction?.distributionTitle ?? 'Начисление'}</p>
                        <p className="mt-1 text-sm text-cabinet-muted-ink">
                          {line.allocation.project.title} · {line.allocation.round.title}
                        </p>
                      </div>
                      <StatusBadge status={line.status} />
                    </div>
                    <div className="mt-4 grid gap-2 text-sm text-cabinet-muted-ink">
                      <p>Сумма: <span className="font-medium text-cabinet-ink">{formatMoney(line.amount)}</span></p>
                      <p>Обработано: {formatDate(line.payoutInstruction?.processedAt ?? line.paidAt)}</p>
                      {line.failureReason ?? line.payoutInstruction?.failureReason ? (
                        <p className="text-amber-700">
                          {line.failureReason ?? line.payoutInstruction?.failureReason}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CabinetSurface>
        </div>
      </div>
    </div>
  );
}

function formatPayoutFrequency(value: string) {
  const labels: Record<string, string> = {
    monthly: 'ежемесячные выплаты',
    quarterly: 'ежеквартальные выплаты',
    at_maturity: 'выплата в конце срока',
  };

  return labels[value] ?? value;
}

function InvestmentActions({
  applicationId,
  amount,
  confirmArmed,
  confirmLocked,
  confirmPending,
  agreementPending,
  onOpenAgreement,
  onStartConfirm,
  onCancelConfirm,
  onConfirm,
  align,
}: {
  applicationId: string;
  amount: number;
  confirmArmed: boolean;
  confirmLocked: boolean;
  confirmPending: boolean;
  agreementPending: boolean;
  onOpenAgreement: () => Promise<void>;
  onStartConfirm: () => void;
  onCancelConfirm: () => void;
  onConfirm: () => Promise<void>;
  align: 'start' | 'end';
}) {
  const baseActions = (
    <div className={`flex flex-wrap gap-2 ${align === 'end' ? 'justify-end' : ''}`}>
      <Button
        variant="outline"
        className="rounded-lg"
        disabled={agreementPending}
        onClick={() => void onOpenAgreement()}
      >
        <FileText className="h-4 w-4" />
        Договор
      </Button>
      <Button
        className="rounded-lg"
        disabled={confirmPending || confirmLocked}
        onClick={onStartConfirm}
      >
        <Wallet className="h-4 w-4" />
        {confirmLocked ? 'Подтверждено' : 'Подтвердить'}
      </Button>
    </div>
  );

  if (!confirmArmed || confirmLocked) {
    return baseActions;
  }

  return (
    <div
      className={`space-y-3 rounded-[18px] border border-amber-200 bg-amber-50 px-3 py-3 text-left ${align === 'end' ? 'ml-auto max-w-[24rem]' : ''}`}
      aria-live="polite"
      data-testid={`investment-confirmation-${applicationId}`}
    >
      <p className="text-sm font-semibold text-amber-950">Подтвердить участие</p>
      <p className="text-sm leading-relaxed text-amber-900">
        С кошелька будет списано {formatMoney(amount)}. Проверьте сумму и подтвердите действие.
      </p>
      <div className={`flex flex-wrap gap-2 ${align === 'end' ? 'justify-end' : ''}`}>
        <Button
          variant="outline"
          className="rounded-lg"
          disabled={agreementPending || confirmPending}
          onClick={() => void onOpenAgreement()}
        >
          <FileText className="h-4 w-4" />
          Открыть договор
        </Button>
        <Button className="rounded-lg" disabled={confirmPending} onClick={() => void onConfirm()}>
          <Wallet className="h-4 w-4" />
          {confirmPending ? 'Подтверждаем…' : 'Подтвердить списание'}
        </Button>
        <Button variant="outline" className="rounded-lg" disabled={confirmPending} onClick={onCancelConfirm}>
          Отмена
        </Button>
      </div>
    </div>
  );
}
