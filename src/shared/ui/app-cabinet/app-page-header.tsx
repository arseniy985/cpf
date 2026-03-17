import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/classnames';

type AppPageHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  status?: ReactNode;
  actions?: ReactNode;
  summary?: ReactNode;
  className?: string;
};

export function AppPageHeader({
  eyebrow,
  title,
  description,
  status,
  actions,
  summary,
  className,
}: AppPageHeaderProps) {
  return (
    <header className={cn('border border-app-cabinet-border bg-app-cabinet-surface px-5 py-5 sm:px-6 sm:py-6', className)}>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-app-cabinet-muted">
              {eyebrow}
            </p>
            {status}
          </div>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-app-cabinet-text sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-app-cabinet-muted">{description}</p>
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {actions}
          </div>
        ) : null}
      </div>
      {summary ? <div className="mt-5 flex flex-wrap gap-2">{summary}</div> : null}
    </header>
  );
}
