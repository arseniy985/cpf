'use client';

import Link from 'next/link';
import { AlertCircle, Building2, FolderKanban, Landmark, NotebookTabs } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOwnerWorkspaceQuery } from '@/entities/owner-account/api/hooks';
import { useOwnerProjectsQuery } from '@/entities/owner-project/api/hooks';
import { useOwnerRoundsQuery } from '@/entities/owner-round/api/hooks';
import { formatDateTime, formatMoney } from '@/shared/lib/format';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';
import { AppKpiCard } from '@/shared/ui/app-cabinet/app-kpi-card';
import { AppPageHeader } from '@/shared/ui/app-cabinet/app-page-header';
import { AppStatusBadge } from '@/shared/ui/app-cabinet/app-status-badge';
import { AppSurface } from '@/shared/ui/app-cabinet/app-surface';
import { AppTimeline } from '@/shared/ui/app-cabinet/app-timeline';

export default function OwnerOverviewPageV2() {
  const workspaceQuery = useOwnerWorkspaceQuery();
  const projectsQuery = useOwnerProjectsQuery();
  const roundsQuery = useOwnerRoundsQuery();

  if (workspaceQuery.isPending) {
    return (
      <AppEmptyState
        title="Собираем owner workspace…"
        description="Подтягиваем onboarding, проекты, раунды, замечания платформы и ближайшие выплаты."
      />
    );
  }

  const workspace = workspaceQuery.data?.data;
  const projects = projectsQuery.data?.data ?? [];
  const rounds = roundsQuery.data?.data ?? [];

  if (!workspace) {
    return (
      <AppEmptyState
        title="Owner workspace недоступен"
        description="Для этого аккаунта не удалось загрузить профиль владельца или он ещё не активирован."
      />
    );
  }

  const liveRounds = rounds.filter((round) => ['live', 'ready', 'settling'].includes(round.status));
  const nextReports = projects.filter((project) => project.status !== 'archived').slice(0, 3);

  return (
    <div className="space-y-6">
      <AppPageHeader
        eyebrow="Owner workspace"
        title="Обзор owner workspace"
        description="Первый экран owner-режима показывает готовность организации, проекты, раунды, замечания платформы и ближайшие обязательные действия."
        status={<AppStatusBadge status={workspace.onboarding.status} />}
        actions={(
          <>
            <Button asChild variant="outline" className="h-11 rounded-none border-app-cabinet-border bg-app-cabinet-surface px-4 text-app-cabinet-text">
              <Link href="/app/owner/organization">Открыть организацию</Link>
            </Button>
            <Button asChild className="h-11 rounded-none bg-app-cabinet-primary px-4 text-white hover:bg-app-cabinet-primary-strong">
              <Link href={workspace.actionItems[0]?.href ?? '/app/owner/organization'}>Выполнить следующий шаг</Link>
            </Button>
          </>
        )}
      />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <AppKpiCard label="Onboarding" value={`${workspace.onboarding.progressPercent}%`} hint="Процент готовности профиля owner." icon={Building2} tone="accent" />
        <AppKpiCard label="Проекты" value={String(workspace.summary.projectsCount)} hint="Всего проектов в текущем контуре owner." icon={FolderKanban} />
        <AppKpiCard label="Активные раунды" value={String(liveRounds.length)} hint="Раунды, которые уже готовы, live или находятся в расчётах." icon={Landmark} />
        <AppKpiCard label="Объём сбора" value={formatMoney(workspace.summary.totalRaisedAmount)} hint="Сумма подтверждённого привлечения по owner-режиму." icon={NotebookTabs} />
      </div>

      <AppSurface eyebrow="Что делать сейчас" title="Ближайшие обязательные действия" description="Показываем только действия, которые двигают owner-контур вперёд: onboarding, документы, проекты, раунды и выплаты.">
        <div className="grid gap-4 lg:grid-cols-3">
          {workspace.actionItems.slice(0, 3).map((item) => (
            <Link key={item.key} href={item.href} className="border border-app-cabinet-border bg-app-cabinet-secondary/35 px-4 py-4 transition-colors hover:border-app-cabinet-accent">
              <p className="text-sm font-semibold text-app-cabinet-text">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-app-cabinet-muted">{item.description}</p>
            </Link>
          ))}
        </div>
      </AppSurface>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AppSurface eyebrow="Проверка и блокеры" title="Статус onboarding и замечания платформы" description="Кабинет owner не прячет блокеры: если нужны документы или доработка, это видно сразу.">
          <div className="space-y-3">
            {workspace.onboarding.checklist.map((item) => (
              <div key={item.key} className="flex flex-col gap-3 border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-app-cabinet-text">{item.title}</p>
                  <p className="mt-1 text-sm text-app-cabinet-muted">{item.description}</p>
                </div>
                <AppStatusBadge status={item.completed ? 'approved' : 'documents_required'} />
              </div>
            ))}
            {workspace.onboarding.rejectionReason ? (
              <div className="border border-app-cabinet-warning/20 bg-app-cabinet-warning/10 px-4 py-4">
                <p className="text-sm font-semibold text-app-cabinet-warning">Замечание платформы</p>
                <p className="mt-2 text-sm leading-6 text-app-cabinet-warning">{workspace.onboarding.rejectionReason}</p>
              </div>
            ) : null}
          </div>
        </AppSurface>

        <AppSurface eyebrow="Timeline" title="Последние изменения по owner контуру" description="Сводная история по onboarding, проектам и раундам без лишних интерфейсных шумов.">
          <AppTimeline
            items={[
              {
                id: 'workspace-status',
                title: 'Текущий статус owner workspace',
                description: 'Статус обновляется по мере прохождения KYB и подготовки контуров проекта.',
                meta: workspace.onboarding.submittedAt ? formatDateTime(workspace.onboarding.submittedAt) : 'Статус актуален сейчас',
              },
              ...projects.slice(0, 2).map((project) => ({
                id: `project-${project.id}`,
                title: project.title,
                description: `Статус проекта: ${project.status}. Откройте карточку, чтобы посмотреть документы, раунды и замечания.`,
                meta: project.publishedAt ? formatDateTime(project.publishedAt) : 'Дата публикации не указана',
                tone: project.status === 'published' ? 'success' as const : 'default' as const,
              })),
              ...rounds.slice(0, 2).map((round) => ({
                id: `round-${round.id}`,
                title: round.title,
                description: `Раунд ${round.status}. Подтверждено ${formatMoney(round.currentAmount)} из ${formatMoney(round.targetAmount)}.`,
                meta: round.reviewSubmittedAt ? formatDateTime(round.reviewSubmittedAt) : 'Без даты отправки',
                tone: round.status === 'live' ? 'success' as const : 'default' as const,
              })),
            ]}
          />
        </AppSurface>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <AppSurface eyebrow="Ближайшие отчёты" title="Что скоро потребует внимания" description="Если проекты ещё не готовы к отчётности, блок остаётся пустым и честно объясняет следующий шаг.">
          {nextReports.length ? (
            <div className="space-y-3">
              {nextReports.map((project) => (
                <div key={project.id} className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
                  <p className="text-sm font-semibold text-app-cabinet-text">{project.title}</p>
                  <p className="mt-1 text-sm text-app-cabinet-muted">Следующий шаг: обновить статус проекта, документы и контур отчётности.</p>
                </div>
              ))}
            </div>
          ) : (
            <AppEmptyState title="Отчёты пока не сформированы" description="Когда появятся проекты и публикации, здесь отобразятся ближайшие дедлайны по отчётности." />
          )}
        </AppSurface>

        <AppSurface eyebrow="Выплаты" title="Ближайшие выплаты owner" description="Сюда выводятся ближайшие распределения и ручные операции по owner-выплатам.">
          {liveRounds.length ? (
            <div className="space-y-3">
              {liveRounds.slice(0, 3).map((round) => (
                <div key={round.id} className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-app-cabinet-text">{round.title}</p>
                      <p className="mt-1 text-sm text-app-cabinet-muted">{round.projectTitle ?? 'Проект не указан'}</p>
                    </div>
                    <AppStatusBadge status={round.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AppEmptyState title="Активных выплат пока нет" description="Когда появятся live-раунды и распределения, здесь будет короткая сводка по ближайшим выплатам." />
          )}
        </AppSurface>
      </div>
    </div>
  );
}
