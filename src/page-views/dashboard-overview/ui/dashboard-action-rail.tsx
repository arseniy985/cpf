import Link from 'next/link';
import { ArrowUpRight, CircleCheckBig } from 'lucide-react';
import { CabinetSurface } from '@/widgets/cabinet-workspace/ui/cabinet-surface';

type DashboardActionRailProps = {
  actions: Array<{
    title: string;
    description: string;
    href: string;
  }>;
};

export function DashboardActionRail({ actions }: DashboardActionRailProps) {
  return (
    <CabinetSurface
      eyebrow="Ближайшие шаги"
      title="Что требует действия"
      description="Короткая очередь шагов, которые двигают кабинет дальше."
      variant="panel"
    >
      {actions.length === 0 ? (
        <div className="rounded-[24px] border border-cabinet-border bg-cabinet-panel p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-cabinet-success">
              <CircleCheckBig className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-cabinet-ink">Критичных действий сейчас нет</p>
              <p className="mt-2 text-sm leading-relaxed text-cabinet-muted-ink">
                Кабинет в рабочем состоянии. Можно перейти к просмотру проектов или контролю портфеля.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {actions.map((item, index) => (
            <Link
              key={item.title}
              href={item.href}
              className="group block rounded-[24px] border border-cabinet-border bg-cabinet-panel p-4 transition-[transform,background-color,border-color] hover:-translate-y-0.5 hover:border-cabinet-accent/35 hover:bg-cabinet-panel-strong"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cabinet-accent-soft font-mono text-sm font-semibold text-cabinet-accent-strong">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-cabinet-ink">{item.title}</p>
                    <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-cabinet-accent-strong transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-cabinet-muted-ink">
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </CabinetSurface>
  );
}
