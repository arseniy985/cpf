'use client';

import { useOwnerTeamQuery } from '@/entities/owner-team/api/hooks';
import { toTimelineItems } from '@/entities/audit-log/model/to-timeline-items';
import { formatDateTime } from '@/shared/lib/format';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';
import { AppPageHeader } from '@/shared/ui/app-cabinet/app-page-header';
import { AppStatusBadge } from '@/shared/ui/app-cabinet/app-status-badge';
import { AppSurface } from '@/shared/ui/app-cabinet/app-surface';
import { AppTimeline } from '@/shared/ui/app-cabinet/app-timeline';

export default function OwnerTeamPageV2() {
  const teamQuery = useOwnerTeamQuery();
  const team = teamQuery.data?.data;

  return (
    <div className="space-y-6">
      <AppPageHeader
        eyebrow="Owner workspace"
        title="Команда и настройки"
        description="Команда owner workspace, роли, история действий и актуальные юридические документы в одном рабочем разделе."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <AppSurface eyebrow="Команда" title="Участники owner workspace" description="Состав команды читается из owner account и показывает текущие роли, статусы и последнюю активность.">
          {team?.members.length ? (
            <div className="space-y-3">
              {team.members.map((member) => (
                <div key={member.id} className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-app-cabinet-text">{member.name}</p>
                      <p className="mt-1 text-sm text-app-cabinet-muted">{member.email}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-app-cabinet-muted">
                        В команде с {member.joinedAt ? formatDateTime(member.joinedAt) : 'дата не указана'}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <AppStatusBadge status={member.status} />
                      <AppStatusBadge status={member.role} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <AppEmptyState title="Команда пока не сформирована" description="Как только в owner account появятся участники, они будут отображены здесь." />
          )}
        </AppSurface>

        <AppSurface eyebrow="Юридический контур" title="Актуальные документы и оферты" description="Публикуемые юридические документы доступны прямо из owner workspace как операционный reference-контур.">
          {team?.legalDocuments.length ? (
            <div className="space-y-3">
              {team.legalDocuments.map((document) => (
                <div key={document.id} className="border border-app-cabinet-border bg-app-cabinet-surface px-4 py-4">
                  <p className="text-sm font-semibold text-app-cabinet-text">{document.title}</p>
                  <p className="mt-1 text-sm text-app-cabinet-muted">{document.summary ?? document.documentType}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-app-cabinet-muted">
                    {document.publishedAt ? formatDateTime(document.publishedAt) : 'Без даты публикации'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <AppEmptyState title="Юридических документов пока нет" description="Когда опубликованные документы появятся в backend, они будут доступны и здесь." />
          )}
        </AppSurface>
      </div>

      <AppSurface eyebrow="История" title="История действий" description="Timeline по owner account и команде берётся из backend activity log и не зависит от локального UI-состояния.">
        <AppTimeline items={toTimelineItems(team?.activity ?? [])} />
      </AppSurface>
    </div>
  );
}
