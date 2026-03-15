'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeft, RadioTower, SendHorizonal } from 'lucide-react';
import { toast } from 'sonner';
import { useOwnerProjectsQuery } from '@/entities/owner-project/api/hooks';
import {
  useCloseOwnerRoundMutation,
  useGoLiveOwnerRoundMutation,
  useOwnerRoundQuery,
  useSubmitOwnerRoundForReviewMutation,
} from '@/entities/owner-round/api/hooks';
import { useSession } from '@/features/session/model/use-session';
import { OwnerDistributionForm } from '@/features/owner-round/ui/owner-distribution-form';
import { OwnerRoundForm } from '@/features/owner-round/ui/owner-round-form';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { formatDate, formatMoney, formatPercent } from '@/shared/lib/format';
import { Button } from '@/components/ui/button';
import { CabinetEmptyState } from '@/widgets/cabinet-workspace/ui/cabinet-empty-state';
import { CabinetPageHeader } from '@/widgets/cabinet-workspace/ui/cabinet-page-header';
import { CabinetStatCard } from '@/widgets/cabinet-workspace/ui/cabinet-stat-card';
import { CabinetSurface } from '@/widgets/cabinet-workspace/ui/cabinet-surface';
import { StatusBadge } from '@/shared/ui/status-badge';
import { OwnerRoundAllocationsTable } from './owner-round-allocations-table';
import { OwnerRoundDistributionsPanel } from './owner-round-distributions-panel';

export default function OwnerRoundDetailsPage({ slug }: { slug: string }) {
  const session = useSession();
  const roundQuery = useOwnerRoundQuery(undefined, slug);
  const projectsQuery = useOwnerProjectsQuery();
  const submitMutation = useSubmitOwnerRoundForReviewMutation();
  const goLiveMutation = useGoLiveOwnerRoundMutation();
  const closeMutation = useCloseOwnerRoundMutation();
  const [pendingAction, setPendingAction] = useState<'submit' | 'go-live' | 'close' | null>(null);
  const actionConfig = useMemo(() => ({
    submit: {
      title: 'Отправить раунд на проверку?',
      description: 'После отправки команда платформы начнет проверку параметров и документов по этому раунду.',
      confirmLabel: 'Отправить на проверку',
      mutation: submitMutation,
      successMessage: 'Раунд отправлен на проверку',
      errorMessage: 'Не удалось отправить раунд на проверку.',
    },
    'go-live': {
      title: 'Открыть сбор?',
      description: 'После запуска инвесторы смогут подавать заявки в этот раунд.',
      confirmLabel: 'Открыть сбор',
      mutation: goLiveMutation,
      successMessage: 'Раунд открыт для инвесторов',
      errorMessage: 'Не удалось открыть раунд для инвесторов.',
    },
    close: {
      title: 'Закрыть раунд?',
      description: 'После закрытия новые заявки в этот раунд приниматься не будут.',
      confirmLabel: 'Закрыть раунд',
      mutation: closeMutation,
      successMessage: 'Раунд закрыт',
      errorMessage: 'Не удалось закрыть раунд.',
    },
  }), [closeMutation, goLiveMutation, submitMutation]);

  if (!session.token) {
    return null;
  }

  if (roundQuery.isPending || projectsQuery.isPending) {
    return (
      <CabinetEmptyState
        title="Загружаем раунд…"
        description="Собираем параметры, участников и историю выплат."
      />
    );
  }

  if (roundQuery.isError || projectsQuery.isError || !roundQuery.data?.data) {
    return (
      <CabinetEmptyState
        title="Раунд недоступен"
        description="Не удалось открыть карточку раунда. Вернитесь к общему списку и попробуйте снова."
        action={(
          <Button asChild className="rounded-full">
            <Link href="/owner/rounds">К списку раундов</Link>
          </Button>
        )}
      />
    );
  }

  const details = roundQuery.data.data;
  const round = details.round;
  const project = details.project;
  const projects = projectsQuery.data?.data?.length ? projectsQuery.data.data : [project];

  const canSubmit = round.status === 'draft';
  const canGoLive = ['pending_review', 'ready'].includes(round.status);
  const canClose = ['live', 'fully_allocated'].includes(round.status);

  return (
    <div className="space-y-6">
      <CabinetPageHeader
        eyebrow="Раунд"
        title={round.title}
        description="Карточка раунда со статусом сбора, участниками и выплатами по этому размещению."
        actions={(
          <>
            <Button asChild variant="outline" className="rounded-full border-cabinet-border bg-cabinet-panel-strong">
              <Link href="/owner/rounds">
                <ArrowLeft className="h-4 w-4" />
                К раундам
              </Link>
            </Button>
            {canSubmit ? (
              <Button
                className="rounded-full"
                disabled={submitMutation.isPending}
                onClick={() => setPendingAction('submit')}
              >
                <SendHorizonal className="h-4 w-4" />
                На проверку
              </Button>
            ) : null}
            {canGoLive ? (
              <Button
                variant="outline"
                className="rounded-full border-cabinet-border bg-cabinet-panel-strong"
                disabled={goLiveMutation.isPending}
                onClick={() => setPendingAction('go-live')}
              >
                <RadioTower className="h-4 w-4" />
                Открыть сбор
              </Button>
            ) : null}
            {canClose ? (
              <Button
                variant="outline"
                className="rounded-full border-cabinet-border bg-cabinet-panel-strong"
                disabled={closeMutation.isPending}
                onClick={() => setPendingAction('close')}
              >
                Закрыть раунд
              </Button>
            ) : null}
          </>
        )}
      />

      {pendingAction ? (
        <div className="rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-5" aria-live="polite">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-amber-950">{actionConfig[pendingAction].title}</p>
              <p className="mt-2 text-sm leading-relaxed text-amber-900">{actionConfig[pendingAction].description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                className="rounded-full"
                disabled={actionConfig[pendingAction].mutation.isPending}
                onClick={async () => {
                  try {
                    await actionConfig[pendingAction].mutation.mutateAsync({ slug });
                    setPendingAction(null);
                    toast.success(actionConfig[pendingAction].successMessage);
                  } catch (error) {
                    toast.error(getApiErrorMessage(error, actionConfig[pendingAction].errorMessage));
                  }
                }}
              >
                {actionConfig[pendingAction].mutation.isPending ? 'Сохраняем…' : actionConfig[pendingAction].confirmLabel}
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-amber-300 bg-white/70"
                disabled={actionConfig[pendingAction].mutation.isPending}
                onClick={() => setPendingAction(null)}
              >
                Отмена
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CabinetStatCard label="Статус" value={formatRoundStatus(round.status)} hint={project.title} />
        <CabinetStatCard
          label="Собрано"
          value={formatMoney(details.metrics.confirmedAmount)}
          hint={`${details.metrics.allocationCount} подтвержденных участий`}
        />
        <CabinetStatCard
          label="Распределено"
          value={formatMoney(details.metrics.distributedAmount)}
          hint={`${details.distributions.length} реестров выплат создано`}
        />
        <CabinetStatCard
          label="Условия"
          value={`${formatPercent(round.targetYield)} · ${round.termMonths} мес`}
          hint={`от ${formatMoney(round.minInvestment)} · ${formatPayoutFrequency(round.payoutFrequency)}`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <CabinetSurface
          eyebrow="Настройки"
          title="Параметры и статус"
          description="Изменяйте только то, что влияет на сбор: лимиты, даты, график выплат и примечания."
          variant="hero"
        >
          <div className="mb-5 flex flex-wrap gap-3">
            <StatusBadge status={round.status} />
            <div className="rounded-full border border-cabinet-border bg-cabinet-panel px-3 py-2 text-sm text-cabinet-muted-ink">
              {project.title}
            </div>
            <div className="rounded-full border border-cabinet-border bg-cabinet-panel px-3 py-2 text-sm text-cabinet-muted-ink">
              {formatDate(round.opensAt)} → {formatDate(round.closesAt)}
            </div>
          </div>
          <OwnerRoundForm mode="edit" round={round} projects={projects} defaultProjectId={project.id} />
        </CabinetSurface>

        <div className="space-y-6">
          <CabinetSurface
            eyebrow="Объект"
            title="Контекст объекта"
            description="Краткая сводка по объекту, к которому относится этот раунд."
          >
            <div className="grid gap-3">
              <MetaLine label="Объект" value={project.title} />
              <MetaLine label="Локация" value={project.location} />
              <MetaLine label="Тип" value={project.assetType} />
              <MetaLine label="Мин. вход в проект" value={formatMoney(project.minInvestment)} />
              <MetaLine label="Текущий сбор проекта" value={formatMoney(project.currentAmount)} />
              <MetaLine label="Статус карточки" value={project.status} />
            </div>
          </CabinetSurface>

          <CabinetSurface
            eyebrow="Выплаты"
            title="Новый реестр выплат"
            description="Когда участия подтверждены, здесь можно собрать реестр выплат по раунду."
          >
            <OwnerDistributionForm roundSlug={slug} />
          </CabinetSurface>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <CabinetSurface
          eyebrow="Участники"
          title="Подтвержденные участники"
          description="Здесь показаны инвесторы, которые уже подтвердили участие в раунде."
        >
          {details.allocations.length === 0 ? (
            <CabinetEmptyState
              title="Подтвержденных участников пока нет"
              description="Как только инвесторы подтвердят участие, они появятся в этом списке."
            />
          ) : (
            <OwnerRoundAllocationsTable allocations={details.allocations} />
          )}
        </CabinetSurface>

        <CabinetSurface
          eyebrow="История выплат"
          title="Реестры и выплаты"
          description="Согласуйте реестр, затем запустите выплаты. Если автоматическая выплата недоступна, система подскажет это."
          variant="subtle"
        >
          {details.distributions.length === 0 ? (
            <CabinetEmptyState
              title="Реестров пока нет"
              description="Создайте первый реестр после появления подтвержденных участников."
              className="px-4 py-8"
            />
          ) : (
            <OwnerRoundDistributionsPanel roundSlug={slug} distributions={details.distributions} />
          )}
        </CabinetSurface>
      </div>
    </div>
  );
}

function MetaLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[20px] border border-cabinet-border bg-cabinet-panel px-4 py-3">
      <span className="text-sm text-cabinet-muted-ink">{label}</span>
      <span className="text-right text-sm font-medium text-cabinet-ink">{value}</span>
    </div>
  );
}

function formatRoundStatus(status: string) {
  const labels: Record<string, string> = {
    draft: 'Черновик',
    pending_review: 'На проверке',
    ready: 'Готов к запуску',
    live: 'Идет сбор',
    fully_allocated: 'Раунд заполнен',
    closed: 'Закрыт',
  };

  return labels[status] ?? status;
}

function formatPayoutFrequency(value: string) {
  const labels: Record<string, string> = {
    monthly: 'ежемесячные выплаты',
    quarterly: 'ежеквартальные выплаты',
    at_maturity: 'выплата в конце срока',
  };

  return labels[value] ?? value;
}
