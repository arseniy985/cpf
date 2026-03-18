import { EmptyState } from "@/components/widgets/empty-state";
import { FileText } from "lucide-react";

export default function InvestorDocuments() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Документы</h1>
          <p className="text-sm text-brand-text-muted mt-1">Договоры, отчеты и подтверждения операций</p>
        </div>
      </div>
      <EmptyState 
        icon={FileText}
        title="Нет документов"
        description="Здесь будут появляться договоры по вашим инвестициям и отчеты по проектам."
      />
    </div>
  );
}
