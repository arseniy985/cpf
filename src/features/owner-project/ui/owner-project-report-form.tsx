'use client';

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
import { useCreateOwnerProjectReportMutation } from '@/entities/owner-project/api/hooks';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { applyApiFormErrors } from '@/shared/lib/forms';
import {
  ownerProjectReportSchema,
  type OwnerProjectReportFormValues,
} from '@/features/owner-project/model/schemas';

export function OwnerProjectReportForm({
  slug,
}: {
  slug: string;
}) {
  const mutation = useCreateOwnerProjectReportMutation();
  const form = useForm<OwnerProjectReportFormValues>({
    resolver: zodResolver(ownerProjectReportSchema),
    defaultValues: {
      title: '',
      report_date: '',
      file_url: '',
      summary: '',
    },
  });

  async function onSubmit(values: OwnerProjectReportFormValues) {
    try {
      await mutation.mutateAsync({
        slug,
        title: values.title,
        report_date: values.report_date,
        file_url: values.file_url || undefined,
        summary: values.summary || undefined,
      });
      form.reset({
        title: '',
        report_date: '',
        file_url: '',
        summary: '',
      });
    } catch (error) {
      applyApiFormErrors(error, form.setError);
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название отчета</FormLabel>
              <FormControl>
                <Input placeholder="Название отчета" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="report_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Дата отчета</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ссылка на файл</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Краткая сводка</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Краткая сводка" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mutation.isError ? (
          <p className="text-sm text-rose-600">
            {getApiErrorMessage(mutation.error, 'Не удалось добавить отчет.')}
          </p>
        ) : null}

        <Button type="submit" width="full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Сохраняем...' : 'Добавить отчет'}
        </Button>
      </form>
    </Form>
  );
}
