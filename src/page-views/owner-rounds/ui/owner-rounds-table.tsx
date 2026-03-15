'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { OwnerRound } from '@/entities/owner-round/api/types';
import { formatDate, formatMoney, formatPercent } from '@/shared/lib/format';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/shared/ui/status-badge';

export function OwnerRoundsTable({ rounds }: { rounds: OwnerRound[] }) {
  return (
    <>
      <div className="hidden xl:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Раунд</TableHead>
              <TableHead>Объект</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Сбор</TableHead>
              <TableHead>Условия</TableHead>
              <TableHead>Окно</TableHead>
              <TableHead className="text-right">Открыть</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rounds.map((round) => (
              <TableRow key={round.id}>
                <TableCell>
                  <div className="min-w-0">
                    <p className="font-medium text-cabinet-ink">{round.title}</p>
                    <p className="mt-1 truncate text-xs text-cabinet-muted-ink">{round.slug}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="min-w-0">
                    <p className="font-medium text-cabinet-ink">{round.projectTitle ?? 'Объект компании'}</p>
                    <p className="mt-1 text-xs text-cabinet-muted-ink">{round.projectSlug ?? round.projectId}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={round.status} />
                </TableCell>
                <TableCell>
                  <p className="font-medium text-cabinet-ink">
                    {formatMoney(round.currentAmount)} / {formatMoney(round.targetAmount)}
                  </p>
                  <p className="mt-1 text-xs text-cabinet-muted-ink">
                    {round.allocationCount} участников · {round.distributionCount} реестров выплат
                  </p>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-cabinet-ink">{formatPercent(round.targetYield)}</p>
                  <p className="mt-1 text-xs text-cabinet-muted-ink">
                    от {formatMoney(round.minInvestment)} · {round.termMonths} мес
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-cabinet-ink">{formatDate(round.opensAt)}</p>
                  <p className="mt-1 text-xs text-cabinet-muted-ink">до {formatDate(round.closesAt)}</p>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/owner/rounds/${round.slug}`}>
                    <Button variant="outline" className="rounded-full border-cabinet-border bg-cabinet-panel-strong">
                      Открыть
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 xl:hidden">
        {rounds.map((round) => (
          <div key={round.id} className="rounded-[24px] border border-cabinet-border bg-cabinet-panel px-4 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium text-cabinet-ink">{round.title}</p>
                <p className="mt-1 text-sm text-cabinet-muted-ink">{round.projectTitle ?? 'Объект компании'}</p>
              </div>
              <StatusBadge status={round.status} />
            </div>
            <div className="mt-4 grid gap-2 text-sm text-cabinet-muted-ink">
              <p>Сбор: {formatMoney(round.currentAmount)} / {formatMoney(round.targetAmount)}</p>
              <p>Условия: {formatPercent(round.targetYield)} · от {formatMoney(round.minInvestment)}</p>
              <p>Окно: {formatDate(round.opensAt)} → {formatDate(round.closesAt)}</p>
            </div>
            <div className="mt-4">
              <Link href={`/owner/rounds/${round.slug}`}>
                <Button variant="outline" className="w-full rounded-full border-cabinet-border bg-cabinet-panel-strong">
                  Открыть Раунд
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
