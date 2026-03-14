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
};

export function CabinetStatCard({
  label,
  value,
  hint,
  accent,
  className,
}: CabinetStatCardProps) {
  return (
    <Card className={cn('rounded-lg border-slate-200 bg-white shadow-sm', className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-[30px]">{value}</p>
            {hint ? <p className="mt-2 text-sm text-slate-600">{hint}</p> : null}
          </div>
          {accent ?? (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
