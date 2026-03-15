'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { BellDot, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useMarkNotificationAsReadMutation, useNotificationsQuery } from '@/entities/cabinet/api/hooks';
import { useSession } from '@/features/session/model/use-session';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { formatDateTime } from '@/shared/lib/format';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CabinetEmptyState } from '@/widgets/cabinet-workspace/ui/cabinet-empty-state';
import { CabinetPageHeader } from '@/widgets/cabinet-workspace/ui/cabinet-page-header';
import { CabinetStatCard } from '@/widgets/cabinet-workspace/ui/cabinet-stat-card';
import { CabinetSurface } from '@/widgets/cabinet-workspace/ui/cabinet-surface';

export default function DashboardNotificationsPage() {
  const session = useSession();
  const notificationsQuery = useNotificationsQuery();
  const markAsReadMutation = useMarkNotificationAsReadMutation();

  if (!session.token) {
    return null;
  }

  if (notificationsQuery.isPending) {
    return (
      <CabinetEmptyState
        title="Загружаем уведомления…"
        description="Собираем последние события и статусы по кабинету."
      />
    );
  }

  if (notificationsQuery.isError) {
    return (
      <CabinetEmptyState
        title="Уведомления временно недоступны"
        description="Не удалось загрузить ленту событий. Попробуйте обновить страницу позже."
      />
    );
  }

  const notifications = notificationsQuery.data?.data ?? [];
  const unread = notifications.filter((item) => !item.isRead).length;
  const actionable = notifications.filter((item) => Boolean(item.actionUrl)).length;

  return (
    <div className="space-y-7">
      <CabinetPageHeader
        eyebrow="Уведомления"
        title="Уведомления"
        description="Лента изменений без лишних метрик: что произошло, требует ли это вашего участия и куда перейти дальше."
      />

      <CabinetSurface
        eyebrow="Сводка"
        title="Сигнальный контур"
        description="Непрочитанные события и уведомления с действиями вынесены в отдельный короткий бриф."
        variant="hero"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <CabinetStatCard
            label="Всего событий"
            value={String(notifications.length)}
            hint="Полная история изменений по кабинету"
            accent={<StatIcon icon={<BellDot className="h-4 w-4" />} />}
            variant="quiet"
          />
          <CabinetStatCard
            label="Непрочитанные"
            value={String(unread)}
            hint="Имеют приоритет при следующем заходе"
            accent={<StatIcon icon={<Sparkles className="h-4 w-4" />} />}
            variant="quiet"
          />
          <CabinetStatCard
            label="С действиями"
            value={String(actionable)}
            hint="События, которые ведут в конкретный раздел"
            accent={<StatIcon icon={<BellDot className="h-4 w-4" />} />}
            variant="quiet"
          />
        </div>
      </CabinetSurface>

      <CabinetSurface
        eyebrow="Лента"
        title="Лента событий"
        description="Здесь собираются все важные изменения в платформе."
      >
        {notifications.length === 0 ? (
          <CabinetEmptyState
            title="Уведомлений пока нет"
            description="Когда менеджер обновит статус заявки, проверки или операции, событие появится здесь."
          />
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-[24px] border px-4 py-4 ${
                  notification.isRead
                    ? 'border-cabinet-border bg-cabinet-panel-strong'
                    : 'border-cabinet-accent/25 bg-cabinet-accent-soft/55'
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="rounded-full border border-cabinet-border bg-cabinet-panel-strong text-cabinet-muted-ink">
                        {notification.type}
                      </Badge>
                      {!notification.isRead ? (
                        <Badge className="rounded-full border border-cabinet-accent/20 bg-cabinet-accent-soft text-cabinet-accent-strong">
                          Новое
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-3 text-base font-semibold text-cabinet-ink">{notification.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-cabinet-muted-ink">{notification.body}</p>
                    <p className="mt-3 text-xs text-cabinet-muted-ink">{formatDateTime(notification.createdAt)}</p>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    {!notification.isRead ? (
                      <Button
                        variant="outline"
                        className="rounded-full border-cabinet-border bg-cabinet-panel-strong text-cabinet-ink"
                        onClick={async () => {
                          try {
                            await markAsReadMutation.mutateAsync({ id: notification.id });
                            toast.success('Уведомление отмечено как прочитанное');
                          } catch (error) {
                            toast.error(getApiErrorMessage(error, 'Не удалось обновить статус уведомления.'));
                          }
                        }}
                      >
                        Отметить прочитанным
                      </Button>
                    ) : null}
                    {notification.actionUrl ? (
                      <Button asChild className="rounded-full bg-cabinet-ink text-cabinet-panel-strong hover:bg-cabinet-ink/92">
                        <Link href={notification.actionUrl}>Открыть</Link>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CabinetSurface>
    </div>
  );
}

function StatIcon({ icon }: { icon: ReactNode }) {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cabinet-accent-soft text-cabinet-accent-strong">
      {icon}
    </div>
  );
}
