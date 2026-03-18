import { EmptyState } from "@/components/widgets/empty-state";
import { PieChart } from "lucide-react";

export default function OwnerPayouts() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Выплаты владельца</h1>
          <p className="text-sm text-brand-text-muted mt-1">Календарь выплат и реестр получателей</p>
        </div>
      </div>
      <EmptyState 
        icon={PieChart}
        title="Нет выплат"
        description="Здесь будет отображаться график выплат инвесторам."
      />
    </div>
  );
}
