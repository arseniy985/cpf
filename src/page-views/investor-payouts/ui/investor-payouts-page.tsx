'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { useDashboardQuery } from '@/entities/cabinet/api/hooks';
import { useSession } from '@/features/session/model/use-session';
import { formatDate, formatDateTime, formatMoney } from '@/shared/lib/format';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';
import { AppKpiCard } from '@/shared/ui/app-cabinet/app-kpi-card';
import { AppPageHeader } from '@/shared/ui/app-cabinet/app-page-header';
import { AppStatusBadge } from '@/shared/ui/app-cabinet/app-status-badge';
import { AppSurface } from '@/shared/ui/app-cabinet/app-surface';

export default function InvestorPayoutsPage() {
  const session = useSession();
  const dashboardQuery = useDashboardQuery();

  if (dashboardQuery.isPending) {
    return (
      <AppEmptyState
        title="Собираем выплаты…"
        description="Подтягиваем ожидаемые начисления, фактические выплаты и ошибки обработки."
      />
    );
  }

  const dashboard = dashboardQuery.data?.data;

  if (!dashboard) {
    return (
      <AppEmptyState
        title="Раздел выплат недоступен"
        description="Не удалось загрузить историю начислений и выплат."
      />
    );
  }

  const expected = dashboard.distributionLines.filter((line) => !line.paidAt);
  const paid = dashboard.distributionLines.filter((line) => line.paidAt);
  const errors = dashboard.distributionLines.filter((line) => line.failureReason);
  const chartData = dashboard.distributionLines.slice(0, 8).map((line, index) => ({
    label: `#${index + 1}`,
    amount: line.amount,
  }));

  return (
    <div className="space-y-6">
      <AppPageHeader
        eyebrow="Investor workspace"
        title="Выплаты и доход"
        description="Раздел показывает ожидаемые начисления, историю фактических выплат и любые задержки или ошибки по процессу."
        summary={(
          <>
            <AppStatusBadge status={session.user?.investorPayoutProfile?.status ?? 'draft'} />
            <AppStatusBadge status={session.user?.kycStatus ?? 'draft'} />
          </>
        )}
      />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <AppKpiCard label="Ожидаемые выплаты" value={formatMoney(expected.reduce((sum, line) => sum + line.amount, 0))} hint="Начисления, которые ещё не завершены выплатой." />
        <AppKpiCard label="Фактические выплаты" value={formatMoney(paid.reduce((sum, line) => sum + line.amount, 0))} hint="Сумма уже обработанных выплат по портфелю." tone="success" />
        <AppKpiCard label="Задержки и ошибки" value={String(errors.length)} hint="Количество выплат, которым требуется ручное внимание." tone="warning" />
        <AppKpiCard label="Способ получения" value={session.user?.investorPayoutProfile?.payoutMethodLabel ?? 'Не настроен'} hint="Текущий способ получения выплат по профилю." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <AppSurface eyebrow="График" title="Начисления по портфелю" description="Функциональный график без декоративных элементов. Нужен только для считывания динамики начислений.">
          {chartData.length ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid stroke="#D5E1EC" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: '#5B6B7C', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value) => formatMoney(Number(value ?? 0))} />
                  <Area type="monotone" dataKey="amount" stroke="#0E2A47" fill="#5FAEE3" fillOpacity={0.18} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <AppEmptyState title="Начислений пока нет" description="Когда по проектам начнутся выплаты, здесь появится график начислений." />
          )}
        </AppSurface>

        <AppSurface eyebrow="Настройка" title="Способ получения выплат" description="Для выплат используется профиль, настроенный в аккаунте. Ошибки и задержки появляются только по факту реальной обработки.">
          <div className="grid gap-3">
            <div className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
              <p className="text-sm font-semibold text-app-cabinet-text">{session.user?.investorPayoutProfile?.payoutMethodLabel ?? 'Способ не указан'}</p>
              <p className="mt-1 text-sm text-app-cabinet-muted">Статус: {session.user?.investorPayoutProfile?.status ?? 'draft'}</p>
            </div>
            <div className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
              <p className="text-sm font-semibold text-app-cabinet-text">Последняя проверка</p>
              <p className="mt-1 text-sm text-app-cabinet-muted">{session.user?.investorPayoutProfile?.lastVerifiedAt ? formatDateTime(session.user.investorPayoutProfile.lastVerifiedAt) : 'Пока не подтверждено'}</p>
            </div>
          </div>
        </AppSurface>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <AppSurface eyebrow="Ожидается" title="Ожидаемые выплаты" description="Все будущие начисления, которые ещё не дошли до фактической выплаты.">
          {expected.length ? (
            <div className="space-y-3">
              {expected.map((line) => (
                <div key={line.id} className="flex flex-col gap-3 border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-app-cabinet-text">{line.allocation.round.projectTitle}</p>
                    <p className="mt-1 text-sm text-app-cabinet-muted">{line.allocation.round.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-app-cabinet-text">{formatMoney(line.amount)}</p>
                    <AppStatusBadge status={line.status} className="mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AppEmptyState title="Ожидаемых выплат нет" description="Когда начисления появятся, этот список покажет их без дополнительной фильтрации." />
          )}
        </AppSurface>

        <AppSurface eyebrow="История" title="Фактические выплаты и ошибки" description="Здесь собраны уже проведённые выплаты и отдельный контур задержек или ошибок.">
          {paid.length || errors.length ? (
            <div className="space-y-3">
              {paid.map((line) => (
                <div key={line.id} className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-app-cabinet-text">{line.allocation.round.projectTitle}</p>
                      <p className="mt-1 text-sm text-app-cabinet-muted">{line.paidAt ? formatDate(line.paidAt) : 'Дата не указана'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-app-cabinet-text">{formatMoney(line.amount)}</p>
                      <AppStatusBadge status={line.payoutInstruction?.status ?? 'completed'} className="mt-2" />
                    </div>
                  </div>
                </div>
              ))}
              {errors.map((line) => (
                <div key={`error-${line.id}`} className="border border-app-cabinet-danger/20 bg-app-cabinet-danger/10 px-4 py-4">
                  <p className="text-sm font-semibold text-app-cabinet-danger">{line.allocation.round.projectTitle}</p>
                  <p className="mt-2 text-sm leading-6 text-app-cabinet-danger">{line.failureReason}</p>
                </div>
              ))}
            </div>
          ) : (
            <AppEmptyState title="История выплат пока пуста" description="Как только выплаты будут обработаны, здесь появится фактическая история начислений." />
          )}
        </AppSurface>
      </div>
    </div>
  );
}
