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
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { applyApiFormErrors } from '@/shared/lib/forms';
import { useProjectSubmissionMutation } from '@/features/project-submission/api/project-submission';
import {
  projectSubmissionSchema,
  type ProjectSubmissionFormValues,
} from '@/features/project-submission/model/schema';

export function ProjectSubmissionForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const mutation = useProjectSubmissionMutation();
  const form = useForm<ProjectSubmissionFormValues>({
    resolver: zodResolver(projectSubmissionSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      company_name: '',
      project_name: '',
      target_amount: '30000000',
      message: '',
    },
  });

  async function onSubmit(values: ProjectSubmissionFormValues) {
    try {
      const targetAmount = Number(values.target_amount);

      if (!Number.isFinite(targetAmount) || targetAmount < 100000) {
        form.setError('target_amount', { type: 'manual', message: 'Минимум 100 000 ₽.' });
        return;
      }

      await mutation.mutateAsync({
        ...values,
        asset_type: 'commercial_real_estate',
        target_amount: targetAmount,
        company_name: values.company_name || undefined,
        message: values.message || undefined,
      });
      onSuccess?.();
      form.reset({
        full_name: '',
        email: '',
        phone: '',
        company_name: '',
        project_name: '',
        target_amount: '30000000',
        message: '',
      });
    } catch (error) {
      applyApiFormErrors(error, form.setError);
    }
  }

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Как к вам обращаться?</FormLabel>
              <FormControl>
                <Input placeholder="Иван Иванов" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Номер телефона</FormLabel>
                <FormControl>
                  <Input placeholder="+7 (___) ___-__-__" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="project_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название проекта</FormLabel>
              <FormControl>
                <Input placeholder="Торговый центр / склад / бизнес-центр" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Компания</FormLabel>
                <FormControl>
                  <Input placeholder="ООО Актив" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="target_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Целевая сумма</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={100000}
                    step={100000}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Комментарий по проекту</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {mutation.isError ? (
          <p className="text-sm text-rose-600">
            {getApiErrorMessage(mutation.error, 'Не удалось отправить заявку.')}
          </p>
        ) : null}

        <Button type="submit" width="full" size="lg" disabled={mutation.isPending}>
          {mutation.isPending ? 'Отправляем...' : 'Отправить заявку'}
        </Button>
      </form>
    </Form>
  );
}
