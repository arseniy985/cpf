'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { AlertTriangle, BanknoteArrowDown, Clock3, Waypoints } from 'lucide-react';
import { useOwnerPayoutsQuery } from '@/entities/owner-payout/api/hooks';
import { useSession } from '@/features/session/model/use-session';
import { formatDateTime, formatMoney } from '@/shared/lib/format';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CabinetEmptyState } from '@/widgets/cabinet-workspace/ui/cabinet-empty-state';
import { CabinetPageHeader } from '@/widgets/cabinet-workspace/ui/cabinet-page-header';
import { CabinetStatCard } from '@/widgets/cabinet-workspace/ui/cabinet-stat-card';
import { CabinetSurface } from '@/widgets/cabinet-workspace/ui/cabinet-surface';
import { StatusBadge } from '@/shared/ui/status-badge';

export default function OwnerPayoutsPage() {
  const session = useSession();
  const payoutsQuery = useOwnerPayoutsQuery();

  if (!session.token) {
    return null;
  }

  if (payoutsQuery.isPending) {
    return (
      <CabinetEmptyState
        title="Загружаем очередь выплат…"
        description="Собираем операции, статусы и причины ручной обработки."
      />
    );
  }

  if (payoutsQuery.isError) {
    return (
      <CabinetEmptyState
        title="Очередь выплат недоступна"
        description="Не удалось загрузить очередь выплат. Попробуйте обновить страницу позже."
      />
    );
  }

  const payouts = payoutsQuery.data?.data ?? [];
  const manualQueue = payouts.filter((instruction) => instruction.status === 'manual_required');
  const processingQueue = payouts.filter((instruction) => instruction.status === 'processing');
  const succeeded = payouts.filter((instruction) => instruction.status === 'succeeded' || instruction.status === 'paid');
  const totalAmount = payouts.reduce((sum, instruction) => sum + instruction.amount, 0);

  return (
    <div className="space-y-6">
      <CabinetPageHeader
        eyebrow="Выплаты"
        title="Очередь выплат"
        description="Здесь видно, какие выплаты уже отправлены, какие обрабатываются и где нужно ваше внимание."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CabinetStatCard
          label="Всего выплат"
          value={String(payouts.length)}
          hint={formatMoney(totalAmount)}
          accent={<SignalIcon icon={<Waypoints className="h-5 w-5" />} />}
        />
        <CabinetStatCard
          label="Нужна проверка"
          value={String(manualQueue.length)}
          hint="Требуют ручной обработки"
          accent={<SignalIcon icon={<AlertTriangle className="h-5 w-5" />} />}
        />
        <CabinetStatCard
          label="В обработке"
          value={String(processingQueue.length)}
          hint="Выплата отправлена, ждем итоговый статус"
          accent={<SignalIcon icon={<Clock3 className="h-5 w-5" />} />}
        />
        <CabinetStatCard
          label="Успешно"
          value={String(succeeded.length)}
          hint="Проведенные и закрытые выплаты"
          accent={<SignalIcon icon={<BanknoteArrowDown className="h-5 w-5" />} />}
        />
      </div>

      {manualQueue.length > 0 ? (
        <CabinetSurface
          eyebrow="Нужно действие"
          title="Есть выплаты, требующие ручной обработки"
          description="Откройте реквизиты компании и проверьте, достаточно ли данных для автоматической или ручной выплаты."
          variant="subtle"
        >
          <div className="flex flex-col gap-4 rounded-[22px] border border-amber-200 bg-amber-50 px-4 py-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-amber-950">В очереди {manualQueue.length} выплат(ы) с ручной обработкой.</p>
              <p className="mt-1 text-sm leading-relaxed text-amber-900">
                Обычно это означает, что для выплаты не хватает реквизитов, либо операция требует ручной проверки команды.
              </p>
            </div>
            <Button asChild className="rounded-full">
              <Link href="/owner/organization">Проверить реквизиты</Link>
            </Button>
          </div>
        </CabinetSurface>
      ) : null}

      <CabinetSurface
        eyebrow="Список"
        title="Все выплаты"
        description="Проверяйте назначение выплаты, способ отправки и причину ручной обработки в одной таблице."
      >
        {payouts.length === 0 ? (
          <CabinetEmptyState
            title="Очередь пока пустая"
            description="После согласования реестра и запуска выплат здесь появятся все операции."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Реестр</TableHead>
                <TableHead>Назначение</TableHead>
                <TableHead>Способ</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Обработано</TableHead>
                <TableHead className="text-right">Сумма</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((instruction) => (
                <TableRow key={instruction.id}>
                  <TableCell>
                    <div className="min-w-0">
                      <p className="font-medium text-cabinet-ink">{instruction.distributionTitle ?? 'Выплата'}</p>
                      <p className="mt-1 truncate text-xs text-cabinet-muted-ink">{instruction.distributionId ?? instruction.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-cabinet-ink">{instruction.referenceLabel ?? 'Без подписи'}</p>
                      {instruction.failureReason ? (
                        <p className="mt-1 text-xs leading-relaxed text-amber-700">{instruction.failureReason}</p>
                      ) : (
                        <p className="mt-1 text-xs text-cabinet-muted-ink">{formatDirection(instruction.direction)}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-cabinet-muted-ink">{formatGateway(instruction.gateway)}</TableCell>
                  <TableCell>
                    <StatusBadge status={instruction.status} />
                  </TableCell>
                  <TableCell>{formatDateTime(instruction.processedAt)}</TableCell>
                  <TableCell className="text-right font-mono font-medium text-cabinet-ink">
                    {formatMoney(instruction.amount, instruction.currency)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CabinetSurface>
    </div>
  );
}

function formatGateway(gateway: string) {
  if (gateway === 'yookassa_payout') {
    return 'YooKassa';
  }

  if (gateway === 'manual') {
    return 'Ручная обработка';
  }

  return gateway;
}

function formatDirection(direction: string) {
  if (direction === 'investor_distribution') {
    return 'Выплата инвестору';
  }

  return direction;
}

function SignalIcon({ icon }: { icon: ReactNode }) {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cabinet-ink text-cabinet-panel-strong shadow-[0_16px_35px_rgba(31,50,66,0.22)]">
      {icon}
    </div>
  );
}
