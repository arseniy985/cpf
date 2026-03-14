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
import { useCreateOwnerProjectDocumentMutation } from '@/entities/owner-project/api/hooks';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { applyApiFormErrors } from '@/shared/lib/forms';
import {
  ownerProjectDocumentSchema,
  type OwnerProjectDocumentFormValues,
} from '@/features/owner-project/model/schemas';

export function OwnerProjectDocumentForm({
  slug,
}: {
  slug: string;
}) {
  const mutation = useCreateOwnerProjectDocumentMutation();
  const form = useForm<OwnerProjectDocumentFormValues>({
    resolver: zodResolver(ownerProjectDocumentSchema),
    defaultValues: {
      title: '',
      kind: 'teaser',
      file_url: '',
    },
  });

  async function onSubmit(values: OwnerProjectDocumentFormValues) {
    try {
      await mutation.mutateAsync({
        slug,
        title: values.title,
        kind: values.kind,
        file_url: values.file_url || undefined,
      });
      form.reset({
        title: '',
        kind: 'teaser',
        file_url: '',
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
              <FormLabel>Название документа</FormLabel>
              <FormControl>
                <Input placeholder="Название документа" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="kind"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kind</FormLabel>
              <FormControl>
                <Input placeholder="teaser" {...field} />
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

        {mutation.isError ? (
          <p className="text-sm text-rose-600">
            {getApiErrorMessage(mutation.error, 'Не удалось добавить документ.')}
          </p>
        ) : null}

        <Button type="submit" width="full" disabled={mutation.isPending}>
          {mutation.isPending ? 'Сохраняем...' : 'Добавить документ'}
        </Button>
      </form>
    </Form>
  );
}
