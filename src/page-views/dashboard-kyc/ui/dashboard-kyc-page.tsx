'use client';

import type { ComponentType } from 'react';
import { AlertTriangle, CheckCircle2, FileCheck2 } from 'lucide-react';
import { useKycDocumentsQuery, useKycProfileQuery } from '@/entities/cabinet/api/hooks';
import { useSession } from '@/features/session/model/use-session';
import { formatDateTime } from '@/shared/lib/format';
import { downloadAuthenticatedFile } from '@/shared/lib/files/download-authenticated-file';
import { Button } from '@/components/ui/button';
import { CabinetEmptyState } from '@/widgets/cabinet-workspace/ui/cabinet-empty-state';
import { CabinetPageHeader } from '@/widgets/cabinet-workspace/ui/cabinet-page-header';
import { CabinetStatCard } from '@/widgets/cabinet-workspace/ui/cabinet-stat-card';
import { CabinetSurface } from '@/widgets/cabinet-workspace/ui/cabinet-surface';
import { StatusBadge } from '@/shared/ui/status-badge';
import { KycDocumentUploadForm } from '@/features/kyc-document-upload/ui/kyc-document-upload-form';
import { KycProfileForm } from '@/features/kyc-profile/ui/kyc-profile-form';

export default function DashboardKycPage() {
  const session = useSession();
  const profileQuery = useKycProfileQuery();
  const documentsQuery = useKycDocumentsQuery();

  if (!session.token || profileQuery.isPending || documentsQuery.isPending) {
    return null;
  }

  const profile = profileQuery.data?.data ?? null;
  const documents = documentsQuery.data?.data ?? [];

  return (
    <div className="space-y-6">
      <CabinetPageHeader
        eyebrow="Проверка профиля"
        title="Проверка профиля"
        description="Заполните анкету и загрузите документы. После этого менеджер проверит данные вручную."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <CabinetStatCard label="Документов" value={String(documents.length)} accent={<IconAccent icon={FileCheck2} />} />
        <CabinetStatCard label="Отклонено" value={String(documents.filter((item) => item.status === 'rejected').length)} accent={<IconAccent icon={AlertTriangle} />} />
        <CabinetStatCard label="Проверено" value={profile?.reviewedAt ? formatDateTime(profile.reviewedAt) : 'Еще не проверено'} accent={<IconAccent icon={CheckCircle2} />} />
      </div>

      {profile?.notes ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
          <p className="font-semibold">Комментарий менеджера</p>
          <p className="mt-1 leading-relaxed">{profile.notes}</p>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <CabinetSurface title="Анкета" description="Основные данные для проверки профиля.">
          <div className="mb-5 flex flex-wrap gap-3">
            {profile ? <StatusBadge status={profile.status} /> : null}
            {profile?.submittedAt ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                Подано: {formatDateTime(profile.submittedAt)}
              </div>
            ) : null}
            {profile?.reviewedAt ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                Проверено: {formatDateTime(profile.reviewedAt)}
              </div>
            ) : null}
          </div>
          <KycProfileForm profile={profile} />
        </CabinetSurface>

        <CabinetSurface title="Документы" description="Загрузите документы, которые нужны для проверки профиля.">
          <div className="space-y-5">
            <KycDocumentUploadForm />

            {documents.length === 0 ? (
              <CabinetEmptyState
                title="Документы еще не загружены"
                description="Добавьте паспорт, ИНН или другие файлы, чтобы менеджер мог завершить проверку."
              />
            ) : (
              <div className="space-y-3">
                {documents.map((document) => (
                  <div key={document.id} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-950">{document.originalName}</p>
                        <p className="mt-1 text-sm text-slate-600">{document.kind}</p>
                        <p className="mt-2 text-xs text-slate-500">{formatDateTime(document.createdAt)}</p>
                        {document.reviewComment ? (
                          <p className="mt-3 text-sm text-rose-700">{document.reviewComment}</p>
                        ) : null}
                      </div>
                      <StatusBadge status={document.status} />
                    </div>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        className="rounded-lg border-slate-200 bg-white"
                        onClick={async () => {
                          await downloadAuthenticatedFile({
                            url: document.downloadUrl,
                            filename: document.originalName,
                          });
                        }}
                      >
                        Скачать файл
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CabinetSurface>
      </div>
    </div>
  );
}

function IconAccent({
  icon: Icon,
}: {
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
      <Icon className="h-4 w-4" />
    </div>
  );
}
