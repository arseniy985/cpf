'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateOwnerProjectMutation } from '@/entities/owner-project/api/hooks';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { applyApiFormErrors } from '@/shared/lib/forms/apply-api-form-errors';
import { ownerProjectSchema, type OwnerProjectFormValues } from '@/features/owner-project/model/schemas';

type OwnerProjectFormPanelProps = {
  onSuccess?: () => void;
};

export function OwnerProjectFormPanel({ onSuccess }: OwnerProjectFormPanelProps) {
  const mutation = useCreateOwnerProjectMutation();
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const form = useForm<OwnerProjectFormValues>({
    resolver: zodResolver(ownerProjectSchema),
    defaultValues: {
      slug: '',
      title: '',
      excerpt: '',
      description: '',
      thesis: '',
      risk_summary: '',
      location: '',
      asset_type: '',
      risk_level: '',
      payout_frequency: '',
      min_investment: '',
      target_amount: '',
      target_yield: '',
      term_months: '',
      cover_image_url: '',
      hero_metric: '',
    },
  });

  async function onSubmit(values: OwnerProjectFormValues) {
    setSummaryError(null);

    try {
      await mutation.mutateAsync({
        slug: values.slug,
        title: values.title,
        excerpt: values.excerpt,
        description: values.description,
        thesis: values.thesis || undefined,
        risk_summary: values.risk_summary || undefined,
        location: values.location,
        asset_type: values.asset_type,
        risk_level: values.risk_level,
        payout_frequency: values.payout_frequency,
        min_investment: Number(values.min_investment),
        target_amount: Number(values.target_amount),
        target_yield: Number(values.target_yield),
        term_months: Number(values.term_months),
        cover_image_url: values.cover_image_url || undefined,
      });
      toast.success('Черновик проекта создан');
      form.reset();
      onSuccess?.();
    } catch (error) {
      applyApiFormErrors(error, form.setError);
      setSummaryError(getApiErrorMessage(error, 'Не удалось создать проект.'));
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {summaryError ? (
          <div className="border border-app-cabinet-danger/20 bg-app-cabinet-danger/10 px-4 py-3 text-sm text-app-cabinet-danger" aria-live="polite">
            {summaryError}
          </div>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['title', 'Название проекта *', 'Например, Логистический парк Юг…'],
            ['slug', 'Slug *', 'logistic-park-yug…'],
            ['location', 'Локация *', 'Москва…'],
            ['asset_type', 'Тип актива *', 'commercial_real_estate…'],
            ['risk_level', 'Риск *', 'moderate…'],
            ['payout_frequency', 'Частота выплат *', 'monthly…'],
            ['min_investment', 'Минимальный вход *', '100000…'],
            ['target_amount', 'Целевая сумма *', '25000000…'],
            ['target_yield', 'Доходность *', '18…'],
            ['term_months', 'Срок в месяцах *', '18…'],
          ].map(([name, label, placeholder]) => (
            <FormField
              key={name}
              control={form.control}
              name={name as keyof OwnerProjectFormValues}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-app-cabinet-text">{label}</FormLabel>
                  <FormControl>
                    <Input {...field} name={name} placeholder={placeholder} className="rounded-none border-app-cabinet-border shadow-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-app-cabinet-text">Короткое описание *</FormLabel>
              <FormControl>
                <Textarea {...field} name="excerpt" placeholder="Короткое описание актива и ключевой логики сделки…" className="min-h-24 rounded-none border-app-cabinet-border shadow-none" />
              </FormControl>
              <FormDescription className="text-app-cabinet-muted">Это поле используется в карточках и кратких summaries.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-app-cabinet-text">Описание проекта *</FormLabel>
              <FormControl>
                <Textarea {...field} name="description" placeholder="Полное описание проекта, модели и операционного контура…" className="min-h-32 rounded-none border-app-cabinet-border shadow-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <FormField control={form.control} name="thesis" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-app-cabinet-text">Инвестиционный тезис</FormLabel>
              <FormControl>
                <Textarea {...field} name="thesis" placeholder="Ключевой тезис для размещения…" className="min-h-28 rounded-none border-app-cabinet-border shadow-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="risk_summary" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-app-cabinet-text">Риски</FormLabel>
              <FormControl>
                <Textarea {...field} name="risk_summary" placeholder="Основные риски и блокеры…" className="min-h-28 rounded-none border-app-cabinet-border shadow-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <Button type="submit" className="h-11 rounded-none bg-app-cabinet-primary px-5 text-white hover:bg-app-cabinet-primary-strong">
          {mutation.isPending ? 'Сохраняем…' : 'Создать проект'}
        </Button>
      </form>
    </Form>
  );
}
