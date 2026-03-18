import { EmptyState } from "@/components/widgets/empty-state";
import { CircleDollarSign } from "lucide-react";

export default function OwnerRounds() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Раунды привлечения</h1>
          <p className="text-sm text-brand-text-muted mt-1">Управление сбором средств по проектам</p>
        </div>
      </div>
      <EmptyState 
        icon={CircleDollarSign}
        title="Нет активных раундов"
        description="Создайте раунд привлечения для опубликованного проекта."
        actionLabel="Создать раунд"
      />
    </div>
  );
}
