'use client';

import type { ComponentType } from 'react';
import { AlertTriangle, CheckCircle2, FileCheck2, FileText, ShieldCheck } from 'lucide-react';
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

  if (!session.token) {
    return null;
  }

  if (profileQuery.isPending || documentsQuery.isPending) {
    return (
      <CabinetEmptyState
        title="Загружаем проверку профиля…"
        description="Собираем анкету, документы и текущий статус проверки."
      />
    );
  }

  if (profileQuery.isError || documentsQuery.isError) {
    return (
      <CabinetEmptyState
        title="Проверка профиля временно недоступна"
        description="Не удалось загрузить анкету или документы. Попробуйте обновить страницу позже."
      />
    );
  }

  const profile = profileQuery.data?.data ?? null;
  const documents = documentsQuery.data?.data ?? [];

  return (
    <div className="space-y-6">
      <CabinetPageHeader
        eyebrow="Проверка профиля"
        title={<>Проверка личности и <span className="text-cabinet-accent-strong">документов</span></>}
        description="Заполните анкету без сокращений и загрузите подтверждающие документы. После отправки менеджер проведёт ручную проверку."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <CabinetStatCard
          label={<>Файлы в <span className="text-cabinet-accent-strong">контуре</span></>}
          value={String(documents.length)}
          hint="Загруженные документы, доступные менеджеру для проверки"
          accent={<IconAccent icon={FileCheck2} tone="border-cabinet-accent/15 bg-cabinet-accent-soft text-cabinet-accent-strong" />}
        />
        <CabinetStatCard
          label={<>Требуют <span className="text-cabinet-accent-strong">исправления</span></>}
          value={String(documents.filter((item) => item.status === 'rejected').length)}
          hint="Файлы, по которым менеджер оставил замечание"
          accent={<IconAccent icon={AlertTriangle} tone="border-amber-200 bg-amber-50 text-cabinet-warning" />}
        />
        <CabinetStatCard
          label={<>Последняя <span className="text-cabinet-accent-strong">проверка</span></>}
          value={profile?.reviewedAt ? formatDateTime(profile.reviewedAt) : 'Ещё не проверено'}
          hint="Дата последнего подтверждения или возврата анкеты на доработку"
          accent={<IconAccent icon={CheckCircle2} tone="border-emerald-200 bg-emerald-50 text-cabinet-success" />}
        />
      </div>

      {profile?.notes ? (
        <div className="rounded-[16px] border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-amber-200/80 bg-white/70 text-amber-700">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold">Комментарий менеджера</p>
              <p className="mt-1 leading-relaxed text-pretty">{profile.notes}</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <CabinetSurface
          eyebrow="Анкета"
          title={<>Персональные <span className="text-cabinet-accent-strong">данные</span></>}
          description="Укажите данные в точном соответствии с документом. Ошибки в имени, номере документа или адресе замедляют проверку."
        >
          <div className="mb-5 flex flex-wrap gap-3">
            {profile ? <StatusBadge status={profile.status} /> : null}
            {profile?.submittedAt ? (
              <div className="rounded-[12px] border border-cabinet-border/80 bg-cabinet-panel px-3 py-2 text-sm text-cabinet-muted-ink">
                Подано: {formatDateTime(profile.submittedAt)}
              </div>
            ) : null}
            {profile?.reviewedAt ? (
              <div className="rounded-[12px] border border-cabinet-border/80 bg-cabinet-panel px-3 py-2 text-sm text-cabinet-muted-ink">
                Проверено: {formatDateTime(profile.reviewedAt)}
              </div>
            ) : null}
          </div>
          <KycProfileForm profile={profile} />
        </CabinetSurface>

        <CabinetSurface
          eyebrow="Файлы"
          title={<>Документы для <span className="text-cabinet-accent-strong">проверки</span></>}
          description="Загрузите читаемые файлы без обрезанных краёв и бликов. По каждому документу сохраняется отдельный статус."
        >
          <div className="space-y-5">
            <KycDocumentUploadForm />

            {documents.length === 0 ? (
              <CabinetEmptyState
                title="Документы ещё не загружены"
                description="Добавьте паспорт, ИНН и другие файлы, чтобы менеджер мог начать проверку."
              />
            ) : (
              <div className="space-y-3">
                {documents.map((document) => (
                  <div key={document.id} className="rounded-[16px] border border-cabinet-border/80 bg-cabinet-panel px-4 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[12px] border border-cabinet-border/80 bg-cabinet-panel-strong text-cabinet-accent-strong">
                          <FileText className="h-4 w-4" />
                        </div>
                        <p className="text-sm font-medium text-cabinet-ink">{document.originalName}</p>
                        <p className="mt-1 text-sm text-cabinet-muted-ink">{document.kind}</p>
                        <p className="mt-2 text-xs text-cabinet-muted-ink">{formatDateTime(document.createdAt)}</p>
                        {document.reviewComment ? (
                          <p className="mt-3 rounded-[12px] border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                            {document.reviewComment}
                          </p>
                        ) : null}
                      </div>
                      <StatusBadge status={document.status} />
                    </div>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        className="rounded-[12px] border-cabinet-border bg-cabinet-panel-strong"
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
  tone,
}: {
  icon: ComponentType<{ className?: string }>;
  tone: string;
}) {
  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-[12px] border ${tone}`}>
      <Icon className="h-4 w-4" />
    </div>
  );
}
