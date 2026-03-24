'use client';

import Link from 'next/link';
import { useOwnerRoundHistoryQuery } from '@/entities/audit-log/api/hooks';
import { toTimelineItems } from '@/entities/audit-log/model/to-timeline-items';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { getProjectPayoutFrequencyLabel } from '@/entities/project';
import {
  useApproveOwnerDistributionMutation,
  useCloseOwnerRoundMutation,
  useGoLiveOwnerRoundMutation,
  useOwnerRoundQuery,
  useRunOwnerDistributionPayoutsMutation,
  useSubmitOwnerRoundForReviewMutation,
} from '@/entities/owner-round/api/hooks';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { getStatusMeta } from '@/shared/lib/app-cabinet/status';
import { formatMoney, formatPercent } from '@/shared/lib/format';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';
import { AppPageHeader } from '@/shared/ui/app-cabinet/app-page-header';
import { AppStatusBadge } from '@/shared/ui/app-cabinet/app-status-badge';
import { AppSurface } from '@/shared/ui/app-cabinet/app-surface';
import { AppTimeline } from '@/shared/ui/app-cabinet/app-timeline';

export default function OwnerRoundDetailPageV2({ slug }: { slug: string }) {
  const roundQuery = useOwnerRoundQuery(undefined, slug);
  const submitMutation = useSubmitOwnerRoundForReviewMutation();
  const goLiveMutation = useGoLiveOwnerRoundMutation();
  const closeMutation = useCloseOwnerRoundMutation();
  const approveDistributionMutation = useApproveOwnerDistributionMutation();
  const runDistributionMutation = useRunOwnerDistributionPayoutsMutation();
  const historyQuery = useOwnerRoundHistoryQuery(slug);
  const goLiveBlocker = goLiveMutation.isError
    ? getApiErrorMessage(goLiveMutation.error, 'Не удалось опубликовать раунд.')
    : null;

  if (roundQuery.isPending) {
    return (
      <AppEmptyState
        title="Собираем карточку раунда…"
        description="Подтягиваем условия раунда, прогресс размещения, заявки инвесторов, документы и выплаты."
      />
    );
  }

  const details = roundQuery.data?.data;

  if (!details) {
    return (
      <AppEmptyState
        title="Раунд не найден"
        description="Не удалось загрузить карточку раунда по текущему адресу."
      />
    );
  }

  const round = details.round;
  const roundStatus = getStatusMeta(round.status).label;

  async function runAction(action: 'submit' | 'live' | 'close') {
    try {
      if (action === 'submit') {
        await submitMutation.mutateAsync({ slug });
        toast.success('Раунд отправлен на проверку');
      }

      if (action === 'live') {
        await goLiveMutation.mutateAsync({ slug });
        toast.success('Раунд опубликован');
      }

      if (action === 'close') {
        await closeMutation.mutateAsync({ slug });
        toast.success('Раунд закрыт');
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Не удалось выполнить действие по раунду.'));
    }
  }

  return (
    <div className="space-y-6">
      <AppPageHeader
        eyebrow="Кабинет владельца"
        title={round.title}
        description={`${details.project.title} · раунд привлечения капитала с отдельным разделом заявок инвесторов и выплат.`}
        status={<AppStatusBadge status={round.status} />}
        actions={(
          <>
            <Button asChild variant="outline" className="h-11 rounded-full border-app-cabinet-border bg-app-cabinet-surface px-4 text-app-cabinet-text">
              <Link href="/app/owner/rounds">Вернуться к раундам</Link>
            </Button>
            <Button type="button" variant="outline" className="h-11 rounded-full border-app-cabinet-border bg-app-cabinet-surface px-4 text-app-cabinet-text" onClick={() => runAction('submit')}>
              Отправить на проверку
            </Button>
            <Button type="button" variant="outline" className="h-11 rounded-full border-app-cabinet-border bg-app-cabinet-surface px-4 text-app-cabinet-text" onClick={() => runAction('live')}>
              Опубликовать
            </Button>
            <Button type="button" className="h-11 rounded-full bg-app-cabinet-primary px-4 text-white hover:bg-app-cabinet-primary-strong" onClick={() => runAction('close')}>
              Закрыть раунд
            </Button>
          </>
        )}
      />

      {goLiveBlocker ? (
        <AppSurface
          eyebrow="Блокировка публикации"
          title="Раунд пока нельзя открыть"
          description={goLiveBlocker}
          tone="secondary"
        >
          <p className="text-sm text-brand-text-muted">
            После одобрения компании в админке раунд можно будет повторно отправить в публикацию без пересоздания.
          </p>
        </AppSurface>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <AppSurface eyebrow="Условия" title={formatMoney(round.targetAmount)} description="Целевой объём раунда.">
          <p className="text-sm text-app-cabinet-muted">Минимальный вход: <span className="font-semibold text-app-cabinet-text">{formatMoney(round.minInvestment)}</span></p>
        </AppSurface>
        <AppSurface eyebrow="Ставка" title={formatPercent(round.targetYield)} description="Ориентир по доходности.">
          <p className="text-sm text-app-cabinet-muted">Срок: <span className="font-semibold text-app-cabinet-text">{round.termMonths} мес</span></p>
        </AppSurface>
        <AppSurface eyebrow="Прогресс" title={formatMoney(round.currentAmount)} description="Текущий объём подтверждённых инвестиций в раунде.">
          <p className="text-sm text-app-cabinet-muted">Подтверждённых заявок: <span className="font-semibold text-app-cabinet-text">{round.allocationCount}</span></p>
        </AppSurface>
        <AppSurface eyebrow="Выплаты" title={String(details.distributions.length)} description="Количество распределений, привязанных к раунду.">
          <p className="text-sm text-app-cabinet-muted">Статус: <span className="font-semibold text-app-cabinet-text">{roundStatus}</span></p>
        </AppSurface>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <AppSurface eyebrow="Основные условия" title="Условия раунда" description="Целевая сумма, лимиты, сроки размещения и условия выплат на одном экране.">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['Цель', formatMoney(round.targetAmount)],
              ['Минимальный вход', formatMoney(round.minInvestment)],
              ['Срок размещения', `${round.termMonths} мес`],
              ['Частота выплат', getProjectPayoutFrequencyLabel(round.payoutFrequency)],
              ['Открытие', round.opensAt ?? 'Не указано'],
              ['Закрытие', round.closesAt ?? 'Не указано'],
            ].map(([label, value]) => (
              <div key={label} className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
                <p className="text-xs uppercase tracking-[0.16em] text-app-cabinet-muted">{label}</p>
                <p className="mt-2 text-sm font-semibold text-app-cabinet-text">{value}</p>
              </div>
            ))}
          </div>
        </AppSurface>

        <AppSurface eyebrow="История" title="История изменений" description="Здесь видны отправка на проверку, публикация, закрытие раунда и выплаты.">
          <AppTimeline items={toTimelineItems(historyQuery.data?.data ?? [])} />
        </AppSurface>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <AppSurface eyebrow="Заявки" title="Инвесторы и заявки" description="Здесь видны все заявки в раунде: новые, подтверждённые и отменённые.">
          {details.allocations.length ? (
            <div className="space-y-3">
              {details.allocations.map((allocation) => (
                <div key={allocation.id} className="flex flex-col gap-3 border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-app-cabinet-text">{allocation.investorName ?? allocation.investorEmail ?? 'Инвестор'}</p>
                    <p className="mt-1 text-sm text-app-cabinet-muted">{formatMoney(allocation.amount)}</p>
                  </div>
                  <AppStatusBadge status={allocation.status} />
                </div>
              ))}
            </div>
          ) : (
            <AppEmptyState title="Заявок пока нет" description="Когда инвесторы начнут подавать заявки, они появятся здесь." />
          )}
        </AppSurface>

        <AppSurface eyebrow="Распределения" title="Выплаты и документы раунда" description="Список распределений и действия для согласования выплат.">
          {details.distributions.length ? (
            <div className="space-y-3">
              {details.distributions.map((distribution) => (
                <div key={distribution.id} className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-app-cabinet-text">{distribution.title}</p>
                      <p className="mt-1 text-sm text-app-cabinet-muted">{distribution.periodLabel} · {formatMoney(distribution.totalAmount)}</p>
                    </div>
                    <AppStatusBadge status={distribution.status} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 rounded-full border-app-cabinet-border bg-app-cabinet-surface px-3 text-app-cabinet-text"
                      onClick={async () => {
                        try {
                          await approveDistributionMutation.mutateAsync({
                            distributionId: distribution.id,
                            roundSlug: slug,
                          });
                          toast.success('Распределение согласовано');
                        } catch (error) {
                          toast.error(getApiErrorMessage(error, 'Не удалось согласовать распределение.'));
                        }
                      }}
                    >
                      Согласовать
                    </Button>
                    <Button
                      type="button"
                      className="h-10 rounded-full bg-app-cabinet-primary px-3 text-white hover:bg-app-cabinet-primary-strong"
                      onClick={async () => {
                        try {
                          await runDistributionMutation.mutateAsync({
                            distributionId: distribution.id,
                            roundSlug: slug,
                          });
                          toast.success('Выплаты по распределению запущены');
                        } catch (error) {
                          toast.error(getApiErrorMessage(error, 'Не удалось запустить выплаты.'));
                        }
                      }}
                    >
                      Запустить выплаты
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AppEmptyState title="Распределений пока нет" description="Когда по раунду начнутся выплаты, здесь появится список распределений." />
          )}
        </AppSurface>
      </div>
    </div>
  );
}
