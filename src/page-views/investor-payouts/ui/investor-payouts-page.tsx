'use client';

import Link from 'next/link';
import { PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboardQuery } from '@/entities/cabinet/api/hooks';
import { formatDate, formatMoney } from '@/shared/lib/format';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';
import { AppStatusBadge } from '@/shared/ui/app-cabinet/app-status-badge';

export default function InvestorPayoutsPage() {
  const dashboardQuery = useDashboardQuery();
  const distributionLines = dashboardQuery.data?.data.distributionLines ?? [];
  const hasPayouts = distributionLines.length > 0;
  const totalExpected = distributionLines.reduce((sum, line) => sum + line.amount, 0);
  const paidCount = distributionLines.filter((line) => Boolean(line.paidAt)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Выплаты и доход</h1>
          <p className="mt-1 text-sm text-brand-text-muted">График платежей и история начислений</p>
        </div>
      </div>

      {hasPayouts ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-sm border border-[#E2E8F0] bg-white p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-brand-text-muted">Ожидается всего</p>
              <p className="mt-2 text-2xl font-semibold text-brand-text">{formatMoney(totalExpected)}</p>
            </div>
            <div className="rounded-sm border border-[#E2E8F0] bg-white p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-brand-text-muted">Уже выплачено</p>
              <p className="mt-2 text-2xl font-semibold text-brand-text">{paidCount}</p>
            </div>
            <div className="rounded-sm border border-[#E2E8F0] bg-white p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-brand-text-muted">В ожидании</p>
              <p className="mt-2 text-2xl font-semibold text-brand-text">{distributionLines.length - paidCount}</p>
            </div>
          </div>

          <div className="cabinet-card shadow-none">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] p-6 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-brand-text">График начислений</h3>
                <p className="mt-1 text-sm text-brand-text-muted">По каждой выплате видно проект, сумму, дату перевода и текущий статус.</p>
              </div>
            </div>
            <div className="divide-y divide-[#E2E8F0]">
              {distributionLines.map((line) => (
                <div key={line.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-brand-text">{line.allocation.round.projectTitle}</p>
                    <p className="mt-1 text-xs text-brand-text-muted">
                      Раунд: {line.allocation.round.title} • Инвестиция: {formatMoney(line.allocation.amount)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 text-left sm:items-end sm:text-right">
                    <p className="text-sm font-semibold text-brand-text">{formatMoney(line.amount)}</p>
                    <p className="text-xs text-brand-text-muted">
                      {line.paidAt ? `Переведено ${formatDate(line.paidAt)}` : 'Дата выплаты уточняется'}
                    </p>
                    <AppStatusBadge status={line.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <AppEmptyState
          icon={PieChart}
          title="Нет ожидаемых выплат"
          description="У вас пока нет активных инвестиций, по которым ожидаются выплаты."
          action={(
            <Button asChild className="border border-brand-primary bg-brand-primary text-white hover:bg-brand-primary/90">
              <Link href="/app/projects">Перейти к проектам</Link>
            </Button>
          )}
        />
      )}
    </div>
  );
}
