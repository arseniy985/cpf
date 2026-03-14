'use client';

import Link from 'next/link';
import { useOwnerProjectsQuery } from '@/entities/owner-project/api/hooks';
import { useSession } from '@/features/session/model/use-session';
import { formatDate, formatMoney, formatPercent } from '@/shared/lib/format';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CabinetEmptyState } from '@/widgets/cabinet-workspace/ui/cabinet-empty-state';
import { CabinetPageHeader } from '@/widgets/cabinet-workspace/ui/cabinet-page-header';
import { CabinetSurface } from '@/widgets/cabinet-workspace/ui/cabinet-surface';
import { StatusBadge } from '@/shared/ui/status-badge';

export default function OwnerProjectsPage() {
  const session = useSession();
  const projectsQuery = useOwnerProjectsQuery();

  if (!session.token || projectsQuery.isPending) {
    return null;
  }

  const projects = projectsQuery.data?.data ?? [];

  return (
    <div className="space-y-6">
      <CabinetPageHeader
        eyebrow="Проекты"
        title="Мои проекты"
        description="Операционный список всех проектов с быстрым переходом в рабочую карточку."
        actions={(
          <Link href="/owner/projects/new">
            <Button className="rounded-lg">Создать проект</Button>
          </Link>
        )}
      />

      <CabinetSurface title="Список проектов" description="Каждая строка ведет в отдельную рабочую карточку проекта.">
        {projects.length === 0 ? (
          <CabinetEmptyState
            title="Пока нет проектов"
            description="Создайте первый проект, чтобы начать работу с размещением."
            action={(
              <Link href="/owner/projects/new">
                <Button className="rounded-lg">Новый проект</Button>
              </Link>
            )}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Проект</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Капитал</TableHead>
                <TableHead>Доходность</TableHead>
                <TableHead>Публикация</TableHead>
                <TableHead className="text-right">Открыть</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-950">{project.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{project.location}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={project.status} />
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-slate-900">{formatMoney(project.currentAmount)} / {formatMoney(project.targetAmount)}</p>
                    <p className="mt-1 text-xs text-slate-500">{project.fundingProgress.toFixed(0)}%</p>
                  </TableCell>
                  <TableCell>{formatPercent(project.targetYield)}</TableCell>
                  <TableCell>{formatDate(project.publishedAt)}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/owner/projects/${project.slug}`}>
                      <Button variant="outline" className="rounded-lg border-slate-200 bg-white">
                        Открыть
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CabinetSurface>
    </div>
  );
}
