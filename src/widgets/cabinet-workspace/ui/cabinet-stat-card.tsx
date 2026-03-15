import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/shared/lib/classnames';

type CabinetStatCardProps = {
  label: string;
  value: string;
  hint?: string;
  accent?: ReactNode;
  className?: string;
  variant?: 'signal' | 'quiet';
};

export function CabinetStatCard({
  label,
  value,
  hint,
  accent,
  className,
  variant = 'signal',
}: CabinetStatCardProps) {
  const cardClasses = variant === 'quiet'
    ? 'rounded-[24px] border-cabinet-border/60 bg-cabinet-panel shadow-none'
    : 'rounded-[26px] border-cabinet-border/65 bg-cabinet-panel-strong shadow-[0_16px_45px_rgba(31,50,66,0.07)]';

  return (
    <Card className={cn(cardClasses, className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cabinet-muted-ink">{label}</p>
            <p className="mt-3 truncate font-mono text-[28px] font-semibold tracking-[-0.04em] text-cabinet-ink sm:text-[34px]">
              {value}
            </p>
            {hint ? <p className="mt-2 text-sm leading-relaxed text-cabinet-muted-ink">{hint}</p> : null}
          </div>
          {accent ?? (
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cabinet-panel-muted text-cabinet-accent-strong">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
