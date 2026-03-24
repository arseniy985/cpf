'use client';

import { useOwnerOrganizationHistoryQuery } from '@/entities/audit-log/api/hooks';
import { toTimelineItems } from '@/entities/audit-log/model/to-timeline-items';
import { useOwnerWorkspaceQuery } from '@/entities/owner-account/api/hooks';
import { OwnerOnboardingForms } from '@/features/app-forms/ui/owner-onboarding-forms';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';
import { AppPageHeader } from '@/shared/ui/app-cabinet/app-page-header';
import { AppStatusBadge } from '@/shared/ui/app-cabinet/app-status-badge';
import { AppSurface } from '@/shared/ui/app-cabinet/app-surface';
import { AppTimeline } from '@/shared/ui/app-cabinet/app-timeline';

export default function OwnerOrganizationPageV2() {
  const workspaceQuery = useOwnerWorkspaceQuery();
  const historyQuery = useOwnerOrganizationHistoryQuery();

  if (workspaceQuery.isPending) {
    return (
      <AppEmptyState
        title="Собираем карточку организации…"
        description="Подгружаем данные компании, реквизиты, статус проверки и историю изменений."
      />
    );
  }

  const workspace = workspaceQuery.data?.data;

  if (!workspace) {
    return (
      <AppEmptyState
        title="Организация недоступна"
        description="Не удалось загрузить данные компании."
      />
    );
  }

  return (
    <div className="space-y-6">
      <AppPageHeader
        eyebrow="Кабинет владельца"
        title="Организация"
        description="Данные компании, реквизиты, документы и история изменений собраны в одном месте."
        status={<AppStatusBadge status={workspace.onboarding.status} />}
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AppSurface eyebrow="Профиль" title={workspace.account.displayName} description={workspace.account.overview ?? 'Описание компании пока не заполнено.'}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border border-app-cabinet-border bg-app-cabinet-secondary/35 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.16em] text-app-cabinet-muted">Статус</p>
              <AppStatusBadge status={workspace.account.status} className="mt-3" />
            </div>
            <div className="border border-app-cabinet-border bg-app-cabinet-secondary/35 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.16em] text-app-cabinet-muted">Сайт</p>
              <p className="mt-3 break-all text-sm font-semibold text-app-cabinet-text">{workspace.account.websiteUrl ?? workspace.organization.websiteUrl ?? 'Не указан'}</p>
            </div>
            <div className="border border-app-cabinet-border bg-app-cabinet-secondary/35 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.16em] text-app-cabinet-muted">Юрлицо</p>
              <p className="mt-3 text-sm font-semibold text-app-cabinet-text">{workspace.organization.legalName ?? 'Не заполнено'}</p>
            </div>
            <div className="border border-app-cabinet-border bg-app-cabinet-secondary/35 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.16em] text-app-cabinet-muted">Реквизиты</p>
              <p className="mt-3 text-sm font-semibold text-app-cabinet-text">{workspace.bankProfile.maskedBankAccount ?? workspace.bankProfile.bankAccount ?? 'Не заполнено'}</p>
            </div>
          </div>
        </AppSurface>

        <AppSurface eyebrow="История" title="История изменений" description="Здесь видны отправка на проверку, смена статусов и последние действия по компании.">
          <AppTimeline items={toTimelineItems(historyQuery.data?.data ?? [])} />
        </AppSurface>
      </div>

      <AppSurface eyebrow="Формы" title="Данные компании и реквизиты" description="Форма разбита по смысловым блокам: профиль, компания и реквизиты. Так проще заполнять и обновлять данные.">
        <OwnerOnboardingForms />
      </AppSurface>
    </div>
  );
}
