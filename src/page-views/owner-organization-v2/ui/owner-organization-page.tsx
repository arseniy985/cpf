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
        description="Подтягиваем owner account, юрлицо, реквизиты, статусы проверки и историю изменений."
      />
    );
  }

  const workspace = workspaceQuery.data?.data;

  if (!workspace) {
    return (
      <AppEmptyState
        title="Организация недоступна"
        description="Не удалось загрузить owner-профиль организации."
      />
    );
  }

  return (
    <div className="space-y-6">
      <AppPageHeader
        eyebrow="Owner workspace"
        title="Организация"
        description="Карточка owner account, данные юрлица, реквизиты, статусы проверки и рабочая история изменений собраны в одном месте."
        status={<AppStatusBadge status={workspace.onboarding.status} />}
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AppSurface eyebrow="Owner account" title={workspace.account.displayName} description={workspace.account.overview ?? 'Описание кабинета пока не заполнено.'}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border border-app-cabinet-border bg-app-cabinet-secondary/35 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.16em] text-app-cabinet-muted">Статус</p>
              <AppStatusBadge status={workspace.account.status} className="mt-3" />
            </div>
            <div className="border border-app-cabinet-border bg-app-cabinet-secondary/35 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.16em] text-app-cabinet-muted">Slug</p>
              <p className="mt-3 text-sm font-semibold text-app-cabinet-text">{workspace.account.slug}</p>
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

        <AppSurface eyebrow="История" title="История изменений" description="Timeline нужен, чтобы видеть отправку на проверку, статусы и последнюю активность по owner onboarding.">
          <AppTimeline items={toTimelineItems(historyQuery.data?.data ?? [])} />
        </AppSurface>
      </div>

      <AppSurface eyebrow="Формы" title="Owner onboarding / KYB form" description="Форма разбита по backend-срезам: owner account, организация и реквизиты. Это упрощает сохранение и повторную проверку.">
        <OwnerOnboardingForms />
      </AppSurface>
    </div>
  );
}
