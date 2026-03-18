'use client';

import { PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboardQuery } from '@/entities/cabinet/api/hooks';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';

export default function InvestorPayoutsPage() {
  const dashboardQuery = useDashboardQuery();
  const hasPayouts = (dashboardQuery.data?.data.distributionLines.length ?? 0) > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Выплаты и доход</h1>
          <p className="mt-1 text-sm text-brand-text-muted">График платежей и история начислений</p>
        </div>
      </div>
      {hasPayouts ? (
        <div className="cabinet-card shadow-none">
          <div className="p-12 text-center">
            <h3 className="mb-2 text-lg font-semibold text-brand-text">Выплаты найдены</h3>
            <p className="text-sm text-brand-text-muted">Детальная история будет выведена в той же визуальной системе референса.</p>
          </div>
        </div>
      ) : (
        <AppEmptyState
          icon={PieChart}
          title="Нет ожидаемых выплат"
          description="У вас пока нет активных инвестиций, по которым ожидаются выплаты."
          action={(
            <Button className="border border-brand-primary bg-brand-primary text-white hover:bg-brand-primary/90">
              Перейти к проектам
            </Button>
          )}
        />
      )}
    </div>
  );
}
