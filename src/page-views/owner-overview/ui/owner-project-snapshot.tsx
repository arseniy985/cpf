'use client';

import Link from 'next/link';
import { ArrowRight, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { OwnerWorkspace } from '@/entities/owner-account/api/types';
import { formatMoney, formatPercent } from '@/shared/lib/format';
import { StatusBadge } from '@/shared/ui/status-badge';
import { CabinetEmptyState } from '@/widgets/cabinet-workspace/ui/cabinet-empty-state';
import { CabinetSurface } from '@/widgets/cabinet-workspace/ui/cabinet-surface';

export function OwnerProjectSnapshot({ workspace }: { workspace: OwnerWorkspace }) {
  return (
    <CabinetSurface
      title="Проектный контур"
      description="Последние проекты и быстрый доступ к черновикам, которые можно подготовить к публикации."
      action={(
        <Button asChild variant="outline">
          <Link href="/owner/projects/new">
            Новый проект
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      )}
      contentClassName="space-y-4"
    >
      {workspace.latestProjects.length === 0 ? (
        <CabinetEmptyState
          title="Проекты еще не заведены"
          description="Когда профиль компании будет заполнен, создайте первый проект и загрузите документы прямо в его карточку."
          action={(
            <Button asChild>
              <Link href="/owner/projects/new">Создать проект</Link>
            </Button>
          )}
        />
      ) : (
        workspace.latestProjects.map((project) => (
          <Link
            key={project.id}
            href={`/owner/projects/${project.slug}`}
            className="block rounded-[22px] border border-cabinet-border/65 bg-cabinet-panel px-4 py-4 transition-[transform,border-color] hover:-translate-y-0.5 hover:border-cabinet-accent/35"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cabinet-panel-strong text-cabinet-accent-strong">
                    <FolderKanban className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-cabinet-ink">{project.title}</p>
                    <p className="mt-1 text-sm text-cabinet-muted-ink">{project.location}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-sm text-cabinet-muted-ink">
                  <span>{formatMoney(project.currentAmount)} из {formatMoney(project.targetAmount)}</span>
                  <span>·</span>
                  <span>{formatPercent(project.targetYield)}</span>
                  <span>·</span>
                  <span>{project.termMonths} мес</span>
                </div>
              </div>
              <StatusBadge status={project.status} />
            </div>
          </Link>
        ))
      )}
    </CabinetSurface>
  );
}
