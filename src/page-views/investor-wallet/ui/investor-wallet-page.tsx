'use client';

import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDashboardQuery } from '@/entities/cabinet/api/hooks';
import { formatMoney } from '@/shared/lib/format';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';

export default function InvestorWalletPage() {
  const dashboardQuery = useDashboardQuery();
  const dashboard = dashboardQuery.data?.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Кошелек</h1>
          <p className="mt-1 text-sm text-brand-text-muted">Управление средствами и история операций</p>
        </div>
      </div>

      {dashboard && dashboard.summary.walletBalance > 0 ? (
        <div className="cabinet-card shadow-none">
          <div className="p-12 text-center">
            <h3 className="mb-2 text-lg font-semibold text-brand-text">Баланс кошелька</h3>
            <p className="mb-6 text-3xl font-bold tracking-tight text-brand-text">{formatMoney(dashboard.summary.walletBalance)}</p>
            <p className="text-sm text-brand-text-muted">Детальная операционная история будет встроена в этот экран без изменения структуры референса.</p>
          </div>
        </div>
      ) : (
        <AppEmptyState
          icon={Wallet}
          title="Кошелек пуст"
          description="Пополните кошелек, чтобы начать инвестировать в проекты платформы."
          action={(
            <Button className="border border-brand-primary bg-brand-primary text-white hover:bg-brand-primary/90">
              Пополнить кошелек
            </Button>
          )}
        />
      )}
    </div>
  );
}
