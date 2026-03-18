'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useOwnerProjectsQuery } from '@/entities/owner-project/api/hooks';
import { useCreateOwnerRoundMutation } from '@/entities/owner-round/api/hooks';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { applyApiFormErrors } from '@/shared/lib/forms/apply-api-form-errors';
import { ownerRoundSchema, type OwnerRoundFormValues } from '@/features/owner-round/model/schemas';

type OwnerRoundFormPanelProps = {
  onSuccess?: () => void;
};

export function OwnerRoundFormPanel({ onSuccess }: OwnerRoundFormPanelProps) {
  const mutation = useCreateOwnerRoundMutation();
  const projectsQuery = useOwnerProjectsQuery();
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const form = useForm<OwnerRoundFormValues>({
    resolver: zodResolver(ownerRoundSchema),
    defaultValues: {
      project_id: '',
      slug: '',
      title: '',
      target_amount: '',
      min_investment: '',
      target_yield: '',
      payout_frequency: 'monthly',
      term_months: '',
      oversubscription_allowed: false,
      opens_at: '',
      closes_at: '',
      notes: '',
    },
  });

  async function onSubmit(values: OwnerRoundFormValues) {
    setSummaryError(null);

    try {
      await mutation.mutateAsync({
        project_id: values.project_id,
        slug: values.slug,
        title: values.title,
        target_amount: Number(values.target_amount),
        min_investment: Number(values.min_investment),
        target_yield: Number(values.target_yield),
        payout_frequency: values.payout_frequency,
        term_months: Number(values.term_months),
        oversubscription_allowed: values.oversubscription_allowed,
        opens_at: values.opens_at || undefined,
        closes_at: values.closes_at || undefined,
        notes: values.notes || undefined,
      });
      toast.success('Раунд создан');
      form.reset();
      onSuccess?.();
    } catch (error) {
      applyApiFormErrors(error, form.setError);
      setSummaryError(getApiErrorMessage(error, 'Не удалось создать раунд.'));
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

        <FormField
          control={form.control}
          name="project_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-app-cabinet-text">Проект *</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="rounded-none border-app-cabinet-border shadow-none">
                    <SelectValue placeholder="Выберите проект…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-none border-app-cabinet-border">
                  {(projectsQuery.data?.data ?? []).map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="text-app-cabinet-muted">Раунд будет создан внутри выбранного проекта.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['slug', 'Адрес раунда *', 'round-2026-spring…'],
            ['title', 'Название раунда *', 'Весенний раунд 2026…'],
            ['target_amount', 'Целевая сумма *', '15000000…'],
            ['min_investment', 'Минимальный вход *', '100000…'],
            ['target_yield', 'Доходность *', '16…'],
            ['term_months', 'Срок в месяцах *', '12…'],
          ].map(([name, label, placeholder]) => (
            <FormField
              key={name}
              control={form.control}
              name={name as keyof OwnerRoundFormValues}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-app-cabinet-text">{label}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      name={name}
                      value={typeof field.value === 'string' ? field.value : ''}
                      placeholder={placeholder}
                      className="rounded-none border-app-cabinet-border shadow-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <FormField
          control={form.control}
          name="payout_frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-app-cabinet-text">Частота выплат *</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="rounded-none border-app-cabinet-border shadow-none">
                    <SelectValue placeholder="Выберите частоту…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-none border-app-cabinet-border">
                  <SelectItem value="monthly">Ежемесячно</SelectItem>
                  <SelectItem value="quarterly">Ежеквартально</SelectItem>
                  <SelectItem value="at_maturity">В конце периода</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="opens_at"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-app-cabinet-text">Дата открытия</FormLabel>
                <FormControl>
                  <Input {...field} type="date" name="opens_at" className="rounded-none border-app-cabinet-border shadow-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="closes_at"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-app-cabinet-text">Дата закрытия</FormLabel>
                <FormControl>
                  <Input {...field} type="date" name="closes_at" className="rounded-none border-app-cabinet-border shadow-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="oversubscription_allowed"
          render={({ field }) => (
            <FormItem className="border border-app-cabinet-border bg-app-cabinet-secondary/35 px-4 py-3">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                  className="mt-1 h-4 w-4 border-app-cabinet-border"
                />
                <span className="text-sm leading-6 text-app-cabinet-text">Разрешить переподписку, если спрос превысит целевой объём.</span>
              </label>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-app-cabinet-text">Комментарий по раунду</FormLabel>
              <FormControl>
                <Textarea {...field} name="notes" placeholder="Замечания для платформы, условия выплат и ограничения…" className="min-h-28 rounded-none border-app-cabinet-border shadow-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="h-11 rounded-none bg-app-cabinet-primary px-5 text-white hover:bg-app-cabinet-primary-strong">
          {mutation.isPending ? 'Сохраняем…' : 'Создать раунд'}
        </Button>
      </form>
    </Form>
  );
}
