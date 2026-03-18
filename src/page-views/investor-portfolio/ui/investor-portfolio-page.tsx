'use client';

import Link from 'next/link';
import { type ReactNode, useState } from 'react';
import { ArrowRight, Download, FileText, Filter, History, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInvestmentsQuery } from '@/entities/cabinet/api/hooks';
import type { InvestmentApplication } from '@/entities/cabinet/api/types';
import { formatDate, formatMoney, formatPercent } from '@/shared/lib/format';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';
import { AppStatusBadge } from '@/shared/ui/app-cabinet/app-status-badge';
import { exportPortfolioToCsv } from '../lib/export-portfolio-to-csv';

type FilterValue = 'all' | 'active' | 'pending' | 'completed';
type FundingFilterValue = 'all' | 'collecting' | 'closed';
type TermFilterValue = 'all' | 'up_to_18' | 'from_19';

function getPortfolioStatus(item: InvestmentApplication): Exclude<FilterValue, 'all'> {
  if (item.status === 'approved' || item.status === 'confirmed') {
    return 'active';
  }

  if (item.status === 'completed') {
    return 'completed';
  }

  return 'pending';
}

export default function InvestorPortfolioPage() {
  const [filter, setFilter] = useState<FilterValue>('all');
  const [fundingFilter, setFundingFilter] = useState<FundingFilterValue>('all');
  const [termFilter, setTermFilter] = useState<TermFilterValue>('all');
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const investmentsQuery = useInvestmentsQuery();
  const investments = investmentsQuery.data?.data ?? [];
  const rows = investments.filter((item) => {
    const statusMatch = filter === 'all' ? true : getPortfolioStatus(item) === filter;
    const fundingMatch = fundingFilter === 'all'
      ? true
      : fundingFilter === 'collecting'
        ? item.project.fundingStatus !== 'closed'
        : item.project.fundingStatus === 'closed';
    const termMatch = termFilter === 'all'
      ? true
      : termFilter === 'up_to_18'
        ? item.project.termMonths <= 18
        : item.project.termMonths >= 19;

    return statusMatch && fundingMatch && termMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Портфель</h1>
          <p className="mt-1 text-sm text-brand-text-muted">Управление инвестициями и заявками</p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="gap-2 border-slate-200 bg-white text-brand-primary hover:bg-brand-secondary"
            onClick={() => exportPortfolioToCsv(rows)}
            disabled={rows.length === 0}
          >
            <Download className="h-4 w-4" />
            Экспорт CSV
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 rounded-sm border border-[#E2E8F0] bg-white p-4 sm:flex-row">
        <div className="flex w-full items-center gap-2 overflow-x-auto pb-2 sm:w-auto sm:pb-0">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={filter === 'all'
              ? 'cursor-pointer whitespace-nowrap rounded-full border border-transparent bg-brand-primary px-3 py-1 text-xs font-semibold text-white'
              : 'cursor-pointer whitespace-nowrap rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-brand-text'}
          >
            Все ({investments.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('active')}
            className={filter === 'active'
              ? 'cursor-pointer whitespace-nowrap rounded-full border border-transparent bg-brand-primary px-3 py-1 text-xs font-semibold text-white'
              : 'cursor-pointer whitespace-nowrap rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-brand-text'}
          >
            Активные ({investments.filter((item) => getPortfolioStatus(item) === 'active').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={filter === 'pending'
              ? 'cursor-pointer whitespace-nowrap rounded-full border border-transparent bg-brand-primary px-3 py-1 text-xs font-semibold text-white'
              : 'cursor-pointer whitespace-nowrap rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-brand-text'}
          >
            Заявки ({investments.filter((item) => getPortfolioStatus(item) === 'pending').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={filter === 'completed'
              ? 'cursor-pointer whitespace-nowrap rounded-full border border-transparent bg-brand-primary px-3 py-1 text-xs font-semibold text-white'
              : 'cursor-pointer whitespace-nowrap rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-brand-text'}
          >
            Завершённые ({investments.filter((item) => getPortfolioStatus(item) === 'completed').length})
          </button>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-brand-text-muted sm:w-auto sm:justify-center"
          onClick={() => setAdvancedFiltersOpen((current) => !current)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Фильтры
        </Button>
      </div>

      {advancedFiltersOpen ? (
        <div className="grid gap-3 rounded-sm border border-[#E2E8F0] bg-white p-4 md:grid-cols-3">
          <FilterGroup
            icon={<Filter className="h-4 w-4" />}
            label="Статус проекта"
            value={fundingFilter}
            options={[
              { value: 'all', label: 'Любой' },
              { value: 'collecting', label: 'Идёт сбор' },
              { value: 'closed', label: 'Сбор закрыт' },
            ]}
            onChange={(nextValue) => setFundingFilter(nextValue as FundingFilterValue)}
          />
          <FilterGroup
            label="Срок"
            value={termFilter}
            options={[
              { value: 'all', label: 'Любой' },
              { value: 'up_to_18', label: 'До 18 мес.' },
              { value: 'from_19', label: 'От 19 мес.' },
            ]}
            onChange={(nextValue) => setTermFilter(nextValue as TermFilterValue)}
          />
          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              className="w-full border-slate-200 bg-white text-brand-text hover:bg-brand-secondary"
              onClick={() => {
                setFundingFilter('all');
                setTermFilter('all');
              }}
            >
              Сбросить фильтры
            </Button>
          </div>
        </div>
      ) : null}

      {rows.length ? (
        <>
          <div className="hidden overflow-hidden rounded-sm border border-[#E2E8F0] bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#E2E8F0] bg-gray-50 text-xs uppercase text-brand-text-muted">
                <tr>
                  <th className="px-6 py-4 font-medium">Проект</th>
                  <th className="px-6 py-4 font-medium">Сумма</th>
                  <th className="px-6 py-4 font-medium">Дата</th>
                  <th className="px-6 py-4 font-medium">Доходность</th>
                  <th className="px-6 py-4 font-medium">Срок</th>
                  <th className="px-6 py-4 font-medium">Статус</th>
                  <th className="px-6 py-4 text-right font-medium">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {rows.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-brand-text">{item.project.title}</td>
                    <td className="px-6 py-4">{formatMoney(item.amount)}</td>
                    <td className="px-6 py-4 text-brand-text-muted">{formatDate(item.createdAt)}</td>
                    <td className="px-6 py-4">{formatPercent(item.project.targetYield)}</td>
                    <td className="px-6 py-4 text-brand-text-muted">{item.project.termMonths} мес.</td>
                    <td className="px-6 py-4">
                      <AppStatusBadge status={item.status === 'confirmed' ? 'approved' : item.status} className={getPortfolioStatus(item) === 'active' ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-warning/10 text-brand-warning'} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="ghost" size="icon" title="Документы">
                          <Link href="/app/investor/documents">
                            <FileText className="h-4 w-4 text-brand-text-muted" />
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="icon" title="История">
                          <Link href="/app/investor/payouts">
                            <History className="h-4 w-4 text-brand-text-muted" />
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/projects/${item.project.slug}`}>
                            <ArrowRight className="h-4 w-4 text-brand-text" />
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 md:hidden">
            {rows.map((item) => (
              <div key={item.id} className="cabinet-card shadow-none">
                <div className="space-y-4 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-brand-text">{item.project.title}</h3>
                      <p className="mt-1 text-xs text-brand-text-muted">{formatDate(item.createdAt)}</p>
                    </div>
                    <AppStatusBadge status={item.status === 'confirmed' ? 'approved' : item.status} className={getPortfolioStatus(item) === 'active' ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-warning/10 text-brand-warning'} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-y border-[#E2E8F0] py-3">
                    <div>
                      <p className="text-xs text-brand-text-muted">Сумма</p>
                      <p className="mt-0.5 text-sm font-medium text-brand-text">{formatMoney(item.amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-brand-text-muted">Доходность / Срок</p>
                      <p className="mt-0.5 text-sm font-medium text-brand-text">{formatPercent(item.project.targetYield)} • {item.project.termMonths} мес.</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="h-9 w-full border-slate-200 bg-white text-xs text-brand-primary hover:bg-brand-secondary">
                      <Link href="/app/investor/documents">Документы</Link>
                    </Button>
                    <Button asChild className="h-9 w-full border border-brand-primary bg-brand-primary text-xs text-white hover:bg-brand-primary/90">
                      <Link href={`/projects/${item.project.slug}`}>Подробнее</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <AppEmptyState title="Портфель пуст" description="Создайте первую инвестиционную заявку, чтобы здесь появился портфель." />
      )}
    </div>
  );
}

function FilterGroup({
  icon,
  label,
  options,
  value,
  onChange,
}: {
  icon?: ReactNode;
  label: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-text-muted">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={value === option.value
              ? 'rounded-full border border-brand-primary bg-brand-primary px-3 py-2 text-xs font-semibold text-white'
              : 'rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-brand-text'}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
