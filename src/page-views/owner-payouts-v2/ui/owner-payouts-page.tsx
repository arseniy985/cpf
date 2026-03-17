'use client';

import { useOwnerPayoutsQuery, useOwnerRoundsQuery } from '@/entities/owner-round/api/hooks';
import { formatMoney } from '@/shared/lib/format';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';
import { AppKpiCard } from '@/shared/ui/app-cabinet/app-kpi-card';
import { AppPageHeader } from '@/shared/ui/app-cabinet/app-page-header';
import { AppStatusBadge } from '@/shared/ui/app-cabinet/app-status-badge';
import { AppSurface } from '@/shared/ui/app-cabinet/app-surface';

export default function OwnerPayoutsPageV2() {
  const payoutsQuery = useOwnerPayoutsQuery();
  const roundsQuery = useOwnerRoundsQuery();
  const payouts = payoutsQuery.data?.data ?? [];
  const rounds = roundsQuery.data?.data ?? [];

  return (
    <div className="space-y-6">
      <AppPageHeader
        eyebrow="Owner workspace"
        title="Выплаты владельца"
        description="Календарь выплат, начисления по периодам, реестр получателей, статусы согласования и ошибки ручной обработки."
      />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <AppKpiCard label="Всего инструкций" value={String(payouts.length)} hint="Все owner payout instructions в текущем контуре." />
        <AppKpiCard label="В обработке" value={String(payouts.filter((item) => ['pending', 'pending_review', 'approved'].includes(item.status)).length)} hint="Платежи, которым ещё требуется подтверждение или запуск." tone="warning" />
        <AppKpiCard label="Завершено" value={String(payouts.filter((item) => ['paid', 'completed'].includes(item.status)).length)} hint="Успешно проведённые выплаты." tone="success" />
        <AppKpiCard label="Раунды с выплатами" value={String(rounds.filter((round) => round.distributionCount > 0).length)} hint="Раунды, по которым уже есть хотя бы одно распределение." />
      </div>

      <AppSurface eyebrow="Реестр" title="Реестр выплат" description="Плоский служебный список для мониторинга распределений, ошибок и ручной обработки.">
        {payouts.length ? (
          <div className="space-y-3">
            {payouts.map((payout) => (
              <div key={payout.id} className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-app-cabinet-text">{payout.referenceLabel ?? payout.distributionTitle ?? 'Owner payout'}</p>
                    <p className="mt-1 text-sm text-app-cabinet-muted">{formatMoney(payout.amount, payout.currency)} · {payout.gateway}</p>
                    <p className="mt-2 text-sm leading-6 text-app-cabinet-muted">{payout.failureReason ?? 'Без замечаний по обработке.'}</p>
                  </div>
                  <AppStatusBadge status={payout.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AppEmptyState title="Выплат пока нет" description="Когда owner-раунды перейдут к распределениям, здесь появится реестр выплат и ошибки обработки." />
        )}
      </AppSurface>
    </div>
  );
}
