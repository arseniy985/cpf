'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Wallet } from 'lucide-react';
import { useConfirmInvestmentMutation, useDashboardQuery, useInvestmentAgreementMutation } from '@/entities/cabinet/api/hooks';
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
        eyebrow="Портфель"
        title="Портфель и заявки"
        description="Полный цикл инвестиционной заявки: от подачи до подтверждения участия и получения документов."
        actions={(
          <Link href="/projects">
            <Button className="rounded-lg">Выбрать проект</Button>
          </Link>
        )}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CabinetStatCard label="Всего заявок" value={String(dashboard.summary.applicationsCount)} />
        <CabinetStatCard label="Подтверждено" value={formatMoney(dashboard.summary.approvedAmount)} />
        <CabinetStatCard label="На рассмотрении" value={formatMoney(dashboard.summary.pendingAmount)} />
        <CabinetStatCard label="Портфель" value={formatMoney(dashboard.summary.portfolioAmount)} />
      </div>

      <CabinetSurface
        title="Список участий"
        description="Рабочая таблица по всем активным и прошлым заявкам."
      >
        {dashboard.applications.length === 0 ? (
          <CabinetEmptyState
            title="Заявок пока нет"
            description="Откройте каталог, выберите проект и отправьте первую инвестиционную заявку."
            action={(
              <Link href="/projects">
                <Button className="rounded-lg">Открыть каталог</Button>
              </Link>
            )}
          />
        ) : (
          <>
            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Проект</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Создано</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboard.applications.map((application) => {
                    const confirmLocked = handledIds.includes(application.id) || application.status === 'confirmed';

                    return (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-950">{application.project.title}</p>
                            <p className="mt-1 text-sm text-slate-500">{application.project.location}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={application.status} />
                        </TableCell>
                        <TableCell>{formatMoney(application.amount)}</TableCell>
                        <TableCell>{formatDateTime(application.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              className="rounded-lg"
                              disabled={agreementMutation.isPending}
                              onClick={async () => {
                                try {
                                  const response = await agreementMutation.mutateAsync({ id: application.id });
                                  window.open(response.data.agreementUrl, '_blank', 'noopener,noreferrer');
                                } catch {
                                  return;
                                }
                              }}
                            >
                              <FileText className="h-4 w-4" />
                              Договор
                            </Button>
                            <Button
                              className="rounded-lg"
                              disabled={confirmMutation.isPending || confirmLocked || application.status === 'rejected'}
                              onClick={async () => {
                                try {
                                  await confirmMutation.mutateAsync({ id: application.id });
                                  setHandledIds((current) => [...current, application.id]);
                                } catch {
                                  return;
                                }
                              }}
                            >
                              <Wallet className="h-4 w-4" />
                              {confirmLocked ? 'Подтверждено' : 'Подтвердить'}
                            </Button>
                          </div>
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

                return (
                  <div key={application.id} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-slate-950">{application.project.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{application.project.location}</p>
                      </div>
                      <StatusBadge status={application.status} />
                    </div>
                    <div className="mt-4 grid gap-2 text-sm text-slate-600">
                      <p>Сумма: {formatMoney(application.amount)}</p>
                      <p>Создано: {formatDateTime(application.createdAt)}</p>
                    </div>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <Button
                        variant="outline"
                        className="rounded-lg"
                        disabled={agreementMutation.isPending}
                        onClick={async () => {
                          try {
                            const response = await agreementMutation.mutateAsync({ id: application.id });
                            window.open(response.data.agreementUrl, '_blank', 'noopener,noreferrer');
                          } catch {
                            return;
                          }
                        }}
                      >
                        <FileText className="h-4 w-4" />
                        Договор
                      </Button>
                      <Button
                        className="rounded-lg"
                        disabled={confirmMutation.isPending || confirmLocked || application.status === 'rejected'}
                        onClick={async () => {
                          try {
                            await confirmMutation.mutateAsync({ id: application.id });
                            setHandledIds((current) => [...current, application.id]);
                          } catch {
                            return;
                          }
                        }}
                      >
                        <Wallet className="h-4 w-4" />
                        {confirmLocked ? 'Подтверждено' : 'Подтвердить'}
                      </Button>
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
    </div>
  );
}
