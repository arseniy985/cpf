'use client';

import Link from 'next/link';
import { useOwnerProjectHistoryQuery } from '@/entities/audit-log/api/hooks';
import { toTimelineItems } from '@/entities/audit-log/model/to-timeline-items';
import { Button } from '@/components/ui/button';
import { useOwnerProjectDocumentsQuery, useOwnerProjectInvestmentsQuery, useOwnerProjectQuery, useOwnerProjectReportsQuery } from '@/entities/owner-project/api/hooks';
import { useOwnerRoundsQuery } from '@/entities/owner-round/api/hooks';
import { formatMoney, formatPercent } from '@/shared/lib/format';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';
import { AppPageHeader } from '@/shared/ui/app-cabinet/app-page-header';
import { AppStatusBadge } from '@/shared/ui/app-cabinet/app-status-badge';
import { AppSurface } from '@/shared/ui/app-cabinet/app-surface';
import { AppTimeline } from '@/shared/ui/app-cabinet/app-timeline';

export default function OwnerProjectDetailPageV2({ slug }: { slug: string }) {
  const projectQuery = useOwnerProjectQuery(undefined, slug);
  const documentsQuery = useOwnerProjectDocumentsQuery(undefined, slug);
  const reportsQuery = useOwnerProjectReportsQuery(undefined, slug);
  const investmentsQuery = useOwnerProjectInvestmentsQuery(undefined, slug);
  const roundsQuery = useOwnerRoundsQuery();
  const historyQuery = useOwnerProjectHistoryQuery(slug);

  if (projectQuery.isPending) {
    return (
      <AppEmptyState
        title="Собираем карточку проекта…"
        description="Подтягиваем паспорт актива, документы, отчётность, раунды и метрики по инвестициям."
      />
    );
  }

  const details = projectQuery.data?.data;

  if (!details) {
    return (
      <AppEmptyState
        title="Проект не найден"
        description="Не удалось загрузить карточку проекта по текущему slug."
      />
    );
  }

  const projectRounds = (roundsQuery.data?.data ?? []).filter((round) => round.projectSlug === details.project.slug);
  const documents = documentsQuery.data?.data ?? [];
  const reports = reportsQuery.data?.data ?? [];
  const investments = investmentsQuery.data?.data;

  return (
    <div className="space-y-6">
      <AppPageHeader
        eyebrow="Owner workspace"
        title={details.project.title}
        description={details.project.excerpt}
        status={<AppStatusBadge status={details.project.status} />}
        actions={(
          <Button asChild variant="outline" className="h-11 rounded-full border-app-cabinet-border bg-app-cabinet-surface px-4 text-app-cabinet-text">
            <Link href="/app/owner/projects">Вернуться к проектам</Link>
          </Button>
        )}
      />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <AppSurface eyebrow="Паспорт актива" title={details.project.location} description={details.project.assetType}>
          <div className="grid gap-2 text-sm text-app-cabinet-muted">
            <p>Минимальный вход: <span className="font-semibold text-app-cabinet-text">{formatMoney(details.project.minInvestment)}</span></p>
            <p>Срок: <span className="font-semibold text-app-cabinet-text">{details.project.termMonths} мес</span></p>
          </div>
        </AppSurface>
        <AppSurface eyebrow="Финансовая модель" title={formatMoney(details.project.targetAmount)} description="Целевой объём по проекту.">
          <p className="text-sm text-app-cabinet-muted">Доходность: <span className="font-semibold text-app-cabinet-text">{formatPercent(details.project.targetYield)}</span></p>
        </AppSurface>
        <AppSurface eyebrow="Инвестиции" title={formatMoney(details.metrics.confirmedAmount)} description="Подтверждённая сумма участия по проекту.">
          <p className="text-sm text-app-cabinet-muted">Заявок: <span className="font-semibold text-app-cabinet-text">{details.metrics.applicationsCount}</span></p>
        </AppSurface>
        <AppSurface eyebrow="Публикация" title={details.project.fundingStatus} description="Текущий контур публикации и готовности к размещению.">
          <AppStatusBadge status={details.project.status} className="mt-3" />
        </AppSurface>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <AppSurface eyebrow="Содержание проекта" title="Паспорт, риски и структура" description="Здесь собраны основное описание актива, инвестиционный тезис, риски и юридический контекст.">
          <div className="space-y-4">
            <div className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
              <p className="text-sm font-semibold text-app-cabinet-text">Описание</p>
              <p className="mt-2 text-sm leading-6 text-app-cabinet-muted">{details.project.description}</p>
            </div>
            <div className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
              <p className="text-sm font-semibold text-app-cabinet-text">Инвестиционный тезис</p>
              <p className="mt-2 text-sm leading-6 text-app-cabinet-muted">{details.project.thesis ?? 'Тезис пока не заполнен.'}</p>
            </div>
            <div className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
              <p className="text-sm font-semibold text-app-cabinet-text">Риски и блокеры</p>
              <p className="mt-2 text-sm leading-6 text-app-cabinet-muted">{details.project.riskSummary ?? 'Риски пока не внесены в карточку.'}</p>
            </div>
          </div>
        </AppSurface>

        <AppSurface eyebrow="Timeline" title="История изменений" description="На карточке проекта история нужна для прозрачности проверок, замечаний и связанных раундов.">
          <AppTimeline items={toTimelineItems(historyQuery.data?.data ?? [])} />
        </AppSurface>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <AppSurface eyebrow="Документы" title="Контекстные документы проекта" description="Документы привязаны к проекту и открываются из карточки без переходов в публичный контур.">
          {documents.length ? (
            <div className="space-y-3">
              {documents.map((document) => (
                <div key={document.id} className="flex items-center justify-between gap-3 border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
                  <div>
                    <p className="text-sm font-semibold text-app-cabinet-text">{document.title}</p>
                    <p className="mt-1 text-sm text-app-cabinet-muted">{document.kind}</p>
                  </div>
                  <Button asChild variant="outline" className="h-10 rounded-full border-app-cabinet-border bg-app-cabinet-surface px-3 text-app-cabinet-text">
                    <a href={document.fileUrl ?? '#'} target="_blank" rel="noreferrer">Открыть</a>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <AppEmptyState title="Документов пока нет" description="Добавьте пакет документов, чтобы проект можно было двигать к проверке и размещению." />
          )}
        </AppSurface>

        <AppSurface eyebrow="Связанные раунды" title="Раунды проекта" description="Раунды выводятся прямо в карточке, чтобы видеть связь проекта и привлечения капитала.">
          {projectRounds.length ? (
            <div className="space-y-3">
              {projectRounds.map((round) => (
                <div key={round.id} className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-app-cabinet-text">{round.title}</p>
                      <p className="mt-1 text-sm text-app-cabinet-muted">{formatMoney(round.currentAmount)} из {formatMoney(round.targetAmount)}</p>
                    </div>
                    <AppStatusBadge status={round.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AppEmptyState title="Раундов пока нет" description="Создайте первый раунд в owner workspace, чтобы привязать его к текущему проекту." />
          )}
        </AppSurface>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <AppSurface eyebrow="Отчётность" title="Отчёты и медиа" description="Регулярные отчёты и публикации по факту проекта остаются внутри owner-карточки.">
          {reports.length ? (
            <div className="space-y-3">
              {reports.map((report) => (
                <div key={report.id} className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
                  <p className="text-sm font-semibold text-app-cabinet-text">{report.title}</p>
                  <p className="mt-1 text-sm text-app-cabinet-muted">{report.summary ?? 'Краткое описание не указано.'}</p>
                </div>
              ))}
            </div>
          ) : (
            <AppEmptyState title="Отчётов пока нет" description="Когда проект перейдёт к регулярной отчётности, здесь появится список версий и публикаций." />
          )}
        </AppSurface>

        <AppSurface eyebrow="CTA" title="Следующий шаг" description="Следующее действие зависит от текущего статуса проекта и полноты документов.">
          <div className="space-y-3">
            <div className="border border-app-cabinet-border bg-app-cabinet-secondary/35 px-4 py-4">
              <p className="text-sm font-semibold text-app-cabinet-text">Рекомендуемое действие</p>
              <p className="mt-2 text-sm leading-6 text-app-cabinet-muted">
                {details.project.status === 'draft' || details.project.status === 'documents_required'
                  ? 'Дозаполнить документы и отправить проект на предварительную проверку.'
                  : details.project.status === 'revision_requested'
                    ? 'Разобрать замечания платформы и внести доработки в карточку проекта.'
                    : 'Проверить связанные раунды и контур отчётности по проекту.'}
              </p>
            </div>
            {investments ? (
              <div className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
                <p className="text-sm font-semibold text-app-cabinet-text">Инвестиции по проекту</p>
                <p className="mt-2 text-sm text-app-cabinet-muted">Подтверждено {formatMoney(investments.confirmedAmount)} при {investments.applicationsCount} заявках.</p>
              </div>
            ) : null}
          </div>
        </AppSurface>
      </div>
    </div>
  );
}
