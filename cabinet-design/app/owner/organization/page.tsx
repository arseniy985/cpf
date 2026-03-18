import { EmptyState } from "@/components/widgets/empty-state";
import { Building2 } from "lucide-react";

export default function OwnerOrganization() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Организация</h1>
          <p className="text-sm text-brand-text-muted mt-1">Данные юрлица, реквизиты и бенефициары</p>
        </div>
      </div>
      <EmptyState 
        icon={Building2}
        title="Данные организации на проверке"
        description="Мы проверяем предоставленные вами документы. Это может занять до 2 рабочих дней."
      />
    </div>
  );
}
