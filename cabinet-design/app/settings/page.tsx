import { EmptyState } from "@/components/widgets/empty-state";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Настройки аккаунта</h1>
          <p className="text-sm text-brand-text-muted mt-1">Профиль, безопасность и уведомления</p>
        </div>
      </div>
      <EmptyState 
        icon={Settings}
        title="Настройки загружаются"
        description="Здесь вы сможете управлять параметрами своего аккаунта."
      />
    </div>
  );
}
