import { EmptyState } from "@/components/widgets/empty-state";
import { PieChart } from "lucide-react";

export default function InvestorPayouts() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Выплаты и доход</h1>
          <p className="text-sm text-brand-text-muted mt-1">График платежей и история начислений</p>
        </div>
      </div>
      <EmptyState 
        icon={PieChart}
        title="Нет ожидаемых выплат"
        description="У вас пока нет активных инвестиций, по которым ожидаются выплаты."
        actionLabel="Перейти к проектам"
      />
    </div>
  );
}
