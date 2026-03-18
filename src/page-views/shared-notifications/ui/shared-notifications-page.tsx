'use client';

import { Bell } from 'lucide-react';
import { useNotificationsQuery } from '@/entities/cabinet/api/hooks';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';

export default function SharedNotificationsPage() {
  const notificationsQuery = useNotificationsQuery();
  const notifications = notificationsQuery.data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Уведомления</h1>
          <p className="mt-1 text-sm text-brand-text-muted">Единая лента событий</p>
        </div>
      </div>
      {notifications.length ? (
        <div className="cabinet-card shadow-none">
          <div className="divide-y divide-[#E2E8F0]">
            {notifications.slice(0, 6).map((notification) => (
              <div key={notification.id} className="p-4 transition-colors hover:bg-gray-50">
                <p className="text-sm font-medium text-brand-text">{notification.title}</p>
                <p className="mt-1 text-xs text-brand-text-muted">{notification.body}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <AppEmptyState icon={Bell} title="Нет новых уведомлений" description="Мы сообщим вам, когда появится что-то важное." />
      )}
    </div>
  );
}
