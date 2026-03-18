'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useOwnerRoundsQuery } from '@/entities/owner-round/api/hooks';
import { OwnerRoundFormPanel } from '@/features/app-forms/ui/owner-round-form-panel';
import { formatMoney, formatPercent } from '@/shared/lib/format';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';
import { AppPageHeader } from '@/shared/ui/app-cabinet/app-page-header';
import { AppStatusBadge } from '@/shared/ui/app-cabinet/app-status-badge';
import { AppSurface } from '@/shared/ui/app-cabinet/app-surface';

export default function OwnerRoundsPageV2() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(searchParams.get('dialog') === 'create');
  const roundsQuery = useOwnerRoundsQuery();
  const rounds = roundsQuery.data?.data ?? [];

  useEffect(() => {
    setDialogOpen(searchParams.get('dialog') === 'create');
  }, [searchParams]);

  function handleDialogChange(nextOpen: boolean) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextOpen) {
      params.set('dialog', 'create');
    } else {
      params.delete('dialog');
    }

    router.replace(params.size ? `${pathname}?${params.toString()}` : pathname, { scroll: false });
  }

  return (
    <div className="space-y-6">
      <AppPageHeader
        eyebrow="Кабинет владельца"
        title="Раунды привлечения"
        description="Раунды показывают условия размещения, прогресс сбора, лимиты, статусы проверки и дальнейшие действия."
        actions={(
          <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
              <Button className="h-11 rounded-full bg-app-cabinet-primary px-4 text-white hover:bg-app-cabinet-primary-strong">
                Новый раунд
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[1.75rem] border-app-cabinet-border p-0 sm:max-w-3xl">
              <div className="bg-app-cabinet-surface p-6">
                <DialogHeader>
                  <DialogTitle className="font-sans text-2xl font-semibold text-app-cabinet-text">Новый раунд</DialogTitle>
                  <DialogDescription className="text-app-cabinet-muted">Сначала сохраняется черновик раунда. Затем к нему подключаются документы, статусы проверки и действия публикации.</DialogDescription>
                </DialogHeader>
                <div className="mt-6">
                  <OwnerRoundFormPanel onSuccess={() => handleDialogChange(false)} />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      />

      {rounds.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {rounds.map((round) => (
            <AppSurface
              key={round.id}
              eyebrow={round.projectTitle ?? 'Проект не указан'}
              title={round.title}
              description={`${formatMoney(round.currentAmount)} из ${formatMoney(round.targetAmount)} · ${formatPercent(round.targetYield)} · ${round.termMonths} мес`}
              action={<AppStatusBadge status={round.status} />}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="border border-app-cabinet-border bg-app-cabinet-secondary/35 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-app-cabinet-muted">Минимальный вход</p>
                  <p className="mt-2 text-sm font-semibold text-app-cabinet-text">{formatMoney(round.minInvestment)}</p>
                </div>
                <div className="border border-app-cabinet-border bg-app-cabinet-secondary/35 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-app-cabinet-muted">Аллокации</p>
                  <p className="mt-2 text-sm font-semibold text-app-cabinet-text">{round.allocationCount}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild className="h-10 rounded-full bg-app-cabinet-primary px-3 text-white hover:bg-app-cabinet-primary-strong">
                  <Link href={`/app/owner/rounds/${round.slug}`}>Открыть раунд</Link>
                </Button>
              </div>
            </AppSurface>
          ))}
        </div>
      ) : (
        <AppEmptyState title="Раундов пока нет" description="Создайте первый раунд, чтобы работать с заявками, проверкой и выплатами." />
      )}
    </div>
  );
}
