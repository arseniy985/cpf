import { formatDate, formatMoney, formatPercent } from '@/shared/lib/format';
import { getStatusMeta } from '@/shared/lib/app-cabinet/status';
import type { InvestmentApplication } from '@/entities/cabinet/api/types';

function escapeCsvValue(value: string) {
  const normalized = value.replaceAll('"', '""');

  return `"${normalized}"`;
}

export function exportPortfolioToCsv(rows: InvestmentApplication[]) {
  const header = [
    'Проект',
    'Сумма',
    'Статус',
    'Дата заявки',
    'Доходность',
    'Срок',
  ];

  const body = rows.map((item) => [
    item.project.title,
    formatMoney(item.amount),
    getStatusMeta(item.status === 'confirmed' ? 'approved' : item.status).label,
    formatDate(item.createdAt),
    formatPercent(item.project.targetYield),
    `${item.project.termMonths} мес.`,
  ]);

  const csv = [header, ...body]
    .map((row) => row.map((value) => escapeCsvValue(value)).join(';'))
    .join('\n');

  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = `portfolio-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
