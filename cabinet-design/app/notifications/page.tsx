import { EmptyState } from "@/components/widgets/empty-state";
import { Bell } from "lucide-react";

export default function Notifications() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Уведомления</h1>
          <p className="text-sm text-brand-text-muted mt-1">Единая лента событий</p>
        </div>
      </div>
      <EmptyState 
        icon={Bell}
        title="Нет новых уведомлений"
        description="Мы сообщим вам, когда появится что-то важное."
      />
    </div>
  );
}
