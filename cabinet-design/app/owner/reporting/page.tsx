import { EmptyState } from "@/components/widgets/empty-state";
import { BarChart3 } from "lucide-react";

export default function OwnerReporting() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Отчетность</h1>
          <p className="text-sm text-brand-text-muted mt-1">Регулярные отчеты и обновления по проектам</p>
        </div>
      </div>
      <EmptyState 
        icon={BarChart3}
        title="Нет отчетов"
        description="Загрузите первый отчет по активному проекту."
        actionLabel="Загрузить отчет"
      />
    </div>
  );
}
