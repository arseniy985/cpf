'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useOwnerProjectsQuery } from '@/entities/owner-project/api/hooks';
import { getProjectCategoryLabel } from '@/entities/project';
import { OwnerProjectFormPanel } from '@/features/app-forms/ui/owner-project-form-panel';
import { formatMoney, formatPercent } from '@/shared/lib/format';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';
import { AppPageHeader } from '@/shared/ui/app-cabinet/app-page-header';
import { AppStatusBadge } from '@/shared/ui/app-cabinet/app-status-badge';
import { AppSurface } from '@/shared/ui/app-cabinet/app-surface';

export default function OwnerProjectsPageV2() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(searchParams.get('dialog') === 'create');
  const projectsQuery = useOwnerProjectsQuery();
  const projects = projectsQuery.data?.data ?? [];
  const rows = projects.filter((project) => filter === 'all' ? true : project.status === filter);

  useEffect(() => {
    setDialogOpen(searchParams.get('dialog') === 'create');
  }, [searchParams]);

  function handleDialogChange(nextOpen: boolean) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextOpen) {
      params.set('dialog', 'create');
    } else {
      params.delete('dialog');
    }

    router.replace(params.size ? `${pathname}?${params.toString()}` : pathname, { scroll: false });
  }

  return (
    <div className="space-y-6">
      <AppPageHeader
        eyebrow="Кабинет владельца"
        title="Проекты"
        description="Список проектов, статусы, ключевые параметры и переход в детальную карточку проекта."
        actions={(
          <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
              <Button className="h-11 rounded-full bg-app-cabinet-primary px-4 text-white hover:bg-app-cabinet-primary-strong">
                Новый проект
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[1.75rem] border-app-cabinet-border p-0 sm:max-w-3xl">
              <div className="bg-app-cabinet-surface p-6">
                <DialogHeader>
                  <DialogTitle className="font-sans text-2xl font-semibold text-app-cabinet-text">Новый проект</DialogTitle>
                  <DialogDescription className="text-app-cabinet-muted">Создаётся черновик проекта. После этого карточка проекта будет доступна для документов и раундов.</DialogDescription>
                </DialogHeader>
                <div className="mt-6">
                  <OwnerProjectFormPanel onSuccess={() => handleDialogChange(false)} />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      />

      <AppSurface eyebrow="Фильтры" title="Отберите проекты по статусу" description="В списке видны все проекты, включая те, которые требуют документов, доработки или повторной проверки." tone="secondary">
        <div className="flex flex-wrap gap-2">
          {['all', 'draft', 'precheck', 'documents_required', 'pending_review', 'revision_requested', 'approved_for_listing', 'published', 'archived', 'rejected'].map((status) => (
            <button
              key={status}
              type="button"
              className={filter === status
                ? 'rounded-full border border-app-cabinet-primary bg-app-cabinet-primary px-3 py-2 text-sm font-semibold text-white'
                : 'rounded-full border border-app-cabinet-border bg-app-cabinet-surface px-3 py-2 text-sm font-semibold text-app-cabinet-text'}
              onClick={() => setFilter(status)}
            >
              {status === 'all'
                ? 'Все статусы'
                : ({
                    draft: 'Черновики',
                    precheck: 'Предпроверка',
                    documents_required: 'Нужны документы',
                    pending_review: 'На проверке',
                    revision_requested: 'Нужна доработка',
                    approved_for_listing: 'Готовы к размещению',
                    published: 'Опубликованы',
                    archived: 'В архиве',
                    rejected: 'Отклонены',
                  } as Record<string, string>)[status] ?? status}
            </button>
          ))}
        </div>
      </AppSurface>

      {rows.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {rows.map((project) => (
            <AppSurface
              key={project.id}
              eyebrow={getProjectCategoryLabel(project.assetType)}
              title={project.title}
              description={project.excerpt}
              action={<AppStatusBadge status={project.status} />}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="border border-app-cabinet-border bg-app-cabinet-secondary/35 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-app-cabinet-muted">Цель</p>
                  <p className="mt-2 text-sm font-semibold text-app-cabinet-text">{formatMoney(project.targetAmount)}</p>
                </div>
                <div className="border border-app-cabinet-border bg-app-cabinet-secondary/35 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-app-cabinet-muted">Доходность</p>
                  <p className="mt-2 text-sm font-semibold text-app-cabinet-text">{formatPercent(project.targetYield)}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild className="h-10 rounded-full bg-app-cabinet-primary px-3 text-white hover:bg-app-cabinet-primary-strong">
                  <Link href={`/app/owner/projects/${project.slug}`}>Открыть карточку</Link>
                </Button>
              </div>
            </AppSurface>
          ))}
        </div>
      ) : (
        <AppEmptyState title="Проекты не найдены" description="Создайте первый проект или измените фильтр по статусу." />
      )}
    </div>
  );
}
