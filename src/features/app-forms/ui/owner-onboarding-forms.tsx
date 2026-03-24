'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  useOwnerWorkspaceQuery,
  useSubmitOwnerOnboardingMutation,
  useUpdateOwnerAccountMutation,
  useUpdateOwnerBankProfileMutation,
  useUpdateOwnerOrganizationMutation,
} from '@/entities/owner-account/api/hooks';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { applyApiFormErrors } from '@/shared/lib/forms/apply-api-form-errors';
import {
  ownerAccountProfileSchema,
  ownerBankProfileSchema,
  ownerOrganizationSchema,
  type OwnerAccountProfileFormValues,
  type OwnerBankProfileFormValues,
  type OwnerOrganizationFormValues,
} from '@/features/owner-account/model/schemas';

function SectionAlert({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <div className="border border-app-cabinet-danger/20 bg-app-cabinet-danger/10 px-4 py-3 text-sm text-app-cabinet-danger" aria-live="polite">
      {message}
    </div>
  );
}

function TextField({
  label,
  placeholder,
  description,
  field,
  name,
}: {
  label: string;
  placeholder: string;
  description?: string;
  name: string;
  field: {
    value?: string;
    onChange: (...event: unknown[]) => void;
    onBlur: () => void;
  };
}) {
  return (
    <FormItem>
      <FormLabel className="text-sm font-medium text-app-cabinet-text">{label}</FormLabel>
      <FormControl>
        <Input {...field} name={name} placeholder={placeholder} className="rounded-none border-app-cabinet-border shadow-none" />
      </FormControl>
      {description ? <FormDescription className="text-app-cabinet-muted">{description}</FormDescription> : null}
      <FormMessage />
    </FormItem>
  );
}

export function OwnerOnboardingForms() {
  const workspaceQuery = useOwnerWorkspaceQuery();
  const updateAccountMutation = useUpdateOwnerAccountMutation();
  const updateOrganizationMutation = useUpdateOwnerOrganizationMutation();
  const updateBankMutation = useUpdateOwnerBankProfileMutation();
  const submitMutation = useSubmitOwnerOnboardingMutation();
  const [accountError, setAccountError] = useState<string | null>(null);
  const [organizationError, setOrganizationError] = useState<string | null>(null);
  const [bankError, setBankError] = useState<string | null>(null);

  const accountForm = useForm<OwnerAccountProfileFormValues>({
    resolver: zodResolver(ownerAccountProfileSchema),
    values: {
      display_name: workspaceQuery.data?.data.account.displayName ?? '',
      slug: workspaceQuery.data?.data.account.slug ?? '',
      website_url: workspaceQuery.data?.data.account.websiteUrl ?? '',
      overview: workspaceQuery.data?.data.account.overview ?? '',
    },
  });

  const organizationForm = useForm<OwnerOrganizationFormValues>({
    resolver: zodResolver(ownerOrganizationSchema),
    values: {
      legal_name: workspaceQuery.data?.data.organization.legalName ?? '',
      brand_name: workspaceQuery.data?.data.organization.brandName ?? '',
      entity_type: workspaceQuery.data?.data.organization.entityType ?? '',
      registration_number: workspaceQuery.data?.data.organization.registrationNumber ?? '',
      tax_id: workspaceQuery.data?.data.organization.taxId ?? '',
      website_url: workspaceQuery.data?.data.organization.websiteUrl ?? '',
      address: workspaceQuery.data?.data.organization.address ?? '',
      signatory_name: workspaceQuery.data?.data.organization.signatoryName ?? '',
      signatory_role: workspaceQuery.data?.data.organization.signatoryRole ?? '',
      beneficiary_name: workspaceQuery.data?.data.organization.beneficiaryName ?? '',
      overview: workspaceQuery.data?.data.organization.overview ?? '',
    },
  });

  const bankForm = useForm<OwnerBankProfileFormValues>({
    resolver: zodResolver(ownerBankProfileSchema),
    values: {
      payout_method: workspaceQuery.data?.data.bankProfile.payoutMethod ?? 'manual',
      recipient_name: workspaceQuery.data?.data.bankProfile.recipientName ?? '',
      bank_name: workspaceQuery.data?.data.bankProfile.bankName ?? '',
      bank_bik: workspaceQuery.data?.data.bankProfile.bankBik ?? '',
      bank_account: workspaceQuery.data?.data.bankProfile.bankAccount ?? '',
      correspondent_account: workspaceQuery.data?.data.bankProfile.correspondentAccount ?? '',
      notes: workspaceQuery.data?.data.bankProfile.notes ?? '',
    },
  });

  async function submitAccount(values: OwnerAccountProfileFormValues) {
    setAccountError(null);

    try {
      await updateAccountMutation.mutateAsync(values);
      toast.success('Профиль кабинета сохранён');
    } catch (error) {
      applyApiFormErrors(error, accountForm.setError);
      setAccountError(getApiErrorMessage(error, 'Не удалось сохранить карточку кабинета.'));
    }
  }

  async function submitOrganization(values: OwnerOrganizationFormValues) {
    setOrganizationError(null);

    try {
      await updateOrganizationMutation.mutateAsync(values);
      toast.success('Данные организации сохранены');
    } catch (error) {
      applyApiFormErrors(error, organizationForm.setError);
      setOrganizationError(getApiErrorMessage(error, 'Не удалось сохранить данные организации.'));
    }
  }

  async function submitBank(values: OwnerBankProfileFormValues) {
    setBankError(null);

    try {
      await updateBankMutation.mutateAsync(values);
      toast.success('Реквизиты сохранены');
    } catch (error) {
      applyApiFormErrors(error, bankForm.setError);
      setBankError(getApiErrorMessage(error, 'Не удалось сохранить реквизиты.'));
    }
  }

  return (
    <div className="space-y-6">
      <Form {...accountForm}>
        <form className="space-y-4 border border-app-cabinet-border bg-app-cabinet-surface px-5 py-5" onSubmit={accountForm.handleSubmit(submitAccount)}>
          <div>
            <h3 className="text-lg font-semibold text-app-cabinet-text">Профиль кабинета</h3>
            <p className="mt-2 text-sm leading-6 text-app-cabinet-muted">Название кабинета, короткий адрес и краткое описание компании.</p>
          </div>
          <SectionAlert message={accountError} />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField control={accountForm.control} name="display_name" render={({ field }) => <TextField field={field} name="display_name" label="Название кабинета *" placeholder="ООО Центр актива…" />} />
            <FormField control={accountForm.control} name="slug" render={({ field }) => <TextField field={field} name="slug" label="Короткий адрес кабинета *" placeholder="center-asset…" description="Используйте латиницу, цифры и дефис." />} />
          </div>
          <FormField control={accountForm.control} name="website_url" render={({ field }) => <TextField field={field} name="website_url" label="Сайт" placeholder="https://company.ru…" />} />
          <FormField
            control={accountForm.control}
            name="overview"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-app-cabinet-text">Описание кабинета</FormLabel>
                <FormControl>
                  <Textarea {...field} name="overview" placeholder="Коротко опишите компанию и направление её работы…" className="min-h-28 rounded-none border-app-cabinet-border shadow-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="h-11 rounded-none bg-app-cabinet-primary px-5 text-white hover:bg-app-cabinet-primary-strong">
            {updateAccountMutation.isPending ? 'Сохраняем…' : 'Сохранить карточку'}
          </Button>
        </form>
      </Form>

      <Form {...organizationForm}>
        <form className="space-y-4 border border-app-cabinet-border bg-app-cabinet-surface px-5 py-5" onSubmit={organizationForm.handleSubmit(submitOrganization)}>
          <div>
            <h3 className="text-lg font-semibold text-app-cabinet-text">Данные организации</h3>
            <p className="mt-2 text-sm leading-6 text-app-cabinet-muted">Юрлицо, подписанты, бенефициары и реквизиты, необходимые для проверки компании.</p>
          </div>
          <SectionAlert message={organizationError} />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField control={organizationForm.control} name="legal_name" render={({ field }) => <TextField field={field} name="legal_name" label="Юрлицо *" placeholder="ООО Центр партнёрского финансирования…" />} />
            <FormField control={organizationForm.control} name="brand_name" render={({ field }) => <TextField field={field} name="brand_name" label="Бренд" placeholder="ЦПФ…" />} />
            <FormField control={organizationForm.control} name="entity_type" render={({ field }) => <TextField field={field} name="entity_type" label="Орг-форма *" placeholder="ООО…" />} />
            <FormField control={organizationForm.control} name="registration_number" render={({ field }) => <TextField field={field} name="registration_number" label="ОГРН / рег. номер *" placeholder="1234567890123…" />} />
            <FormField control={organizationForm.control} name="tax_id" render={({ field }) => <TextField field={field} name="tax_id" label="ИНН *" placeholder="7701234567…" />} />
            <FormField control={organizationForm.control} name="website_url" render={({ field }) => <TextField field={field} name="website_url" label="Сайт" placeholder="https://company.ru…" />} />
            <FormField control={organizationForm.control} name="signatory_name" render={({ field }) => <TextField field={field} name="signatory_name" label="Подписант *" placeholder="Петров Пётр…" />} />
            <FormField control={organizationForm.control} name="signatory_role" render={({ field }) => <TextField field={field} name="signatory_role" label="Должность подписанта" placeholder="Генеральный директор…" />} />
            <FormField control={organizationForm.control} name="beneficiary_name" render={({ field }) => <TextField field={field} name="beneficiary_name" label="Бенефициар" placeholder="Сидоров Сергей…" />} />
          </div>
          <FormField
            control={organizationForm.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-app-cabinet-text">Юридический адрес *</FormLabel>
                <FormControl>
                  <Textarea {...field} name="address" placeholder="Полный юридический адрес…" className="min-h-24 rounded-none border-app-cabinet-border shadow-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={organizationForm.control}
            name="overview"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-app-cabinet-text">Комментарий по организации</FormLabel>
                <FormControl>
                  <Textarea {...field} name="overview" placeholder="Опишите структуру владения, контекст актива или особенности проверки…" className="min-h-28 rounded-none border-app-cabinet-border shadow-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="h-11 rounded-none bg-app-cabinet-primary px-5 text-white hover:bg-app-cabinet-primary-strong">
            {updateOrganizationMutation.isPending ? 'Сохраняем…' : 'Сохранить данные организации'}
          </Button>
        </form>
      </Form>

      <Form {...bankForm}>
        <form className="space-y-4 border border-app-cabinet-border bg-app-cabinet-surface px-5 py-5" onSubmit={bankForm.handleSubmit(submitBank)}>
          <div>
            <h3 className="text-lg font-semibold text-app-cabinet-text">Реквизиты и выплаты</h3>
            <p className="mt-2 text-sm leading-6 text-app-cabinet-muted">Данные для начислений и распределений владельца объекта.</p>
          </div>
          <SectionAlert message={bankError} />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField control={bankForm.control} name="payout_method" render={({ field }) => <TextField field={field} name="payout_method" label="Способ расчёта *" placeholder="Ручной перевод…" />} />
            <FormField control={bankForm.control} name="recipient_name" render={({ field }) => <TextField field={field} name="recipient_name" label="Получатель *" placeholder="ООО Центр актива…" />} />
            <FormField control={bankForm.control} name="bank_name" render={({ field }) => <TextField field={field} name="bank_name" label="Банк *" placeholder="Т-Банк…" />} />
            <FormField control={bankForm.control} name="bank_bik" render={({ field }) => <TextField field={field} name="bank_bik" label="БИК *" placeholder="044525974…" />} />
            <FormField control={bankForm.control} name="bank_account" render={({ field }) => <TextField field={field} name="bank_account" label="Расчётный счёт *" placeholder="40702810…" />} />
            <FormField control={bankForm.control} name="correspondent_account" render={({ field }) => <TextField field={field} name="correspondent_account" label="Корреспондентский счёт *" placeholder="30101810…" />} />
          </div>
          <FormField
            control={bankForm.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-app-cabinet-text">Комментарий</FormLabel>
                <FormControl>
                  <Textarea {...field} name="notes" placeholder="Если для выплат нужны пояснения или особые условия…" className="min-h-24 rounded-none border-app-cabinet-border shadow-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-wrap gap-3">
            <Button type="submit" className="h-11 rounded-none bg-app-cabinet-primary px-5 text-white hover:bg-app-cabinet-primary-strong">
              {updateBankMutation.isPending ? 'Сохраняем…' : 'Сохранить реквизиты'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-none border-app-cabinet-border bg-app-cabinet-surface px-5 text-app-cabinet-text"
              onClick={async () => {
                try {
                  await submitMutation.mutateAsync();
                  toast.success('Профиль отправлен на проверку');
                } catch (error) {
                  toast.error(getApiErrorMessage(error, 'Не удалось отправить профиль на проверку.'));
                }
              }}
            >
              {submitMutation.isPending ? 'Отправляем…' : 'Отправить на проверку'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
