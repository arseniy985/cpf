import type { OwnerRoundAllocation } from '@/entities/owner-round/api/types';
import { formatDateTime, formatMoney } from '@/shared/lib/format';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/shared/ui/status-badge';

export function OwnerRoundAllocationsTable({ allocations }: { allocations: OwnerRoundAllocation[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Инвестор</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead>Раунд</TableHead>
          <TableHead>Дата</TableHead>
          <TableHead className="text-right">Сумма</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allocations.map((allocation) => (
          <TableRow key={allocation.id}>
            <TableCell>
              <div className="min-w-0">
                <p className="font-medium text-cabinet-ink">{allocation.investorName ?? 'Инвестор платформы'}</p>
                <p className="mt-1 truncate text-xs text-cabinet-muted-ink">{allocation.investorEmail ?? 'Email не указан'}</p>
              </div>
            </TableCell>
            <TableCell>
              <StatusBadge status={allocation.status} />
            </TableCell>
            <TableCell>
              <div>
                <p className="font-medium text-cabinet-ink">{allocation.round.title}</p>
                <p className="mt-1 text-xs text-cabinet-muted-ink">{allocation.round.projectTitle ?? 'Текущий объект'}</p>
              </div>
            </TableCell>
            <TableCell>{formatDateTime(allocation.allocatedAt)}</TableCell>
            <TableCell className="text-right font-mono font-medium text-cabinet-ink">{formatMoney(allocation.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
