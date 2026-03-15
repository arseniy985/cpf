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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateOwnerOrganizationMutation } from '@/entities/owner-account/api/hooks';
import type { OwnerOrganization } from '@/entities/owner-account/api/types';
import { getApiErrorMessage } from '@/shared/lib/api/get-api-error-message';
import { applyApiFormErrors } from '@/shared/lib/forms';
import {
  ownerOrganizationSchema,
  type OwnerOrganizationFormValues,
} from '../model/schemas';

const entityOptions = [
  { value: 'ooo', label: 'ООО' },
  { value: 'ip', label: 'ИП' },
  { value: 'spv', label: 'SPV / проектная компания' },
  { value: 'ao', label: 'АО' },
];

function mapValues(organization: OwnerOrganization): OwnerOrganizationFormValues {
  return {
    legal_name: organization.legalName ?? '',
    brand_name: organization.brandName ?? '',
    entity_type: organization.entityType ?? 'ooo',
    registration_number: organization.registrationNumber ?? '',
    tax_id: organization.taxId ?? '',
    website_url: organization.websiteUrl ?? '',
    address: organization.address ?? '',
    signatory_name: organization.signatoryName ?? '',
    signatory_role: organization.signatoryRole ?? '',
    beneficiary_name: organization.beneficiaryName ?? '',
    overview: organization.overview ?? '',
  };
}

export function OwnerOrganizationForm({ organization }: { organization: OwnerOrganization }) {
  const mutation = useUpdateOwnerOrganizationMutation();
  const form = useForm<OwnerOrganizationFormValues>({
    resolver: zodResolver(ownerOrganizationSchema),
    defaultValues: mapValues(organization),
  });

  useEffect(() => {
    form.reset(mapValues(organization));
  }, [form, organization]);

  async function onSubmit(values: OwnerOrganizationFormValues) {
    try {
      await mutation.mutateAsync({
        ...values,
        brand_name: values.brand_name || undefined,
        website_url: values.website_url || undefined,
        signatory_role: values.signatory_role || undefined,
        beneficiary_name: values.beneficiary_name || undefined,
        overview: values.overview || undefined,
      });
      toast.success('Организация обновлена');
    } catch (error) {
      applyApiFormErrors(error, form.setError);
      toast.error(getApiErrorMessage(error, 'Не удалось сохранить данные организации.'));
    }
  }

  return (
    <Form {...form}>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="legal_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Юрлицо</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brand_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Публичный бренд</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="entity_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Форма организации</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите форму…" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {entityOptions.map((option) => (
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
          name="registration_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Регистрационный номер</FormLabel>
              <FormControl>
                <Input autoComplete="off" spellCheck={false} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tax_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ИНН</FormLabel>
              <FormControl>
                <Input autoComplete="off" inputMode="numeric" spellCheck={false} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Сайт организации</FormLabel>
              <FormControl>
                <Input autoComplete="off" inputMode="url" placeholder="https://company.example…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Юридический адрес</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="signatory_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Подписант</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="signatory_role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Должность подписанта</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="beneficiary_name"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Бенефициар</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormDescription>Если бенефициаров несколько, укажите основного для стартового KYB-пакета.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="overview"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Комментарий по структуре сделки</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="md:col-span-2">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Сохраняем…' : 'Сохранить организацию'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
