import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function KpiCard({ title, value, subtitle, trend, className }: KpiCardProps) {
  return (
    <Card className={cn(className)}>
      <CardContent className="p-6">
        <p className="text-sm font-medium text-brand-text-muted mb-2">{title}</p>
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl font-bold text-brand-text tracking-tight">{value}</h2>
          {trend && (
            <span className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-brand-success" : "text-brand-error"
            )}>
              {trend.isPositive ? '+' : '-'}{trend.value}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-brand-text-muted mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}
