'use client';

import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCabinetDocumentsQuery } from '@/entities/cabinet/api/hooks';
import { getProjectDocumentKindLabel } from '@/entities/project';
import { formatDate } from '@/shared/lib/format';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';
import { AppSurface } from '@/shared/ui/app-cabinet/app-surface';

export default function InvestorDocumentsPage() {
  const documentsQuery = useCabinetDocumentsQuery();
  const projectDocuments = documentsQuery.data?.data.projectDocuments ?? [];
  const legalDocuments = documentsQuery.data?.data.legalDocuments ?? [];
  const totalDocuments = projectDocuments.length + legalDocuments.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Документы</h1>
          <p className="mt-1 text-sm text-brand-text-muted">Договоры, отчёты и опубликованные документы по вашим инвестициям.</p>
        </div>
      </div>
      {totalDocuments > 0 ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <AppSurface
            eyebrow="По проектам"
            title="Документы по инвестициям"
            description="Здесь собраны договоры и материалы по проектам, в которых у вас уже есть подтверждённое участие."
          >
            {projectDocuments.length ? (
              <div className="space-y-3">
                {projectDocuments.map((document) => (
                  <div key={document.id} className="flex items-start justify-between gap-4 border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-app-cabinet-text">{document.title}</p>
                      <p className="mt-1 text-sm text-app-cabinet-muted">{getProjectDocumentKindLabel(document.kind)}</p>
                      {document.label ? <p className="mt-2 text-xs text-app-cabinet-muted">{document.label}</p> : null}
                    </div>
                    {document.fileUrl ? (
                      <Button asChild variant="outline" className="h-10 rounded-full border-app-cabinet-border bg-white px-3 text-app-cabinet-text hover:bg-brand-secondary">
                        <a href={document.fileUrl} target="_blank" rel="noreferrer">Открыть</a>
                      </Button>
                    ) : (
                      <span className="text-xs text-app-cabinet-muted">Файл недоступен</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <AppEmptyState title="Документов по инвестициям пока нет" description="Когда по вашим проектам появятся договоры или отчёты, они отобразятся здесь." />
            )}
          </AppSurface>

          <AppSurface
            eyebrow="Юридические"
            title="Документы платформы"
            description="Публичные правила, соглашения и другие документы платформы."
          >
            {legalDocuments.length ? (
              <div className="space-y-3">
                {legalDocuments.map((document) => (
                  <div key={document.id} className="flex items-start justify-between gap-4 border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-app-cabinet-text">{document.title}</p>
                      <p className="mt-1 text-sm text-app-cabinet-muted">{document.summary ?? 'Описание документа не указано.'}</p>
                      <p className="mt-2 text-xs text-app-cabinet-muted">
                        {document.publishedAt ? `Опубликован ${formatDate(document.publishedAt)}` : 'Дата публикации не указана'}
                      </p>
                    </div>
                    {document.fileUrl ? (
                      <Button asChild variant="outline" className="h-10 rounded-full border-app-cabinet-border bg-white px-3 text-app-cabinet-text hover:bg-brand-secondary">
                        <a href={document.fileUrl} target="_blank" rel="noreferrer">Открыть</a>
                      </Button>
                    ) : (
                      <span className="text-xs text-app-cabinet-muted">Файл недоступен</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <AppEmptyState title="Юридических документов пока нет" description="Опубликованные документы платформы появятся здесь." />
            )}
          </AppSurface>
        </div>
      ) : (
        <AppEmptyState
          icon={FileText}
          title="Нет документов"
          description="Здесь будут появляться договоры по вашим инвестициям, отчёты по проектам и документы платформы."
        />
      )}
    </div>
  );
}
