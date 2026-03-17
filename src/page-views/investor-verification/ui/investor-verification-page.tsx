'use client';

import { useKycDocumentsQuery, useKycProfileQuery } from '@/entities/cabinet/api/hooks';
import { InvestorKycForm } from '@/features/app-forms/ui/investor-kyc-form';
import { formatDateTime } from '@/shared/lib/format';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';
import { AppPageHeader } from '@/shared/ui/app-cabinet/app-page-header';
import { AppStatusBadge } from '@/shared/ui/app-cabinet/app-status-badge';
import { AppSurface } from '@/shared/ui/app-cabinet/app-surface';
import { AppTimeline } from '@/shared/ui/app-cabinet/app-timeline';

const steps = [
  { key: 'profile', label: 'Анкета' },
  { key: 'documents', label: 'Документы' },
  { key: 'review', label: 'Проверка' },
];

export default function InvestorVerificationPage() {
  const profileQuery = useKycProfileQuery();
  const documentsQuery = useKycDocumentsQuery();

  if (profileQuery.isPending && documentsQuery.isPending) {
    return (
      <AppEmptyState
        title="Собираем профиль проверки…"
        description="Подтягиваем анкету, документы и комментарии по текущему статусу KYC."
      />
    );
  }

  const profile = profileQuery.data?.data ?? null;
  const documents = documentsQuery.data?.data ?? [];

  return (
    <div className="space-y-6">
      <AppPageHeader
        eyebrow="Investor workspace"
        title="Проверка профиля"
        description="Здесь находится stepper KYC, анкета, загрузка документов, статус проверки и комментарии менеджера."
        status={<AppStatusBadge status={profile?.status ?? 'draft'} />}
      />

      <AppSurface eyebrow="Степпер" title="Этапы проверки" description="Порядок остаётся линейным: анкета, документы, затем проверка менеджером.">
        <div className="grid gap-3 md:grid-cols-3">
          {steps.map((step, index) => {
            const isComplete = index === 0
              ? Boolean(profile)
              : index === 1
                ? documents.length > 0
                : profile?.status === 'approved';

            return (
              <div key={step.key} className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
                <p className="text-xs uppercase tracking-[0.16em] text-app-cabinet-muted">{`Шаг ${index + 1}`}</p>
                <p className="mt-2 text-sm font-semibold text-app-cabinet-text">{step.label}</p>
                <AppStatusBadge status={isComplete ? 'approved' : index === 2 ? profile?.status : 'draft'} className="mt-3" />
              </div>
            );
          })}
        </div>
      </AppSurface>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <AppSurface eyebrow="Анкета и файлы" title="KYC form" description="Форма сохранения профиля и загрузка обязательных документов в одном рабочем блоке.">
          <InvestorKycForm />
        </AppSurface>

        <div className="space-y-6">
          <AppSurface eyebrow="Статус" title="Текущий статус KYC" description="Статус и ключевые даты выводятся отдельно, чтобы не теряться внутри формы.">
            <div className="space-y-3">
              <div className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
                <p className="text-sm font-semibold text-app-cabinet-text">Статус проверки</p>
                <AppStatusBadge status={profile?.status ?? 'draft'} className="mt-3" />
              </div>
              <div className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
                <p className="text-sm font-semibold text-app-cabinet-text">Комментарий менеджера</p>
                <p className="mt-2 text-sm leading-6 text-app-cabinet-muted">{documents.find((document) => document.reviewComment)?.reviewComment ?? profile?.notes ?? 'Комментариев пока нет.'}</p>
              </div>
            </div>
          </AppSurface>

          <AppSurface eyebrow="История" title="Timeline проверки" description="Последовательность ключевых событий по профилю: создание анкеты, отправка, проверка и решение.">
            <AppTimeline
              items={[
                {
                  id: 'profile-created',
                  title: 'Анкета доступна для заполнения',
                  description: 'Заполните поля профиля и загрузите обязательные документы.',
                  meta: 'Старт проверки',
                },
                ...(profile?.submittedAt ? [{
                  id: 'profile-submitted',
                  title: 'Анкета отправлена на проверку',
                  description: 'Менеджер получил данные профиля и документы для ревью.',
                  meta: formatDateTime(profile.submittedAt),
                }] : []),
                ...(profile?.reviewedAt ? [{
                  id: 'profile-reviewed',
                  title: 'Профиль рассмотрен',
                  description: profile.status === 'approved' ? 'Проверка завершена без блокеров.' : 'По проверке есть замечания или требуется доработка.',
                  meta: formatDateTime(profile.reviewedAt),
                  tone: profile.status === 'approved' ? 'success' as const : 'warning' as const,
                }] : []),
              ]}
            />
          </AppSurface>
        </div>
      </div>
    </div>
  );
}
