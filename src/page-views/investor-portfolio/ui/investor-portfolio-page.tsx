'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { FileStack, History, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useDashboardQuery, useInvestmentsQuery } from '@/entities/cabinet/api/hooks';
import type { InvestmentApplication } from '@/entities/cabinet/api/types';
import { InvestmentApplicationForm } from '@/features/app-forms/ui/investment-application-form';
import { formatDate, formatDateTime, formatMoney, formatPercent } from '@/shared/lib/format';
import { AppDataTable } from '@/shared/ui/app-cabinet/app-data-table';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';
import { AppPageHeader } from '@/shared/ui/app-cabinet/app-page-header';
import { AppStatusBadge } from '@/shared/ui/app-cabinet/app-status-badge';
import { AppSurface } from '@/shared/ui/app-cabinet/app-surface';
import { AppTimeline } from '@/shared/ui/app-cabinet/app-timeline';

const statusFilters = ['all', 'draft', 'pending', 'approved', 'rejected', 'cancelled', 'completed'] as const;

export default function InvestorPortfolioPage() {
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilters)[number]>('all');
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const investmentsQuery = useInvestmentsQuery();
  const dashboardQuery = useDashboardQuery();

  const investments = investmentsQuery.data?.data ?? [];
  const dashboard = dashboardQuery.data?.data;

  const rows = investments.filter((item) => {
    const matchesStatus = statusFilter === 'all' ? true : item.status === statusFilter;
    const matchesSearch = search
      ? item.project.title.toLowerCase().includes(search.toLowerCase())
      : true;

    return matchesStatus && matchesSearch;
  });

  const columns: Array<ColumnDef<InvestmentApplication>> = [
    {
      accessorKey: 'project.title',
      header: 'Проект',
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="font-semibold text-app-cabinet-text">{row.original.project.title}</p>
          <p className="mt-1 text-sm text-app-cabinet-muted">{row.original.round?.title ?? 'Раунд не указан'}</p>
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Сумма',
      cell: ({ row }) => formatMoney(row.original.amount),
    },
    {
      accessorKey: 'createdAt',
      header: 'Дата',
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: 'yield',
      header: 'Доходность',
      cell: ({ row }) => formatPercent(row.original.project.targetYield),
    },
    {
      id: 'term',
      header: 'Срок',
      cell: ({ row }) => `${row.original.project.termMonths} мес`,
    },
    {
      accessorKey: 'status',
      header: 'Статус',
      cell: ({ row }) => <AppStatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="h-9 rounded-none border-app-cabinet-border bg-app-cabinet-surface px-3 text-app-cabinet-text">
            <Link href="/app/investor/documents">
              <FileStack className="h-4 w-4" />
              Документы
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-9 rounded-none border-app-cabinet-border bg-app-cabinet-surface px-3 text-app-cabinet-text">
            <Link href="/app/investor/payouts">
              <History className="h-4 w-4" />
              История
            </Link>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AppPageHeader
        eyebrow="Investor workspace"
        title="Портфель"
        description="Все инвестиции и заявки собраны в одном списке. На desktop используется таблица, на mobile — карточки с теми же действиями."
        actions={(
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-11 rounded-none bg-app-cabinet-primary px-4 text-white hover:bg-app-cabinet-primary-strong">
                <Plus className="h-4 w-4" />
                Новая заявка
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-none border-app-cabinet-border p-0 sm:max-w-2xl">
              <div className="bg-app-cabinet-surface p-6">
                <DialogHeader>
                  <DialogTitle className="font-sans text-2xl font-semibold text-app-cabinet-text">Новая инвестиционная заявка</DialogTitle>
                  <DialogDescription className="text-app-cabinet-muted">
                    Выберите проект, сумму и подтвердите ознакомление с документами.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-6">
                  <InvestmentApplicationForm onSuccess={() => setDialogOpen(false)} />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      />

      <AppSurface eyebrow="Фильтры" title="Отберите позиции по статусу и проекту" description="Поиск работает по названию проекта. История изменений доступна по каждой позиции.">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((status) => (
              <button
                key={status}
                type="button"
                className={statusFilter === status
                  ? 'border border-app-cabinet-primary bg-app-cabinet-primary px-3 py-2 text-sm font-semibold text-white'
                  : 'border border-app-cabinet-border bg-app-cabinet-surface px-3 py-2 text-sm font-semibold text-app-cabinet-text'}
                onClick={() => setStatusFilter(status)}
              >
                {status === 'all' ? 'Все статусы' : status}
              </button>
            ))}
          </div>
          <label className="flex h-11 w-full max-w-sm items-center border border-app-cabinet-border bg-app-cabinet-surface px-4">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Поиск по проекту…"
              className="h-auto border-0 bg-transparent px-0 py-0 shadow-none focus-visible:ring-0"
              autoComplete="off"
            />
          </label>
        </div>
      </AppSurface>

      <div className="hidden xl:block">
        <AppSurface eyebrow="Таблица" title="Позиции портфеля" description="Проект, сумма, дата, доходность, срок, статус, документы и действия собраны в одном табличном представлении.">
          <AppDataTable
            data={rows}
            columns={columns}
            emptyTitle="Позиции не найдены"
            emptyDescription="Измените фильтр или создайте первую инвестиционную заявку."
          />
        </AppSurface>
      </div>

      <div className="space-y-4 xl:hidden">
        {rows.length ? rows.map((item) => (
          <AppSurface
            key={item.id}
            eyebrow={item.round?.title ?? 'Раунд не указан'}
            title={item.project.title}
            description={`${formatMoney(item.amount)} · ${formatPercent(item.project.targetYield)} · ${item.project.termMonths} мес`}
            action={<AppStatusBadge status={item.status} />}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="border border-app-cabinet-border bg-app-cabinet-secondary/35 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-app-cabinet-muted">Дата</p>
                <p className="mt-2 text-sm font-semibold text-app-cabinet-text">{formatDate(item.createdAt)}</p>
              </div>
              <div className="border border-app-cabinet-border bg-app-cabinet-secondary/35 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-app-cabinet-muted">Документы</p>
                <p className="mt-2 text-sm font-semibold text-app-cabinet-text">{item.project.documents.length}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild variant="outline" className="h-10 rounded-none border-app-cabinet-border bg-app-cabinet-surface px-3 text-app-cabinet-text">
                <Link href="/app/investor/documents">Документы</Link>
              </Button>
              <Button asChild variant="outline" className="h-10 rounded-none border-app-cabinet-border bg-app-cabinet-surface px-3 text-app-cabinet-text">
                <Link href="/app/investor/payouts">История</Link>
              </Button>
            </div>
          </AppSurface>
        )) : (
          <AppEmptyState title="Портфель пока пуст" description="Создайте инвестиционную заявку, чтобы здесь появились активные позиции и история изменений." />
        )}
      </div>

      <AppSurface eyebrow="История изменений" title="Последние события по портфелю" description="Для каждой позиции доступна прозрачная история событий, статусов и контекстных действий.">
        {dashboard?.applications.length ? (
          <AppTimeline
            items={dashboard.applications.slice(0, 5).map((item) => ({
              id: item.id,
              title: `${item.project.title} · ${formatMoney(item.amount)}`,
              description: `Статус позиции: ${item.status}. Документы и дальнейшие действия доступны из карточки или раздела документов.`,
              meta: formatDateTime(item.createdAt),
              tone: item.status === 'approved' ? 'success' : item.status === 'rejected' ? 'warning' : 'default',
            }))}
          />
        ) : (
          <AppEmptyState title="История портфеля пока пуста" description="После первой заявки тут появится timeline изменений по позиции." />
        )}
      </AppSurface>
    </div>
  );
}
