import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/classnames';

type AppSurfaceProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  tone?: 'default' | 'secondary' | 'dark';
};

export function AppSurface({
  eyebrow,
  title,
  description,
  action,
  children,
  className,
  tone = 'default',
}: AppSurfaceProps) {
  return (
    <section
      className={cn(
        'rounded-2xl border px-5 py-5 sm:px-7 sm:py-7',
        tone === 'dark'
          ? 'border-app-cabinet-primary bg-app-cabinet-dark-surface text-white'
          : tone === 'secondary'
            ? 'border-app-cabinet-border bg-app-cabinet-secondary/55'
            : 'border-app-cabinet-border bg-app-cabinet-surface',
        className,
      )}
    >
      <div className={cn(
        'flex flex-col gap-4 border-b pb-5 md:flex-row md:items-start md:justify-between',
        tone === 'dark' ? 'border-white/10' : 'border-app-cabinet-border',
      )}>
        <div className="min-w-0">
          {eyebrow ? (
            <p className={cn('text-[11px] font-semibold uppercase tracking-[0.18em]', tone === 'dark' ? 'text-white/70' : 'text-app-cabinet-muted')}>
              {eyebrow}
            </p>
          ) : null}
          <h2 className={cn('mt-2 text-pretty text-xl font-semibold', tone === 'dark' ? 'text-white' : 'text-app-cabinet-text')}>
            {title}
          </h2>
          {description ? (
            <p className={cn('mt-2 max-w-3xl text-sm leading-6', tone === 'dark' ? 'text-white/72' : 'text-app-cabinet-muted')}>
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}
