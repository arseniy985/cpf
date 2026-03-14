'use client';

import Link from 'next/link';
import type { ComponentType } from 'react';
import { ArrowUpRight, CircleDashed, FolderKanban, HandCoins } from 'lucide-react';
import { useOwnerProjectsQuery } from '@/entities/owner-project/api/hooks';
import { useSession } from '@/features/session/model/use-session';
import { formatMoney, formatPercent } from '@/shared/lib/format';
import { Button } from '@/components/ui/button';
import { CabinetEmptyState } from '@/widgets/cabinet-workspace/ui/cabinet-empty-state';
import { CabinetPageHeader } from '@/widgets/cabinet-workspace/ui/cabinet-page-header';
import { CabinetStatCard } from '@/widgets/cabinet-workspace/ui/cabinet-stat-card';
import { CabinetSurface } from '@/widgets/cabinet-workspace/ui/cabinet-surface';
import { StatusBadge } from '@/shared/ui/status-badge';

export default function OwnerOverviewPage() {
  const session = useSession();
  const projectsQuery = useOwnerProjectsQuery();

  if (!session.token || projectsQuery.isPending) {
    return null;
  }

  const projects = projectsQuery.data?.data ?? [];
  const published = projects.filter((project) => project.status === 'published').length;
  const reviewQueue = projects.filter((project) => project.status === 'pending_review').length;
  const totalTarget = projects.reduce((sum, project) => sum + project.targetAmount, 0);
  const totalRaised = projects.reduce((sum, project) => sum + project.currentAmount, 0);

  return (
    <div className="space-y-6">
      <CabinetPageHeader
        eyebrow="Проекты"
        title="Обзор проектов"
        description="Ваши проекты, текущая стадия модерации и базовые показатели по привлечению капитала."
        actions={(
          <>
            <Link href="/owner/projects/new">
              <Button className="rounded-lg">Новый проект</Button>
            </Link>
            <Link href="/owner/projects">
              <Button variant="outline" className="rounded-lg border-slate-200 bg-white">
                Все проекты
              </Button>
            </Link>
          </>
        )}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CabinetStatCard label="Всего проектов" value={String(projects.length)} accent={<IconAccent icon={FolderKanban} />} />
        <CabinetStatCard label="Опубликовано" value={String(published)} accent={<IconAccent icon={HandCoins} />} />
        <CabinetStatCard label="На проверке" value={String(reviewQueue)} accent={<IconAccent icon={CircleDashed} />} />
        <CabinetStatCard label="Цель по капиталу" value={formatMoney(totalTarget)} accent={<IconAccent icon={ArrowUpRight} />} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <CabinetSurface title="Последние проекты" description="Быстрый вход в рабочие карточки и статусы по ним.">
          {projects.length === 0 ? (
            <CabinetEmptyState
              title="Проектов пока нет"
              description="Создайте первый проект, заполните параметры сделки и отправьте его на проверку."
              action={(
                <Link href="/owner/projects/new">
                  <Button className="rounded-lg">Создать проект</Button>
                </Link>
              )}
            />
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <Link key={project.id} href={`/owner/projects/${project.slug}`}>
                  <div className="rounded-lg border border-slate-200 bg-white px-4 py-4 transition-colors hover:border-slate-300">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-950">{project.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{project.location}</p>
                        <p className="mt-3 text-xs text-slate-500">
                          {formatMoney(project.currentAmount)} из {formatMoney(project.targetAmount)} · {formatPercent(project.targetYield)}
                        </p>
                      </div>
                      <StatusBadge status={project.status} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CabinetSurface>

        <CabinetSurface title="Состояние пайплайна" description="Ориентиры по тому, что важно держать в порядке.">
          <div className="space-y-3">
            <PipelineStep
              title="Описание и экономика проекта"
              description="Следите, чтобы у проекта были тезис, риск-саммари и корректная структура экономики."
            />
            <PipelineStep
              title="Документы и отчетность"
              description="Менеджеры будут ожидать понятные документы, поэтому файловый контур должен быть заполнен рано."
            />
            <PipelineStep
              title="Отправка на проверку"
              description="Когда карточка готова, отправьте проект на проверку прямо из карточки проекта."
            />
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Собрано по всем проектам</p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{formatMoney(totalRaised)}</p>
            </div>
          </div>
        </CabinetSurface>
      </div>
    </div>
  );
}

function PipelineStep({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-sm font-medium text-slate-950">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}

function IconAccent({
  icon: Icon,
}: {
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
      <Icon className="h-4 w-4" />
    </div>
  );
}
