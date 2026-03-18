'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useKycDocumentsQuery, useKycProfileQuery } from '@/entities/cabinet/api/hooks';
import { InvestorKycForm } from '@/features/app-forms/ui/investor-kyc-form';

export default function InvestorVerificationPage() {
  const profileQuery = useKycProfileQuery();
  const documentsQuery = useKycDocumentsQuery();

  const profile = profileQuery.data?.data ?? null;
  const documents = documentsQuery.data?.data ?? [];

  const profileComplete = Boolean(profile?.legalName || profile?.taxId || profile?.documentNumber);
  const documentsComplete = documents.length > 0;
  const approved = profile?.status === 'approved';

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brand-text">Проверка профиля</h1>
        <p className="mt-1 text-sm text-brand-text-muted">Заполните данные и загрузите документы для подтверждения профиля</p>
      </div>

      <div className="cabinet-card shadow-none">
        <div className="divide-y divide-[#E2E8F0]">
          <div className="flex gap-4 p-6">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-brand-success" />
            <div>
              <h3 className="text-base font-semibold text-brand-text">1. Контактные данные</h3>
              <p className="mt-1 text-sm text-brand-text-muted">Email и телефон подтверждены.</p>
            </div>
          </div>

          <div className="bg-brand-secondary/20 p-6">
            <div className="flex gap-4">
              {profileComplete || documentsComplete ? (
                <CheckCircle2 className="h-6 w-6 shrink-0 text-brand-success" />
              ) : (
                <Circle className="h-6 w-6 shrink-0 text-brand-primary" />
              )}
              <div className="w-full">
                <h3 className="text-base font-semibold text-brand-text">2. Паспортные данные</h3>
                <p className="mb-4 mt-1 text-sm text-brand-text-muted">Заполните анкету и загрузите скан-копии паспорта.</p>
                <div className="rounded-3xl border border-slate-100 bg-white p-5">
                  <InvestorKycForm />
                </div>
              </div>
            </div>
          </div>

          <div className={`flex gap-4 p-6 ${approved ? '' : 'opacity-50'}`}>
            {approved ? (
              <CheckCircle2 className="h-6 w-6 shrink-0 text-brand-success" />
            ) : (
              <Circle className="h-6 w-6 shrink-0 text-brand-text-muted" />
            )}
            <div className="w-full">
              <h3 className="text-base font-semibold text-brand-text">3. Проверка менеджером</h3>
              <p className="mt-1 text-sm text-brand-text-muted">Ожидайте проверки данных службой безопасности.</p>
              {!approved && profile?.status === 'rejected' ? (
                <Button variant="outline" className="mt-4 border-slate-200 bg-white text-brand-primary hover:bg-brand-secondary">
                  Исправить данные
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
