'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { Textarea } from '@/components/ui/textarea';
import { useUpdateOwnerAccountMutation } from '@/entities/owner-account/api/hooks';
import type { OwnerAccount } from '@/entities/owner-account/api/types';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { applyApiFormErrors } from '@/shared/lib/forms';
import {
  ownerAccountProfileSchema,
  type OwnerAccountProfileFormValues,
} from '../model/schemas';

function mapValues(account: OwnerAccount): OwnerAccountProfileFormValues {
  return {
    display_name: account.displayName,
    slug: account.slug,
    website_url: account.websiteUrl ?? '',
    overview: account.overview ?? '',
  };
}

export function OwnerAccountProfileForm({ account }: { account: OwnerAccount }) {
  const mutation = useUpdateOwnerAccountMutation();
  const form = useForm<OwnerAccountProfileFormValues>({
    resolver: zodResolver(ownerAccountProfileSchema),
    defaultValues: mapValues(account),
  });

  useEffect(() => {
    form.reset(mapValues(account));
  }, [account, form]);

  async function onSubmit(values: OwnerAccountProfileFormValues) {
    try {
      await mutation.mutateAsync({
        ...values,
        website_url: values.website_url || undefined,
        overview: values.overview || undefined,
      });
      toast.success('Профиль компании обновлен');
    } catch (error) {
      applyApiFormErrors(error, form.setError);
      toast.error(getApiErrorMessage(error, 'Не удалось сохранить профиль компании.'));
    }
  }

  return (
    <Form {...form}>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="display_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название профиля</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Адрес профиля</FormLabel>
              <FormControl>
                <Input autoComplete="off" spellCheck={false} {...field} />
              </FormControl>
              <FormDescription>Этот адрес используется во внутренней ссылке на профиль компании.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website_url"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Сайт</FormLabel>
              <FormControl>
                <Input autoComplete="off" inputMode="url" placeholder="https://example.com…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="overview"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Краткое описание компании</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormDescription>
                Коротко опишите, кто вы, какие объекты ведете и как устроена структура сделки.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="md:col-span-2">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Сохраняем…' : 'Сохранить профиль'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
