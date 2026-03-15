'use client';

import { toast } from 'sonner';
import { useOwnerWorkspaceQuery, useSubmitOwnerOnboardingMutation } from '@/entities/owner-account/api/hooks';
import { useSession } from '@/features/session/model/use-session';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { CabinetEmptyState } from '@/widgets/cabinet-workspace/ui/cabinet-empty-state';
import { CabinetPageHeader } from '@/widgets/cabinet-workspace/ui/cabinet-page-header';
import { OwnerActionRail } from './owner-action-rail';
import { OwnerProjectSnapshot } from './owner-project-snapshot';
import { OwnerWorkspaceHero } from './owner-workspace-hero';

export default function OwnerOverviewPage() {
  const session = useSession();
  const workspaceQuery = useOwnerWorkspaceQuery();
  const submitMutation = useSubmitOwnerOnboardingMutation();

  if (!session.token || workspaceQuery.isPending) {
    return null;
  }

  if (workspaceQuery.isError || !workspaceQuery.data?.data) {
    return (
      <CabinetEmptyState
        title="Кабинет владельца недоступен"
        description="Не удалось загрузить данные кабинета. Повторите попытку немного позже."
      />
    );
  }

  const workspace = workspaceQuery.data.data;

  return (
    <div className="space-y-6">
      <CabinetPageHeader
        eyebrow="Кабинет владельца"
        title="Кабинет объекта"
        description="Здесь собраны данные компании, проверка профиля, проекты и быстрый переход к следующему шагу."
      />

      <OwnerWorkspaceHero
        workspace={workspace}
        isSubmitting={submitMutation.isPending}
        onSubmit={async () => {
          try {
            await submitMutation.mutateAsync();
            toast.success('Профиль компании отправлен на проверку');
          } catch (error) {
            toast.error(getApiErrorMessage(error, 'Не удалось отправить профиль компании на проверку.'));
          }
        }}
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <OwnerActionRail workspace={workspace} />
        <OwnerProjectSnapshot workspace={workspace} />
      </div>
    </div>
  );
}
