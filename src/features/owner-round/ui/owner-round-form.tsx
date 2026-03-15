'use client';

import { type ComponentProps, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { OwnerProject } from '@/entities/owner-project/api/types';
import { useCreateOwnerRoundMutation, useUpdateOwnerRoundMutation } from '@/entities/owner-round/api/hooks';
import type { OwnerRound } from '@/entities/owner-round/api/types';
import { applyApiFormErrors } from '@/shared/lib/forms';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { ownerRoundSchema, type OwnerRoundFormValues } from '../model/schemas';

const payoutFrequencies = [
  { value: 'monthly', label: 'Ежемесячно' },
  { value: 'quarterly', label: 'Ежеквартально' },
  { value: 'at_maturity', label: 'В конце срока' },
] as const;

const emptyValues: OwnerRoundFormValues = {
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
};

function mapRoundToValues(round: OwnerRound | null, defaultProjectId?: string): OwnerRoundFormValues {
  if (!round) {
    return {
      ...emptyValues,
      project_id: defaultProjectId ?? '',
    };
  }

  return {
    project_id: defaultProjectId ?? round.projectId,
    slug: round.slug,
    title: round.title,
    target_amount: String(round.targetAmount),
    min_investment: String(round.minInvestment),
    target_yield: String(round.targetYield),
    payout_frequency: (round.payoutFrequency as OwnerRoundFormValues['payout_frequency']) ?? 'monthly',
    term_months: String(round.termMonths),
    oversubscription_allowed: round.oversubscriptionAllowed,
    opens_at: round.opensAt?.slice(0, 10) ?? '',
    closes_at: round.closesAt?.slice(0, 10) ?? '',
    notes: round.notes ?? '',
  };
}

export function OwnerRoundForm({
  mode,
  round,
  projects,
  defaultProjectId,
  onCreated,
}: {
  mode: 'create' | 'edit';
  round: OwnerRound | null;
  projects: OwnerProject[];
  defaultProjectId?: string;
  onCreated?: (slug: string) => void;
}) {
  const createMutation = useCreateOwnerRoundMutation();
  const updateMutation = useUpdateOwnerRoundMutation();
  const form = useForm<OwnerRoundFormValues>({
    resolver: zodResolver(ownerRoundSchema),
    defaultValues: mapRoundToValues(round, defaultProjectId),
    mode: 'onBlur',
  });

  useEffect(() => {
    form.reset(mapRoundToValues(round, defaultProjectId));
  }, [defaultProjectId, form, round]);

  async function onSubmit(values: OwnerRoundFormValues) {
    const targetAmount = Number(values.target_amount);
    const minInvestment = Number(values.min_investment);
    const targetYield = Number(values.target_yield);
    const termMonths = Number(values.term_months);

    if (!Number.isFinite(targetAmount) || targetAmount < 100000) {
      form.setError('target_amount', { type: 'manual', message: 'Минимум 100 000 ₽.' });
      return;
    }

    if (!Number.isFinite(minInvestment) || minInvestment < 1000) {
      form.setError('min_investment', { type: 'manual', message: 'Минимум 1 000 ₽.' });
      return;
    }

    if (!Number.isFinite(targetYield) || targetYield <= 0) {
      form.setError('target_yield', { type: 'manual', message: 'Укажите доходность больше 0.' });
      return;
    }

    if (!Number.isFinite(termMonths) || termMonths < 1) {
      form.setError('term_months', { type: 'manual', message: 'Срок должен быть не меньше 1 месяца.' });
      return;
    }

    const payload = {
      project_id: values.project_id,
      slug: values.slug,
      title: values.title,
      target_amount: targetAmount,
      min_investment: minInvestment,
      target_yield: targetYield,
      payout_frequency: values.payout_frequency,
      term_months: termMonths,
      oversubscription_allowed: values.oversubscription_allowed,
      opens_at: values.opens_at || undefined,
      closes_at: values.closes_at || undefined,
      notes: values.notes || undefined,
    };

    try {
      if (mode === 'edit' && round) {
        await updateMutation.mutateAsync({
          slug: round.slug,
          payload: {
            slug: payload.slug,
            title: payload.title,
            target_amount: payload.target_amount,
            min_investment: payload.min_investment,
            target_yield: payload.target_yield,
            payout_frequency: payload.payout_frequency,
            term_months: payload.term_months,
            oversubscription_allowed: payload.oversubscription_allowed,
            opens_at: payload.opens_at,
            closes_at: payload.closes_at,
            notes: payload.notes,
          },
        });
        toast.success('Параметры раунда сохранены');
        return;
      }

      const response = await createMutation.mutateAsync(payload);
      toast.success('Раунд создан');
      onCreated?.(response.data.slug);
      form.reset(mapRoundToValues(null, defaultProjectId));
    } catch (error) {
      applyApiFormErrors(error, form.setError);
      toast.error(getApiErrorMessage(error, 'Не удалось сохранить раунд.'));
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;
  const projectSelectionLocked = mode === 'edit' || Boolean(defaultProjectId);

  return (
    <Form {...form}>
      <form className="grid gap-4 lg:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="project_id"
          render={({ field }) => (
            <FormItem className="lg:col-span-2">
              <FormLabel>Проект</FormLabel>
              <Select disabled={projectSelectionLocked} onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger aria-label="Выберите проект">
                    <SelectValue placeholder="Выберите проект…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Раунд всегда закрепляется за одним инвестиционным объектом.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <OwnerRoundInput name="title" label="Название раунда" placeholder="Весенний раунд…" />
        <OwnerRoundInput
          name="slug"
          label="Адрес раунда"
          placeholder="galleria-moscow-bridge-round…"
          spellCheck={false}
          autoCapitalize="none"
          autoComplete="off"
        />

        <OwnerRoundInput name="target_amount" label="Целевой объем" placeholder="9000000…" inputMode="numeric" type="number" />
        <OwnerRoundInput name="min_investment" label="Мин. чек" placeholder="25000…" inputMode="numeric" type="number" />
        <OwnerRoundInput name="target_yield" label="Доходность, %" placeholder="16.8…" inputMode="decimal" type="number" />
        <OwnerRoundInput name="term_months" label="Срок, мес" placeholder="12…" inputMode="numeric" type="number" />

        <FormField
          control={form.control}
          name="payout_frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Частота выплат</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger aria-label="Выберите частоту выплат">
                    <SelectValue placeholder="Выберите график…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {payoutFrequencies.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="oversubscription_allowed"
          render={({ field }) => (
            <FormItem className="rounded-[24px] border border-cabinet-border/65 bg-cabinet-panel px-4 py-4">
              <label className="flex cursor-pointer items-start gap-3" htmlFor="owner-round-oversubscription">
                <input
                  id="owner-round-oversubscription"
                  checked={field.value}
                  className="mt-1 h-4 w-4 rounded border-cabinet-border text-cabinet-accent-strong focus-visible:ring-2 focus-visible:ring-cabinet-accent"
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={(event) => field.onChange(event.target.checked)}
                  type="checkbox"
                />
                <span className="space-y-1">
                  <span className="block text-sm font-semibold text-cabinet-ink">Разрешить прием сверх цели</span>
                  <span className="block text-sm leading-relaxed text-cabinet-muted-ink">
                    Включайте только если готовы вручную распределять заявки сверх целевой суммы раунда.
                  </span>
                </span>
              </label>
            </FormItem>
          )}
        />

        <OwnerRoundInput name="opens_at" label="Открытие окна" placeholder="2026-03-20…" autoComplete="off" type="date" />
        <OwnerRoundInput name="closes_at" label="Закрытие окна" placeholder="2026-04-20…" autoComplete="off" type="date" />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem className="lg:col-span-2">
              <FormLabel>Операционные заметки</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  autoComplete="off"
                  placeholder="Что важно знать команде before go-live…"
                  rows={5}
                />
              </FormControl>
              <FormDescription>Укажите детали, которые помогут команде сопровождать этот раунд.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap gap-3 lg:col-span-2">
          <Button disabled={isPending} type="submit">
            {isPending ? 'Сохраняем…' : mode === 'edit' ? 'Сохранить Раунд' : 'Создать Раунд'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function OwnerRoundInput({
  name,
  label,
  placeholder,
  ...inputProps
}: {
  name: keyof OwnerRoundFormValues;
  label: string;
  placeholder: string;
} & ComponentProps<typeof Input>) {
  const form = useFormContext<OwnerRoundFormValues>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              {...inputProps}
              value={typeof field.value === 'string' ? field.value : ''}
              onChange={(event) => field.onChange(event.target.value)}
              placeholder={placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
