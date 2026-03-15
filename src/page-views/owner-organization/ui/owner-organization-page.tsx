'use client';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useOwnerWorkspaceQuery, useSubmitOwnerOnboardingMutation } from '@/entities/owner-account/api/hooks';
import { useSession } from '@/features/session/model/use-session';
import { OwnerAccountProfileForm } from '@/features/owner-account/ui/owner-account-profile-form';
import { OwnerBankProfileForm } from '@/features/owner-account/ui/owner-bank-profile-form';
import { OwnerOrganizationForm } from '@/features/owner-account/ui/owner-organization-form';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { formatDateTime } from '@/shared/lib/format';
import { StatusBadge } from '@/shared/ui/status-badge';
import { CabinetEmptyState } from '@/widgets/cabinet-workspace/ui/cabinet-empty-state';
import { CabinetPageHeader } from '@/widgets/cabinet-workspace/ui/cabinet-page-header';
import { CabinetSurface } from '@/widgets/cabinet-workspace/ui/cabinet-surface';

export default function OwnerOrganizationPage() {
  const session = useSession();
  const workspaceQuery = useOwnerWorkspaceQuery();
  const submitMutation = useSubmitOwnerOnboardingMutation();

  if (!session.token || workspaceQuery.isPending) {
    return null;
  }

  if (workspaceQuery.isError || !workspaceQuery.data?.data) {
    return (
      <CabinetEmptyState
        title="Данные компании недоступны"
        description="Не удалось загрузить профиль организации и реквизитов."
      />
    );
  }

  const workspace = workspaceQuery.data.data;

  return (
    <div className="space-y-6">
      <CabinetPageHeader
        eyebrow="Профиль компании"
        title="Организация и расчеты"
        description="Заполните описание компании, юридические данные и банковские реквизиты для проверки и расчетов."
        actions={(
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={workspace.onboarding.status} />
            <Button
              onClick={async () => {
                try {
                  await submitMutation.mutateAsync();
                  toast.success('Профиль компании отправлен на проверку');
                } catch (error) {
                  toast.error(getApiErrorMessage(error, 'Не удалось отправить профиль компании.'));
                }
              }}
              disabled={!workspace.onboarding.canSubmitForReview || submitMutation.isPending}
            >
              {submitMutation.isPending ? 'Отправляем…' : 'Отправить на проверку'}
            </Button>
          </div>
        )}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <OnboardingSignal label="Готовность" value={`${workspace.onboarding.progressPercent}%`} hint="По списку обязательных данных" />
        <OnboardingSignal label="Последняя отправка" value={workspace.onboarding.submittedAt ? formatDateTime(workspace.onboarding.submittedAt) : 'Не отправляли'} hint="Статус верификации" />
        <OnboardingSignal label="Расчетный счет" value={workspace.bankProfile.maskedBankAccount ?? 'Не указан'} hint="Виден только в вашем кабинете" />
      </div>

      {workspace.onboarding.rejectionReason ? (
        <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          <p className="font-semibold">Есть замечание по проверке</p>
          <p className="mt-1 leading-relaxed">{workspace.onboarding.rejectionReason}</p>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <CabinetSurface
          title="Профиль компании"
          description="Эти данные показываются в кабинете и используются при проверке."
        >
          <OwnerAccountProfileForm account={workspace.account} />
        </CabinetSurface>

        <CabinetSurface
          title="Организация"
          description="Юрлицо, подписант и бенефициар, которые нужны для проверки и оформления сделки."
        >
          <OwnerOrganizationForm organization={workspace.organization} />
        </CabinetSurface>
      </div>

      <CabinetSurface
        title="Банковские реквизиты"
        description="Реквизиты для расчетов по проектам и последующих выплат."
      >
        <OwnerBankProfileForm bankProfile={workspace.bankProfile} />
      </CabinetSurface>
    </div>
  );
}

function OnboardingSignal({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-[24px] border border-cabinet-border/65 bg-cabinet-panel-strong px-5 py-4 shadow-[0_12px_32px_rgba(31,50,66,0.05)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cabinet-muted-ink">{label}</p>
      <p className="mt-3 font-mono text-[24px] font-semibold tracking-[-0.04em] text-cabinet-ink">{value}</p>
      <p className="mt-2 text-sm text-cabinet-muted-ink">{hint}</p>
    </div>
  );
}
