'use client';

import Link from 'next/link';
import { ArrowUpRight, BellRing, Sparkles } from 'lucide-react';
import type { OwnerActionItem, OwnerWorkspace } from '@/entities/owner-account/api/types';
import { formatDateTime } from '@/shared/lib/format';
import { CabinetEmptyState } from '@/widgets/cabinet-workspace/ui/cabinet-empty-state';
import { CabinetSurface } from '@/widgets/cabinet-workspace/ui/cabinet-surface';

export function OwnerActionRail({ workspace }: { workspace: OwnerWorkspace }) {
  return (
    <CabinetSurface
      title="Пульт допуска"
      description="Показывает, что нужно сделать, чтобы пройти проверку и перейти к запуску раунда."
      variant="subtle"
      contentClassName="space-y-4"
    >
      {workspace.actionItems.length === 0 ? (
        <CabinetEmptyState
          title="Критических блокеров нет"
          description="Профиль компании заполнен. Можно переходить к проектам, документам и раундам."
        />
      ) : (
        workspace.actionItems.map((item, index) => (
          <ActionCard key={item.key} item={item} index={index + 1} />
        ))
      )}

      <div className="rounded-[22px] border border-cabinet-border/60 bg-cabinet-panel px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cabinet-panel-muted text-cabinet-accent-strong">
            <BellRing className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-cabinet-ink">Последняя активность</p>
            <p className="mt-1 text-sm leading-relaxed text-cabinet-muted-ink">
              {workspace.onboarding.submittedAt
                ? `Профиль отправлен на проверку ${formatDateTime(workspace.onboarding.submittedAt)}.`
                : 'Проверка еще не отправлялась.'}
            </p>
          </div>
        </div>
      </div>
    </CabinetSurface>
  );
}

function ActionCard({ item, index }: { item: OwnerActionItem; index: number }) {
  const toneClass = item.tone === 'warning'
    ? 'border-cabinet-warning/20 bg-cabinet-accent-soft/70'
    : 'border-cabinet-border/60 bg-cabinet-panel';

  return (
    <Link
      href={item.href}
      className={`block rounded-[22px] border px-4 py-4 transition-[transform,border-color,background-color] hover:-translate-y-0.5 hover:border-cabinet-accent/40 ${toneClass}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-cabinet-panel-strong text-sm font-semibold text-cabinet-accent-strong">
            {index}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-cabinet-ink">{item.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-cabinet-muted-ink">{item.description}</p>
          </div>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-cabinet-panel-strong text-cabinet-accent-strong">
          {item.tone === 'warning' ? <Sparkles className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
        </div>
      </div>
    </Link>
  );
}
