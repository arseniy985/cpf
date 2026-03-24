'use client';

import Link from 'next/link';
import { AlertCircle, CheckCircle2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOwnerWorkspaceQuery } from '@/entities/owner-account/api/hooks';
import { useOwnerProjectsQuery } from '@/entities/owner-project/api/hooks';
import { useOwnerRoundsQuery } from '@/entities/owner-round/api/hooks';
import { formatMoney } from '@/shared/lib/format';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';
import { AppKpiCard } from '@/shared/ui/app-cabinet/app-kpi-card';
import { AppStatusBadge } from '@/shared/ui/app-cabinet/app-status-badge';

export default function OwnerOverviewPageV2() {
  const workspaceQuery = useOwnerWorkspaceQuery();
  const projectsQuery = useOwnerProjectsQuery();
  const roundsQuery = useOwnerRoundsQuery();

  if (workspaceQuery.isPending) {
    return <AppEmptyState title="Кабинет загружается" description="Подгружаем данные по компании, проектам и раундам." />;
  }

  const workspace = workspaceQuery.data?.data;
  const projects = projectsQuery.data?.data ?? [];
  const rounds = roundsQuery.data?.data ?? [];

  if (!workspace) {
    return <AppEmptyState title="Раздел временно недоступен" description="Не удалось загрузить данные кабинета владельца." />;
  }

  const liveRound = rounds.find((round) => ['live', 'ready', 'settling'].includes(round.status));
  const latestProject = projects[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Обзор владельца объектов</h1>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-brand-text-muted">Организация:</span>
            <span className="text-sm font-medium text-brand-text">{workspace.organization.legalName ?? workspace.account.displayName}</span>
            <AppStatusBadge status={workspace.onboarding.status} className="ml-2" />
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button asChild variant="outline" className="h-11 w-full border-slate-200 bg-white px-6 text-brand-primary hover:bg-brand-secondary sm:w-auto">
            <Link href="/app/owner/projects?dialog=create">Новый проект</Link>
          </Button>
          <Button asChild className="h-11 w-full border border-brand-primary bg-brand-primary px-6 text-white hover:bg-brand-primary/90 sm:w-auto">
            <Link href="/app/owner/rounds">Создать раунд</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-3xl border border-brand-warning/30 bg-[#FFFAF0]">
        <div className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-start gap-4">
            <div className="mt-1 shrink-0 rounded-full bg-brand-warning/10 p-2 text-brand-warning">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="mb-1 text-base font-semibold text-brand-text text-balance">
                {workspace.actionItems[0]?.title ?? 'Требуется загрузить отчетность'}
              </h3>
              <p className="text-sm text-brand-text-muted">
                {workspace.actionItems[0]?.description ?? 'По активному проекту требуется следующее обязательное действие.'}
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Button asChild variant="ghost" className="w-full justify-center text-brand-text hover:bg-brand-secondary hover:text-brand-primary sm:w-auto">
              <Link href={workspace.actionItems[0]?.href ?? '/app/owner/projects'}>Перейти к проекту</Link>
            </Button>
            <Button asChild className="w-full border border-brand-primary bg-brand-primary text-white hover:bg-brand-primary/90 sm:w-auto">
              <Link href={workspace.actionItems[0]?.href ?? '/app/owner/projects'}>Выполнить шаг</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AppKpiCard label="Активные проекты" value={String(workspace.summary.projectsCount)} hint="В управлении" />
        <AppKpiCard label="Открытые раунды" value={String(rounds.filter((round) => ['live', 'ready', 'settling'].includes(round.status)).length)} hint={liveRound ? `Сбор средств: ${formatMoney(liveRound.currentAmount)}` : 'Нет открытых раундов'} />
        <AppKpiCard label="Привлечено средств" value={formatMoney(workspace.summary.totalRaisedAmount)} hint="За все время" />
        <AppKpiCard label="Ближайшая выплата" value={liveRound ? formatMoney(liveRound.currentAmount) : '0 ₽'} hint={liveRound ? 'Требует согласования' : 'Пока не запланирована'} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="cabinet-card shadow-none">
            <div className="flex flex-row items-center justify-between border-b border-[#E2E8F0] p-6 pb-4">
              <h2 className="text-lg font-semibold leading-none tracking-tight">Текущие раунды привлечения</h2>
              <Button asChild variant="ghost" size="sm" className="text-brand-primary hover:text-brand-primary">
                <Link href="/app/owner/rounds">Все раунды</Link>
              </Button>
            </div>
            <div className="p-6">
              {liveRound ? (
                <>
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-semibold text-brand-text">{liveRound.projectTitle ?? 'Проект'} , {liveRound.title}</h4>
                      <p className="mt-1 text-sm text-brand-text-muted">Цель: {formatMoney(liveRound.targetAmount)} • Срок: {liveRound.termMonths} мес.</p>
                    </div>
                    <AppStatusBadge status={liveRound.status} className="bg-brand-success/10 text-brand-success" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-brand-text">{formatMoney(liveRound.currentAmount)} собрано</span>
                      <span className="text-brand-text-muted">
                        {liveRound.targetAmount > 0 ? Math.round((liveRound.currentAmount / liveRound.targetAmount) * 100) : 0}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-brand-primary"
                        style={{ width: `${liveRound.targetAmount > 0 ? Math.min(100, (liveRound.currentAmount / liveRound.targetAmount) * 100) : 0}%` }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-brand-text-muted">
                      <span>{liveRound.allocationCount} инвесторов</span>
                      <span>Мин. вход: {formatMoney(liveRound.minInvestment)}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button asChild variant="outline" size="sm" className="w-full border-slate-200 bg-white text-brand-primary hover:bg-brand-secondary">
                      <Link href={`/app/owner/rounds/${liveRound.slug}`}>Открыть заявки инвесторов</Link>
                    </Button>
                  </div>
                </>
              ) : (
                <AppEmptyState title="Нет активных раундов" description="Создайте раунд привлечения для опубликованного проекта." />
              )}
            </div>
          </div>

          <div className="cabinet-card border-brand-error/20 shadow-none">
            <div className="flex flex-row items-center justify-between border-b border-[#E2E8F0] p-6 pb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-brand-error" />
                <h2 className="text-lg font-semibold leading-none tracking-tight">Замечания платформы</h2>
              </div>
            </div>
            <div>
              <div className="p-4 transition-colors hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-brand-text">{workspace.actionItems[0]?.title ?? 'Обновить фин. модель'}</p>
                    <p className="mt-1 text-xs text-brand-text-muted">Проект: {latestProject?.title ?? 'Проект не указан'}</p>
                    <p className="mt-2 text-sm text-brand-text">{workspace.onboarding.rejectionReason ?? workspace.actionItems[0]?.description ?? 'Новых замечаний нет.'}</p>
                  </div>
                  <Button asChild variant="link" size="sm">
                    <Link href={workspace.actionItems[0]?.href ?? '/app/owner/organization'}>Исправить</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="cabinet-card shadow-none">
            <div className="p-6 pb-3">
              <h2 className="text-base font-semibold">Календарь событий</h2>
            </div>
            <div className="space-y-4 p-6 pt-0">
              {workspace.actionItems.slice(0, 2).map((item, index) => (
                <div key={item.key} className="flex gap-3">
                  <div className={`flex min-w-[48px] flex-col items-center justify-center rounded-sm p-2 ${index === 1 ? 'bg-brand-warning/10' : 'bg-gray-50'}`}>
                    <span className={`text-xs ${index === 1 ? 'text-brand-warning' : 'text-brand-text-muted'}`}>Шаг</span>
                    <span className={`text-sm font-bold ${index === 1 ? 'text-brand-warning' : 'text-brand-text'}`}>{index + 1}</span>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-sm font-medium text-brand-text">{item.title}</p>
                    <p className="text-xs text-brand-text-muted">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-transparent bg-brand-secondary/30">
            <div className="space-y-2 p-4">
              <Button asChild variant="ghost" className="w-full justify-start text-brand-text hover:text-brand-primary">
                <Link href="/app/owner/allocations">
                  <FileText className="mr-2 h-4 w-4" />
                  Реестр инвесторов
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start text-brand-text hover:text-brand-primary">
                <Link href="/app/owner/organization">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Документы организации
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
