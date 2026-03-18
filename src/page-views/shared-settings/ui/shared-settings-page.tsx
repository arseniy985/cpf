'use client';

import { Settings } from 'lucide-react';
import { useSession } from '@/features/session/model/use-session';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';

export default function SharedSettingsPage() {
  const session = useSession();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Настройки аккаунта</h1>
          <p className="mt-1 text-sm text-brand-text-muted">Профиль, безопасность и уведомления</p>
        </div>
      </div>
      {session.user ? (
        <div className="cabinet-card shadow-none">
          <div className="p-12 text-center">
            <h3 className="mb-2 text-lg font-semibold text-brand-text">Настройки аккаунта</h3>
            <p className="text-sm text-brand-text-muted">Здесь будут доступны профиль, безопасность входа и настройки уведомлений.</p>
          </div>
        </div>
      ) : (
        <AppEmptyState
          icon={Settings}
          title="Настройки загружаются"
          description="Здесь вы сможете управлять параметрами своего аккаунта."
        />
      )}
    </div>
  );
}
