import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/shared/lib/classnames';

type CabinetSurfaceProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
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
      card: 'rounded-[18px] border-cabinet-border/85 bg-cabinet-panel-strong shadow-[0_16px_34px_rgba(17,35,63,0.05)]',
      header: 'border-b border-cabinet-border/80 px-6 py-5',
      title: 'text-xl font-semibold tracking-tight text-cabinet-ink text-balance',
      description: 'mt-2 max-w-3xl text-sm leading-relaxed text-cabinet-muted-ink text-pretty',
      content: 'px-6 pt-5 pb-6',
    },
    subtle: {
      card: 'rounded-[16px] border-cabinet-border/80 bg-cabinet-panel shadow-none',
      header: 'border-b border-cabinet-border/70 px-5 py-4',
      title: 'text-lg font-semibold tracking-tight text-cabinet-ink text-balance',
      description: 'mt-1.5 max-w-3xl text-sm leading-relaxed text-cabinet-muted-ink text-pretty',
      content: 'px-5 pt-4 pb-5',
    },
    hero: {
      card: 'rounded-[20px] border-cabinet-border/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(237,244,255,0.92))] shadow-[0_18px_44px_rgba(17,35,63,0.06)]',
      header: 'border-b border-cabinet-border/70 px-6 py-6',
      title: 'text-[26px] font-semibold tracking-tight text-cabinet-ink text-balance sm:text-[30px]',
      description: 'mt-2 max-w-3xl text-sm leading-relaxed text-cabinet-muted-ink text-pretty',
      content: 'px-6 pt-5 pb-6',
    },
  } as const;

  const styles = variants[variant];

  return (
    <Card className={cn(styles.card, className)}>
      <CardHeader className={cn('space-y-2', styles.header)}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {eyebrow ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cabinet-accent-strong">
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
