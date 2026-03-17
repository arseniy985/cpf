import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/classnames';

type CabinetPageHeaderProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function CabinetPageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: CabinetPageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between', className)}>
      <div className="max-w-4xl">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cabinet-accent-strong">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-cabinet-ink text-balance sm:text-[38px] sm:leading-[1.05]">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-cabinet-muted-ink text-pretty sm:text-[15px]">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3 lg:justify-end">{actions}</div> : null}
    </div>
  );
}
