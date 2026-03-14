'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useUpdateProfileMutation } from '@/entities/viewer/api/hooks';
import type { AuthUser } from '@/entities/viewer/api/types';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
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
import { profileSettingsSchema, type ProfileSettingsFormValues } from '../model/schema';

export function ProfileSettingsForm({
  user,
}: {
  user: AuthUser;
}) {
  const mutation = useUpdateProfileMutation();
  const form = useForm<ProfileSettingsFormValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone ?? '',
    },
  });

  useEffect(() => {
    form.reset({
      name: user.name,
      phone: user.phone ?? '',
    });
  }, [form, user.name, user.phone]);

  async function onSubmit(values: ProfileSettingsFormValues) {
    try {
      await mutation.mutateAsync({
        name: values.name,
        phone: values.phone || undefined,
      });
      toast.success('Профиль обновлен');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Не удалось сохранить изменения.'));
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя</FormLabel>
              <FormControl>
                <Input className="rounded-lg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Почта</FormLabel>
          <Input value={user.email} disabled className="rounded-lg bg-slate-50" />
        </FormItem>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Телефон</FormLabel>
              <FormControl>
                <Input className="rounded-lg" placeholder="+7 900 000 00 00" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="rounded-lg" disabled={mutation.isPending}>
          {mutation.isPending ? 'Сохраняем...' : 'Сохранить профиль'}
        </Button>
      </form>
    </Form>
  );
}
