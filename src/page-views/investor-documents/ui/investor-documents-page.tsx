'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCabinetDocumentsQuery, useInvestmentsQuery } from '@/entities/cabinet/api/hooks';
import { formatDate } from '@/shared/lib/format';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';
import { AppPageHeader } from '@/shared/ui/app-cabinet/app-page-header';
import { AppStatusBadge } from '@/shared/ui/app-cabinet/app-status-badge';
import { AppSurface } from '@/shared/ui/app-cabinet/app-surface';

const filters = ['all', 'project', 'legal'] as const;

export default function InvestorDocumentsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('all');
  const documentsQuery = useCabinetDocumentsQuery();
  const investmentsQuery = useInvestmentsQuery();

  const projectDocuments = documentsQuery.data?.data.projectDocuments ?? [];
  const legalDocuments = documentsQuery.data?.data.legalDocuments ?? [];
  const investments = investmentsQuery.data?.data ?? [];

  const combined = [
    ...projectDocuments.map((document) => ({
      id: `project-${document.id}`,
      title: document.title,
      type: document.kind,
      entity: investments.find((investment) =>
        investment.project.documents.some((projectDocument) => projectDocument.id === document.id),
      )?.project.title ?? 'Инвестиция',
      status: document.isPublic ? 'approved' : 'draft',
      date: null as string | null,
      scope: 'project' as const,
      href: document.fileUrl,
    })),
    ...legalDocuments.map((document) => ({
      id: `legal-${document.id}`,
      title: document.title,
      type: document.documentType,
      entity: 'Юридический пакет',
      status: 'approved',
      date: document.publishedAt ?? null,
      scope: 'legal' as const,
      href: document.fileUrl,
    })),
  ].filter((item) => filter === 'all' ? true : item.scope === filter);

  return (
    <div className="space-y-6">
      <AppPageHeader
        eyebrow="Investor workspace"
        title="Документы инвестора"
        description="Договоры участия, договоры управления, отчёты по проектам и подтверждения операций с привязкой к конкретной сущности."
      />

      <AppSurface eyebrow="Фильтры" title="Отберите документы по типу" description="Фильтр нужен для быстрой работы с договорами, отчётами и юридическими материалами.">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              className={filter === item
                ? 'border border-app-cabinet-primary bg-app-cabinet-primary px-3 py-2 text-sm font-semibold text-white'
                : 'border border-app-cabinet-border bg-app-cabinet-surface px-3 py-2 text-sm font-semibold text-app-cabinet-text'}
              onClick={() => setFilter(item)}
            >
              {item === 'all' ? 'Все документы' : item === 'project' ? 'По инвестициям' : 'Юридические'}
            </button>
          ))}
        </div>
      </AppSurface>

      <AppSurface eyebrow="Список" title="Контекстные документы" description="Каждая строка показывает тип, связанную сущность, статус и доступное действие.">
        {combined.length ? (
          <div className="space-y-3">
            {combined.map((document) => (
              <div key={document.id} className="flex flex-col gap-3 border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-app-cabinet-text">{document.title}</p>
                  <p className="mt-1 text-sm text-app-cabinet-muted">{document.entity} · {document.type}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-app-cabinet-muted">{document.date ? formatDate(document.date) : 'Дата не указана'}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <AppStatusBadge status={document.status} />
                  {document.href ? (
                    <Button asChild variant="outline" className="h-10 rounded-none border-app-cabinet-border bg-app-cabinet-surface px-3 text-app-cabinet-text">
                      <a href={document.href} target="_blank" rel="noreferrer">Открыть</a>
                    </Button>
                  ) : (
                    <Button type="button" variant="outline" className="h-10 rounded-none border-app-cabinet-border bg-app-cabinet-surface px-3 text-app-cabinet-text" disabled>
                      Недоступно
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AppEmptyState title="Документы пока не найдены" description="Когда появятся договоры, подтверждения операций или отчёты по проектам, они окажутся здесь." />
        )}
      </AppSurface>
    </div>
  );
}
