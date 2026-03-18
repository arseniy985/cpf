'use client';

import { FileText } from 'lucide-react';
import { useCabinetDocumentsQuery } from '@/entities/cabinet/api/hooks';
import { AppEmptyState } from '@/shared/ui/app-cabinet/app-empty-state';

export default function InvestorDocumentsPage() {
  const documentsQuery = useCabinetDocumentsQuery();
  const totalDocuments = (documentsQuery.data?.data.projectDocuments.length ?? 0) + (documentsQuery.data?.data.legalDocuments.length ?? 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text">Документы</h1>
          <p className="mt-1 text-sm text-brand-text-muted">Договоры, отчеты и подтверждения операций</p>
        </div>
      </div>
      {totalDocuments > 0 ? (
        <div className="cabinet-card shadow-none">
          <div className="p-12 text-center">
            <h3 className="mb-2 text-lg font-semibold text-brand-text">Документы доступны</h3>
            <p className="text-sm text-brand-text-muted">Здесь будет доступен полный список договоров, отчётов и подтверждающих документов.</p>
          </div>
        </div>
      ) : (
        <AppEmptyState
          icon={FileText}
          title="Нет документов"
          description="Здесь будут появляться договоры по вашим инвестициям и отчеты по проектам."
        />
      )}
    </div>
  );
}
