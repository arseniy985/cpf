import { EmptyState } from "@/components/widgets/empty-state";
import { FolderKanban } from "lucide-react";

export default function OwnerProjects() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Проекты</h1>
          <p className="text-sm text-brand-text-muted mt-1">Управление проектами и паспортами активов</p>
        </div>
      </div>
      <EmptyState 
        icon={FolderKanban}
        title="У вас пока нет проектов"
        description="Создайте свой первый проект, чтобы начать процесс привлечения инвестиций."
        actionLabel="Создать проект"
      />
    </div>
  );
}
