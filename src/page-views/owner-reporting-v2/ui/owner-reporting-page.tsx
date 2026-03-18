'use client';

import { useMemo, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOwnerProjectReportsQuery, useOwnerProjectsQuery } from '@/entities/owner-project/api/hooks';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';
import { AppPageHeader } from '@/shared/ui/app-cabinet/app-page-header';
import { AppSurface } from '@/shared/ui/app-cabinet/app-surface';
import { AppStatusBadge } from '@/shared/ui/app-cabinet/app-status-badge';

export default function OwnerReportingPageV2() {
  const projectsQuery = useOwnerProjectsQuery();
  const projects = projectsQuery.data?.data ?? [];
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string>('');
  const effectiveSlug = selectedProjectSlug || projects[0]?.slug || null;
  const reportsQuery = useOwnerProjectReportsQuery(undefined, effectiveSlug);
  const reports = useMemo(() => reportsQuery.data?.data ?? [], [reportsQuery.data?.data]);

  return (
    <div className="space-y-6">
      <AppPageHeader
        eyebrow="Owner workspace"
        title="Отчётность"
        description="Регулярные отчёты, фото и медиа-обновления, фактические показатели и история версий по выбранному проекту."
      />

      <AppSurface eyebrow="Выбор проекта" title="Контекст отчётности" description="Отчёты и версии всегда привязаны к конкретному проекту." tone="secondary">
        {projects.length ? (
          <div className="max-w-md">
            <Select value={effectiveSlug ?? ''} onValueChange={setSelectedProjectSlug}>
              <SelectTrigger className="rounded-2xl border-app-cabinet-border shadow-none">
                <SelectValue placeholder="Выберите проект…" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-app-cabinet-border">
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.slug}>
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <AppEmptyState title="Проектов пока нет" description="Сначала нужен хотя бы один проект, чтобы открыть контур отчётности." />
        )}
      </AppSurface>

      <AppSurface eyebrow="История версий" title="Регулярные отчёты и публикации" description="Список версий остаётся в operational формате: дата, summary, файл и публичность.">
        {reports.length ? (
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-app-cabinet-text">{report.title}</p>
                    <p className="mt-1 text-sm text-app-cabinet-muted">{report.summary ?? 'Краткое описание не заполнено.'}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-app-cabinet-muted">{report.reportDate}</p>
                  </div>
                  <AppStatusBadge status={report.isPublic ? 'published' : 'draft'} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AppEmptyState title="Отчётов пока нет" description="Добавьте первый отчёт по проекту, чтобы здесь появилась история версий и статусов публикации." />
        )}
      </AppSurface>
    </div>
  );
}
