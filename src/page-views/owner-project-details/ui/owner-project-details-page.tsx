'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, SendHorizonal } from 'lucide-react';
import {
  useOwnerProjectDocumentsQuery,
  useOwnerProjectInvestmentsQuery,
  useOwnerProjectQuery,
  useOwnerProjectReportsQuery,
  useSubmitOwnerProjectForReviewMutation,
} from '@/entities/owner-project/api/hooks';
import { useSession } from '@/features/session/model/use-session';
import { formatDate, formatMoney, formatPercent } from '@/shared/lib/format';
import { Button } from '@/components/ui/button';
import { CabinetEmptyState } from '@/widgets/cabinet-workspace/ui/cabinet-empty-state';
import { CabinetPageHeader } from '@/widgets/cabinet-workspace/ui/cabinet-page-header';
import { CabinetStatCard } from '@/widgets/cabinet-workspace/ui/cabinet-stat-card';
import { CabinetSurface } from '@/widgets/cabinet-workspace/ui/cabinet-surface';
import { OwnerProjectDocumentForm } from '@/features/owner-project/ui/owner-project-document-form';
import { OwnerProjectForm } from '@/features/owner-project/ui/owner-project-form';
import { OwnerProjectReportForm } from '@/features/owner-project/ui/owner-project-report-form';
import { StatusBadge } from '@/shared/ui/status-badge';

export default function OwnerProjectDetailsPage({ slug }: { slug: string }) {
  const router = useRouter();
  const session = useSession();
  const projectQuery = useOwnerProjectQuery(undefined, slug);
  const documentsQuery = useOwnerProjectDocumentsQuery(undefined, slug);
  const reportsQuery = useOwnerProjectReportsQuery(undefined, slug);
  const investmentsQuery = useOwnerProjectInvestmentsQuery(undefined, slug);
  const submitReviewMutation = useSubmitOwnerProjectForReviewMutation();

  if (!session.token || projectQuery.isPending) {
    return null;
  }

  if (projectQuery.isError) {
    return (
      <CabinetEmptyState
        title="Проект недоступен"
        description="Не удалось открыть рабочую карточку проекта."
        action={(
          <Link href="/owner/projects">
            <Button className="rounded-lg">Вернуться к проектам</Button>
          </Link>
        )}
      />
    );
  }

  const details = projectQuery.data?.data;

  if (!details) {
    return null;
  }

  const documents = documentsQuery.data?.data ?? [];
  const reports = reportsQuery.data?.data ?? [];
  const investments = investmentsQuery.data?.data;

  return (
    <div className="space-y-6">
      <CabinetPageHeader
        eyebrow="Проекты"
        title={details.project.title}
        description="Карточка проекта с основными параметрами, документами, отчетами и показателями привлечения."
        actions={(
          <>
            <Link href="/owner/projects">
              <Button variant="outline" className="rounded-lg border-slate-200 bg-white">
                <ArrowLeft className="h-4 w-4" />
                К списку
              </Button>
            </Link>
            {details.project.status !== 'pending_review' ? (
              <Button
                className="rounded-lg"
                disabled={submitReviewMutation.isPending}
                onClick={async () => {
                  try {
                    await submitReviewMutation.mutateAsync({ slug });
                    router.refresh();
                  } catch {
                    return;
                  }
                }}
              >
                <SendHorizonal className="h-4 w-4" />
                {submitReviewMutation.isPending ? 'Отправляем...' : 'На модерацию'}
              </Button>
            ) : null}
          </>
        )}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CabinetStatCard label="Статус" value={details.project.status} />
        <CabinetStatCard label="Цель" value={formatMoney(details.project.targetAmount)} />
        <CabinetStatCard label="Подтверждено" value={formatMoney(investments?.confirmedAmount ?? 0)} />
        <CabinetStatCard label="Ожидает подтверждения" value={formatMoney(investments?.pendingAmount ?? 0)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <CabinetSurface title="Основные параметры" description="Редактируйте структуру сделки и маркетинговую часть проекта.">
          <div className="mb-5 flex flex-wrap gap-3">
            <StatusBadge status={details.project.status} />
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              {details.project.location}
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              {formatPercent(details.project.targetYield)} · {details.project.termMonths} мес
            </div>
          </div>
          <OwnerProjectForm project={details.project} onCreated={() => undefined} />
        </CabinetSurface>

        <div className="space-y-6">
          <CabinetSurface title="Метрики раунда" description="Базовые показатели по заявкам и привлечению.">
            <div className="grid gap-3">
              <MetricLine label="Заявок" value={String(investments?.applicationsCount ?? details.metrics.applicationsCount)} />
              <MetricLine label="Подтверждено" value={formatMoney(investments?.confirmedAmount ?? details.metrics.confirmedAmount)} />
              <MetricLine label="Текущий сбор" value={formatMoney(details.project.currentAmount)} />
              <MetricLine label="Мин. вход" value={formatMoney(details.project.minInvestment)} />
              <MetricLine label="Публикация" value={formatDate(details.project.publishedAt)} />
            </div>
          </CabinetSurface>

          <CabinetSurface title="Позиционирование" description="Короткие смысловые блоки, которые видят инвесторы в карточке проекта.">
            <div className="space-y-4">
              <TextBlock title="Тезис">{details.project.thesis ?? 'Пока не заполнен'}</TextBlock>
              <TextBlock title="Риски">{details.project.riskSummary ?? 'Пока не заполнены'}</TextBlock>
              <TextBlock title="Краткое описание">{details.project.excerpt}</TextBlock>
            </div>
          </CabinetSurface>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <CabinetSurface title="Документы проекта" description="Документы для внутренней проверки и материалов по сделке.">
          <div className="space-y-5">
            <OwnerProjectDocumentForm slug={slug} />
            {documents.length === 0 ? (
              <CabinetEmptyState
                title="Документов пока нет"
                description="Добавьте хотя бы базовый набор документов, прежде чем отправлять проект на модерацию."
              />
            ) : (
              <div className="space-y-3">
                {documents.map((document) => (
                  <div key={document.id} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-950">{document.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{document.label ?? document.kind}</p>
                      </div>
                      <StatusBadge status={document.isPublic ? 'published' : 'draft'} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CabinetSurface>

        <CabinetSurface title="Отчеты" description="Обновления по проекту для инвесторов и внутренней команды.">
          <div className="space-y-5">
            <OwnerProjectReportForm slug={slug} />
            {reports.length === 0 ? (
              <CabinetEmptyState
                title="Отчетов пока нет"
                description="После старта проекта публикуйте регулярные отчеты, чтобы поддерживать доверие инвесторов."
              />
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div key={report.id} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-950">{report.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{report.summary ?? 'Без краткого описания'}</p>
                        <p className="mt-2 text-xs text-slate-500">{formatDate(report.reportDate)}</p>
                      </div>
                      <StatusBadge status={report.isPublic ? 'published' : 'draft'} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CabinetSurface>
      </div>
    </div>
  );
}

function MetricLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-medium text-slate-950">{value}</span>
    </div>
  );
}

function TextBlock({ title, children }: { title: string; children: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">{children}</p>
    </div>
  );
}
