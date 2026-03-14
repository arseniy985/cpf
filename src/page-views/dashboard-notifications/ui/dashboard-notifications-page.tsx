'use client';

import Link from 'next/link';
import { useMarkNotificationAsReadMutation, useNotificationsQuery } from '@/entities/cabinet/api/hooks';
import { useSession } from '@/features/session/model/use-session';
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

  if (!session.token || notificationsQuery.isPending) {
    return null;
  }

  const notifications = notificationsQuery.data?.data ?? [];
  const unread = notifications.filter((item) => !item.isRead).length;

  return (
    <div className="space-y-6">
      <CabinetPageHeader
        eyebrow="Уведомления"
        title="Уведомления"
        description="Все важные изменения по проверкам, операциям и вашим заявкам."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <CabinetStatCard label="Всего событий" value={String(notifications.length)} />
        <CabinetStatCard label="Непрочитанные" value={String(unread)} />
        <CabinetStatCard label="С действиями" value={String(notifications.filter((item) => Boolean(item.actionUrl)).length)} />
      </div>

      <CabinetSurface title="Лента событий" description="Здесь собираются все важные изменения в платформе.">
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
                className={`rounded-lg border px-4 py-4 ${
                  notification.isRead
                    ? 'border-slate-200 bg-white'
                    : 'border-indigo-200 bg-indigo-50/40'
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="rounded-md border border-slate-200 bg-white text-slate-700">
                        {notification.type}
                      </Badge>
                      {!notification.isRead ? (
                        <Badge className="rounded-md border border-indigo-200 bg-indigo-100 text-indigo-700">
                          Новое
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-3 text-base font-semibold text-slate-950">{notification.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{notification.body}</p>
                    <p className="mt-3 text-xs text-slate-500">{formatDateTime(notification.createdAt)}</p>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    {!notification.isRead ? (
                      <Button
                        variant="outline"
                        className="rounded-lg border-slate-200 bg-white"
                        onClick={async () => {
                          try {
                            await markAsReadMutation.mutateAsync({ id: notification.id });
                          } catch {
                            return;
                          }
                        }}
                      >
                        Отметить прочитанным
                      </Button>
                    ) : null}
                    {notification.actionUrl ? (
                      <Link href={notification.actionUrl}>
                        <Button className="rounded-lg">Открыть</Button>
                      </Link>
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
