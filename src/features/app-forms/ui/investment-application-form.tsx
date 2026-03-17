'use client';

import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateInvestmentApplicationMutation } from '@/entities/cabinet/api/hooks';
import { useProjectsQuery } from '@/entities/project/api/hooks';
import { formatMoney } from '@/shared/lib/format';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';

const schema = z.object({
  project_id: z.string().min(1, 'Выберите проект.'),
  amount: z.string().min(1, 'Укажите сумму заявки.'),
  source_of_funds: z.string().optional(),
  accepted_documents: z.boolean().refine(Boolean, 'Подтвердите ознакомление с документами.'),
  accepted_terms: z.boolean().refine(Boolean, 'Подтвердите согласие на отправку заявки.'),
});

type FormValues = z.infer<typeof schema>;

type InvestmentApplicationFormProps = {
  onSuccess?: () => void;
};

export function InvestmentApplicationForm({ onSuccess }: InvestmentApplicationFormProps) {
  const projectsQuery = useProjectsQuery('', 'Все');
  const mutation = useCreateInvestmentApplicationMutation();
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      project_id: '',
      amount: '',
      source_of_funds: '',
      accepted_documents: false,
      accepted_terms: false,
    },
  });

  const projectId = useWatch({
    control: form.control,
    name: 'project_id',
  });
  const selectedProject = useMemo(
    () => projectsQuery.data?.find((project) => project.id === projectId) ?? null,
    [projectId, projectsQuery.data],
  );

  async function onSubmit(values: FormValues) {
    setSummaryError(null);

    if (selectedProject && Number(values.amount) < selectedProject.minInvestment) {
      form.setError('amount', {
        type: 'manual',
        message: `Минимальный вход ${formatMoney(selectedProject.minInvestment)}.`,
      });
      return;
    }

    try {
      await mutation.mutateAsync({
        projectId: values.project_id,
        amount: Number(values.amount.replace(/\s+/g, '')),
      });
      toast.success('Заявка на инвестицию создана');
      form.reset();
      onSuccess?.();
    } catch (error) {
      setSummaryError(getApiErrorMessage(error, 'Не удалось создать заявку на инвестицию.'));
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
                  {(projectsQuery.data ?? []).map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="text-app-cabinet-muted">
                {selectedProject
                  ? `Минимальный вход ${formatMoney(selectedProject.minInvestment)}.`
                  : 'После выбора проекта появится минимальный вход.'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-app-cabinet-text">Сумма заявки *</FormLabel>
              <FormControl>
                <Input {...field} name="amount" inputMode="numeric" autoComplete="off" placeholder="300000…" className="rounded-none border-app-cabinet-border shadow-none" />
              </FormControl>
              <FormDescription className="text-app-cabinet-muted">Средства резервируются по правилам выбранного проекта и вашего баланса.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="source_of_funds"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-app-cabinet-text">Источник средств</FormLabel>
              <FormControl>
                <Input {...field} name="source_of_funds" autoComplete="off" placeholder="Например, личные накопления…" className="rounded-none border-app-cabinet-border shadow-none" />
              </FormControl>
              <FormDescription className="text-app-cabinet-muted">Поле заполняется при необходимости для внутренней проверки.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accepted_documents"
          render={({ field }) => (
            <FormItem className="border border-app-cabinet-border bg-app-cabinet-secondary/35 px-4 py-3">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                  className="mt-1 h-4 w-4 border-app-cabinet-border"
                />
                <span className="text-sm leading-6 text-app-cabinet-text">Подтверждаю, что ознакомился с документами по проекту и условиями раунда.</span>
              </label>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accepted_terms"
          render={({ field }) => (
            <FormItem className="border border-app-cabinet-border bg-app-cabinet-secondary/35 px-4 py-3">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                  className="mt-1 h-4 w-4 border-app-cabinet-border"
                />
                <span className="text-sm leading-6 text-app-cabinet-text">Подтверждаю согласие на отправку заявки и последующую проверку операции.</span>
              </label>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="h-11 rounded-none bg-app-cabinet-primary px-5 text-white hover:bg-app-cabinet-primary-strong">
          {mutation.isPending ? 'Отправляем…' : 'Создать заявку'}
        </Button>
      </form>
    </Form>
  );
}
