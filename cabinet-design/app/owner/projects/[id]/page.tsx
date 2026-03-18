import { EmptyState } from "@/components/widgets/empty-state";
import { FolderKanban } from "lucide-react";

export default async function OwnerProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Проект {resolvedParams.id}</h1>
          <p className="text-sm text-brand-text-muted mt-1">Детальная информация о проекте</p>
        </div>
      </div>
      <EmptyState 
        icon={FolderKanban}
        title="Проект загружается"
        description="Информация о проекте скоро появится здесь."
      />
    </div>
  );
}
