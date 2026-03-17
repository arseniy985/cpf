import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/shared/lib/classnames';

type CabinetStatCardProps = {
  label: ReactNode;
  value: string;
  hint?: ReactNode;
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
    ? 'rounded-[16px] border-cabinet-border/75 bg-cabinet-panel shadow-none'
    : 'rounded-[18px] border-cabinet-border/80 bg-cabinet-panel-strong shadow-[0_12px_28px_rgba(17,35,63,0.05)]';

  return (
    <Card className={cn(cardClasses, className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cabinet-muted-ink">{label}</p>
            <p className="mt-3 truncate font-mono text-[28px] font-semibold tracking-[-0.05em] text-cabinet-ink sm:text-[34px]">
              {value}
            </p>
            {hint ? <p className="mt-2 text-sm leading-relaxed text-cabinet-muted-ink text-pretty">{hint}</p> : null}
          </div>
          {accent ?? (
            <div className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-cabinet-border/80 bg-cabinet-panel-muted text-cabinet-accent-strong">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
