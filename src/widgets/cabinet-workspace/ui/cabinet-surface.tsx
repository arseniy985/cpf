import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/shared/lib/classnames';

type CabinetSurfaceProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  variant?: 'panel' | 'subtle' | 'hero';
};

export function CabinetSurface({
  eyebrow,
  title,
  description,
  action,
  children,
  className,
  contentClassName,
  variant = 'panel',
}: CabinetSurfaceProps) {
  const variants = {
    panel: {
      card: 'rounded-[28px] border-cabinet-border/70 bg-cabinet-panel-strong shadow-[0_20px_60px_rgba(31,50,66,0.08)]',
      header: 'border-b border-cabinet-border/65 px-6 py-5',
      title: 'text-xl font-semibold tracking-tight text-cabinet-ink',
      description: 'mt-2 text-sm leading-relaxed text-cabinet-muted-ink',
      content: 'px-6 pb-6',
    },
    subtle: {
      card: 'rounded-[24px] border-cabinet-border/65 bg-cabinet-panel shadow-none',
      header: 'border-b border-cabinet-border/55 px-5 py-4',
      title: 'text-lg font-semibold tracking-tight text-cabinet-ink',
      description: 'mt-1.5 text-sm leading-relaxed text-cabinet-muted-ink',
      content: 'px-5 pb-5',
    },
    hero: {
      card: 'rounded-[32px] border-cabinet-border bg-[linear-gradient(135deg,rgba(255,253,249,0.98),rgba(243,226,212,0.72))] shadow-[0_24px_70px_rgba(31,50,66,0.09)]',
      header: 'border-b border-cabinet-border/70 px-6 py-6',
      title: 'text-[26px] font-semibold tracking-tight text-cabinet-ink sm:text-[30px]',
      description: 'mt-2 text-sm leading-relaxed text-cabinet-muted-ink',
      content: 'px-6 pb-6',
    },
  } as const;

  const styles = variants[variant];

  return (
    <Card className={cn(styles.card, className)}>
      <CardHeader className={cn('space-y-2', styles.header)}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {eyebrow ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cabinet-accent-strong">
                {eyebrow}
              </p>
            ) : null}
            <CardTitle className={styles.title}>{title}</CardTitle>
            {description ? <CardDescription className={styles.description}>{description}</CardDescription> : null}
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent className={cn(styles.content, contentClassName)}>{children}</CardContent>
    </Card>
  );
}
