'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMarkNotificationAsReadMutation, useNotificationsQuery } from '@/entities/cabinet/api/hooks';
import { normalizeAppHref } from '@/entities/cabinet/model/normalize-app-href';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/shared/lib/format';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';
import { AppPageHeader } from '@/shared/ui/app-cabinet/app-page-header';
import { AppStatusBadge } from '@/shared/ui/app-cabinet/app-status-badge';
import { AppSurface } from '@/shared/ui/app-cabinet/app-surface';

export default function SharedNotificationsPage() {
  const searchParams = useSearchParams();
  const notificationsQuery = useNotificationsQuery();
  const readMutation = useMarkNotificationAsReadMutation();
  const readFilter = searchParams.get('read') ?? 'all';
  const notifications = notificationsQuery.data?.data ?? [];

  const filtered = notifications.filter((notification) => {
    if (readFilter === 'read') {
      return notification.isRead;
    }

    if (readFilter === 'unread') {
      return !notification.isRead;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <AppPageHeader
        eyebrow="Общее пространство"
        title="Уведомления"
        description="Единая лента investor и owner событий: статусы проверок, операций, проектов, раундов и выплат."
        status={<AppStatusBadge status={filtered.some((item) => !item.isRead) ? 'pending' : 'approved'} />}
      />

      <AppSurface eyebrow="Фильтры" title="Отметки чтения" description="Фильтр вынесен в URL, чтобы легко ссылаться на непрочитанную или полную ленту.">
        <div className="flex flex-wrap gap-2">
          {['all', 'unread', 'read'].map((read) => (
            <Button key={read} asChild variant={readFilter === read ? 'default' : 'outline'} className={readFilter === read ? 'h-10 rounded-none bg-app-cabinet-primary px-3 text-white hover:bg-app-cabinet-primary-strong' : 'h-10 rounded-none border-app-cabinet-border bg-app-cabinet-surface px-3 text-app-cabinet-text hover:bg-app-cabinet-secondary'}>
              <Link href={`?read=${read}`}>{read === 'all' ? 'Все' : read === 'unread' ? 'Непрочитанные' : 'Прочитанные'}</Link>
            </Button>
          ))}
        </div>
      </AppSurface>

      <AppSurface eyebrow="Лента" title="Последние уведомления" description="Из уведомления можно сразу перейти в нужный раздел или отметить событие как прочитанное.">
        {filtered.length === 0 ? (
          <AppEmptyState title="Уведомлений нет" description="Когда появятся новые статусы по операциям, проверке, проектам или выплатам, они будут показаны в этой ленте." />
        ) : (
          <div className="space-y-3">
            {filtered.map((notification) => (
              <div key={notification.id} className="border border-app-cabinet-border bg-app-cabinet-surface p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-app-cabinet-text">{notification.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-app-cabinet-muted">{notification.body}</p>
                    <p className="mt-3 text-xs text-app-cabinet-muted">{formatDateTime(notification.createdAt)}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <AppStatusBadge status={notification.isRead ? 'approved' : 'pending'} />
                    {normalizeAppHref(notification.actionUrl) ? (
                      <Button asChild variant="outline" className="h-9 rounded-none border-app-cabinet-border bg-app-cabinet-surface px-3 text-app-cabinet-text hover:bg-app-cabinet-secondary">
                        <Link href={normalizeAppHref(notification.actionUrl) ?? '/app/notifications'}>Открыть</Link>
                      </Button>
                    ) : null}
                    {!notification.isRead ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="h-9 rounded-none border-app-cabinet-border bg-app-cabinet-surface px-3 text-app-cabinet-text hover:bg-app-cabinet-secondary"
                        onClick={() => void readMutation.mutateAsync({ id: notification.id })}
                      >
                        Отметить прочитанным
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AppSurface>
    </div>
  );
}
