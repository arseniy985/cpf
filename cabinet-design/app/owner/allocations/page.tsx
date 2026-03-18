import { EmptyState } from "@/components/widgets/empty-state";
import { Users } from "lucide-react";

export default function OwnerAllocations() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Инвесторы и аллокации</h1>
          <p className="text-sm text-brand-text-muted mt-1">Заявки инвесторов и подтвержденные аллокации</p>
        </div>
      </div>
      <EmptyState 
        icon={Users}
        title="Нет заявок"
        description="Здесь появятся заявки инвесторов после открытия раунда."
      />
    </div>
  );
}
