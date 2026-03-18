'use client';

import { useMemo, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOwnerRoundQuery, useOwnerRoundsQuery } from '@/entities/owner-round/api/hooks';
import { formatMoney } from '@/shared/lib/format';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';
import { AppPageHeader } from '@/shared/ui/app-cabinet/app-page-header';
import { AppStatusBadge } from '@/shared/ui/app-cabinet/app-status-badge';
import { AppSurface } from '@/shared/ui/app-cabinet/app-surface';

export default function OwnerAllocationsPageV2() {
  const roundsQuery = useOwnerRoundsQuery();
  const rounds = roundsQuery.data?.data ?? [];
  const [selectedRoundSlug, setSelectedRoundSlug] = useState<string>('');
  const effectiveSlug = selectedRoundSlug || rounds[0]?.slug || null;
  const roundQuery = useOwnerRoundQuery(undefined, effectiveSlug);

  const allocations = useMemo(
    () => roundQuery.data?.data.allocations ?? [],
    [roundQuery.data?.data.allocations],
  );

  return (
    <div className="space-y-6">
      <AppPageHeader
        eyebrow="Кабинет владельца"
        title="Инвесторы и аллокации"
        description="Страница собирает заявки инвесторов, подтверждённые аллокации, отмены и историю обработки по выбранному раунду."
      />

      <AppSurface eyebrow="Выбор раунда" title="Раунд для просмотра" description="Список заявок и распределений переключается в зависимости от выбранного раунда." tone="secondary">
        {rounds.length ? (
          <div className="max-w-md">
            <Select value={effectiveSlug ?? ''} onValueChange={setSelectedRoundSlug}>
              <SelectTrigger className="rounded-2xl border-app-cabinet-border shadow-none">
                <SelectValue placeholder="Выберите раунд…" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-app-cabinet-border">
                {rounds.map((round) => (
                  <SelectItem key={round.id} value={round.slug}>
                    {round.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <AppEmptyState title="Раундов пока нет" description="Создайте раунд, чтобы открыть раздел заявок и распределений." />
        )}
      </AppSurface>

      <AppSurface eyebrow="Список" title="Заявки инвесторов и аллокации" description="Здесь показываются статусы обработки, подтверждения, отмены и комментарии без лишних приватных деталей.">
        {allocations.length ? (
          <div className="space-y-3">
            {allocations.map((allocation) => (
              <div key={allocation.id} className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-app-cabinet-text">{allocation.investorName ?? allocation.investorEmail ?? 'Инвестор'}</p>
                    <p className="mt-1 text-sm text-app-cabinet-muted">{formatMoney(allocation.amount)} · {allocation.round.title}</p>
                    <p className="mt-2 text-sm leading-6 text-app-cabinet-muted">{allocation.agreementUrl ? 'Договор доступен в контексте аллокации.' : 'Договор пока не приложен.'}</p>
                  </div>
                  <AppStatusBadge status={allocation.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AppEmptyState title="Аллокации пока не найдены" description="Выберите другой раунд или дождитесь первых заявок инвесторов." />
        )}
      </AppSurface>
    </div>
  );
}
