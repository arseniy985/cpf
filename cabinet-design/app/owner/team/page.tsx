import { EmptyState } from "@/components/widgets/empty-state";
import { Users } from "lucide-react";

export default function OwnerTeam() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Команда и настройки</h1>
          <p className="text-sm text-brand-text-muted mt-1">Управление доступом и ролями сотрудников</p>
        </div>
      </div>
      <EmptyState 
        icon={Users}
        title="Вы единственный участник"
        description="Пригласите коллег для совместной работы над проектами."
        actionLabel="Пригласить коллегу"
      />
    </div>
  );
}
