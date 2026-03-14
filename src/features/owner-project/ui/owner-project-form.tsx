'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateOwnerProjectMutation, useSubmitOwnerProjectForReviewMutation, useUpdateOwnerProjectMutation } from '@/entities/owner-project/api/hooks';
import type { OwnerProject } from '@/entities/owner-project/api/types';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { applyApiFormErrors } from '@/shared/lib/forms';
import {
  ownerProjectSchema,
  type OwnerProjectFormValues,
} from '@/features/owner-project/model/schemas';

const emptyProjectValues: OwnerProjectFormValues = {
  slug: '',
  title: '',
  excerpt: '',
  description: '',
  thesis: '',
  risk_summary: '',
  location: '',
  asset_type: 'commercial_real_estate',
  risk_level: 'moderate',
  payout_frequency: 'monthly',
  min_investment: '10000',
  target_amount: '30000000',
  target_yield: '16',
  term_months: '24',
  cover_image_url: '',
  hero_metric: '',
};

function mapProjectToFormValues(project: OwnerProject | null): OwnerProjectFormValues {
  if (!project) {
    return emptyProjectValues;
  }

  return {
    slug: project.slug,
    title: project.title,
    excerpt: project.excerpt,
    description: project.description,
    thesis: project.thesis ?? '',
    risk_summary: project.riskSummary ?? '',
    location: project.location,
    asset_type: project.assetType,
    risk_level: project.riskLevel,
    payout_frequency: project.payoutFrequency,
    min_investment: String(project.minInvestment),
    target_amount: String(project.targetAmount),
    target_yield: String(project.targetYield),
    term_months: String(project.termMonths),
    cover_image_url: project.coverImageUrl ?? '',
    hero_metric: project.heroMetric ?? '',
  };
}

const compactFields: Array<{ name: keyof OwnerProjectFormValues; label: string; required?: boolean }> = [
  { name: 'slug', label: 'Адрес ссылки', required: true },
  { name: 'title', label: 'Название', required: true },
  { name: 'location', label: 'Локация', required: true },
  { name: 'asset_type', label: 'Тип актива', required: true },
  { name: 'risk_level', label: 'Уровень риска', required: true },
  { name: 'payout_frequency', label: 'Частота выплат', required: true },
  { name: 'min_investment', label: 'Мин. вход', required: true },
  { name: 'target_amount', label: 'Цель раунда', required: true },
  { name: 'target_yield', label: 'Доходность', required: true },
  { name: 'term_months', label: 'Срок, мес', required: true },
  { name: 'cover_image_url', label: 'Ссылка на обложку' },
  { name: 'hero_metric', label: 'Ключевой показатель' },
];

export function OwnerProjectForm({
  project,
  onCreated,
}: {
  project: OwnerProject | null;
  onCreated: (slug: string) => void;
}) {
  const createMutation = useCreateOwnerProjectMutation();
  const updateMutation = useUpdateOwnerProjectMutation();
  const submitReviewMutation = useSubmitOwnerProjectForReviewMutation();
  const form = useForm<OwnerProjectFormValues>({
    resolver: zodResolver(ownerProjectSchema),
    defaultValues: mapProjectToFormValues(project),
  });

  useEffect(() => {
    form.reset(mapProjectToFormValues(project));
  }, [form, project]);

  async function onSubmit(values: OwnerProjectFormValues) {
    const minInvestment = Number(values.min_investment);
    const targetAmount = Number(values.target_amount);
    const targetYield = Number(values.target_yield);
    const termMonths = Number(values.term_months);

    if (!Number.isFinite(minInvestment) || minInvestment < 1000) {
      form.setError('min_investment', { type: 'manual', message: 'Минимум 1 000 ₽.' });
      return;
    }

    if (!Number.isFinite(targetAmount) || targetAmount < 100000) {
      form.setError('target_amount', { type: 'manual', message: 'Минимум 100 000 ₽.' });
      return;
    }

    if (!Number.isFinite(targetYield) || targetYield <= 0) {
      form.setError('target_yield', { type: 'manual', message: 'Укажите доходность.' });
      return;
    }

    if (!Number.isFinite(termMonths) || termMonths <= 0) {
      form.setError('term_months', { type: 'manual', message: 'Укажите срок в месяцах.' });
      return;
    }

    const payload = {
      ...values,
      min_investment: minInvestment,
      target_amount: targetAmount,
      target_yield: targetYield,
      term_months: termMonths,
      thesis: values.thesis || undefined,
      risk_summary: values.risk_summary || undefined,
      cover_image_url: values.cover_image_url || undefined,
      hero_metric: values.hero_metric || undefined,
    };

    try {
      if (project) {
        await updateMutation.mutateAsync({
          slug: project.slug,
          payload,
        });
        return;
      }

      const response = await createMutation.mutateAsync({
        ...payload,
      });
      onCreated(response.data.slug);
    } catch (error) {
      applyApiFormErrors(error, form.setError);
    }
  }

  const mutationError = createMutation.error ?? updateMutation.error;
  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
        {compactFields.map((fieldConfig) => (
          <FormField
            key={fieldConfig.name}
            control={form.control}
            name={fieldConfig.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{fieldConfig.label}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    type={['min_investment', 'target_amount', 'target_yield', 'term_months'].includes(String(fieldConfig.name)) ? 'number' : 'text'}
                    onChange={(event) => field.onChange(event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Краткое описание</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Полное описание</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="thesis"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Инвестиционный тезис</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="risk_summary"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Риски и комментарии</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mutationError ? (
          <p className="text-sm text-rose-600 md:col-span-2">
            {getApiErrorMessage(mutationError, 'Не удалось сохранить проект.')}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3 md:col-span-2">
          <Button type="submit" size="lg" disabled={isPending}>
            {isPending ? 'Сохраняем...' : project ? 'Сохранить изменения' : 'Создать проект'}
          </Button>
          {project ? (
            <Button
              type="button"
              variant="secondary"
              disabled={submitReviewMutation.isPending}
              onClick={async () => {
                await submitReviewMutation.mutateAsync({ slug: project.slug });
              }}
            >
              {submitReviewMutation.isPending ? 'Отправляем...' : 'Передать на модерацию'}
            </Button>
          ) : null}
        </div>
      </form>
    </Form>
  );
}
