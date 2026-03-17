'use client';

import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
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
import { normalizePhoneNumber } from '@/shared/lib/forms/phone';
import { PhoneInput } from '@/shared/ui/phone-input';
import { useContactLeadMutation } from '@/features/contact-request/api/contact-request';
import {
  contactRequestSchema,
  type ContactRequestFormValues,
} from '@/features/contact-request/model/schema';

type ContactRequestFormProps = {
  source: string;
  subject: string;
  defaultMessage?: string;
  submitLabel?: string;
  showMessageField?: boolean;
  successMessage?: string;
  className?: string;
  onSuccess?: () => void;
};

export function ContactRequestForm({
  source,
  subject,
  defaultMessage,
  submitLabel = 'Отправить заявку',
  showMessageField = false,
  successMessage = 'Заявка отправлена. Мы свяжемся с вами в ближайшее время.',
  className,
  onSuccess,
}: ContactRequestFormProps) {
  const mutation = useContactLeadMutation();
  const form = useForm<ContactRequestFormValues>({
    resolver: zodResolver(contactRequestSchema),
    defaultValues: {
      full_name: '',
      phone: '',
      email: '',
      message: defaultMessage ?? '',
    },
  });

  useEffect(() => {
    form.setValue('message', defaultMessage ?? '');
  }, [defaultMessage, form]);

  async function onSubmit(values: ContactRequestFormValues) {
    try {
      await mutation.mutateAsync({
        ...values,
        phone: normalizePhoneNumber(values.phone),
        subject,
        source,
        message: values.message || defaultMessage,
      });
      form.reset({
        full_name: '',
        phone: '',
        email: '',
        message: defaultMessage ?? '',
      });
      onSuccess?.();
    } catch (error) {
      applyApiFormErrors(error, form.setError);
    }
  }

  return (
    <Form {...form}>
      <form className={className} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ваше имя</FormLabel>
                <FormControl>
                  <Input placeholder="Иван Иванов" {...field} />
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
                  <PhoneInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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

          {showMessageField ? (
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Комментарий</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}

          {mutation.isError ? (
            <p className="text-sm text-rose-600">
              {getApiErrorMessage(mutation.error, 'Не удалось отправить заявку.')}
            </p>
          ) : null}

          {mutation.isSuccess ? (
            <p className="flex items-center gap-2 text-sm text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              {successMessage}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={mutation.isPending}
            width="full"
            variant="secondary"
            size="lg"
          >
            {mutation.isPending ? 'Отправляем...' : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
