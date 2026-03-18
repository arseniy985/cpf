import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/classnames';

type AppPageHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
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
    <header className={cn('flex flex-col justify-between gap-4 sm:flex-row sm:items-center', className)}>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
            {eyebrow}
          </p>
          {status}
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-text">
          {title}
        </h1>
        {description ? <p className="mt-1 text-sm text-brand-text-muted">{description}</p> : null}
        {summary ? <div className="mt-3 flex flex-wrap gap-2">{summary}</div> : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap gap-3">
          {actions}
        </div>
      ) : null}
    </header>
  );
}
