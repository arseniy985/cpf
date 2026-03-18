import { EmptyState } from "@/components/widgets/empty-state";
import { CircleDollarSign } from "lucide-react";

export default async function OwnerRoundDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Раунд {resolvedParams.id}</h1>
          <p className="text-sm text-brand-text-muted mt-1">Детальная информация о раунде</p>
        </div>
      </div>
      <EmptyState 
        icon={CircleDollarSign}
        title="Раунд загружается"
        description="Информация о раунде скоро появится здесь."
      />
    </div>
  );
}
