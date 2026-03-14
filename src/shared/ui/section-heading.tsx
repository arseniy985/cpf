import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/classnames';
import { Badge } from '@/components/ui/badge';

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
      <div>
        {eyebrow ? (
          <Badge variant="outline" className="border-primary/20 bg-primary/8 text-primary">
            {eyebrow}
          </Badge>
        ) : null}
        <h2 className="mt-2 text-2xl font-display font-bold text-indigo-950">{title}</h2>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
