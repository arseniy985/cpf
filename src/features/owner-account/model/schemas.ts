import { z } from 'zod';

const optionalUrl = z.union([z.literal(''), z.string().url('Укажите корректный URL.')]);

export const ownerAccountProfileSchema = z.object({
  display_name: z.string().trim().min(2, 'Укажите название кабинета владельца.'),
  slug: z.string().trim().min(2, 'Укажите короткий адрес кабинета.').regex(/^[a-z0-9-]+$/, 'Используйте латиницу, цифры и дефис.'),
  website_url: optionalUrl,
  overview: z.string().trim().max(2000, 'Сократите описание до 2000 символов.'),
});

export const ownerOrganizationSchema = z.object({
  legal_name: z.string().trim().min(2, 'Укажите юрлицо.'),
  brand_name: z.string().trim().max(255, 'Слишком длинное название.'),
  entity_type: z.string().trim().min(2, 'Выберите форму организации.'),
  registration_number: z.string().trim().min(6, 'Укажите регистрационный номер.'),
  tax_id: z.string().trim().min(6, 'Укажите ИНН.'),
  website_url: optionalUrl,
  address: z.string().trim().min(8, 'Укажите адрес.'),
  signatory_name: z.string().trim().min(2, 'Укажите подписанта.'),
  signatory_role: z.string().trim().max(255, 'Слишком длинная должность.'),
  beneficiary_name: z.string().trim().max(255, 'Слишком длинное имя.'),
  overview: z.string().trim().max(2000, 'Сократите описание до 2000 символов.'),
});

export const ownerBankProfileSchema = z.object({
  payout_method: z.string().trim().min(2, 'Выберите способ расчета.'),
  recipient_name: z.string().trim().min(2, 'Укажите получателя.'),
  bank_name: z.string().trim().min(2, 'Укажите банк.'),
  bank_bik: z.string().trim().min(9, 'Укажите БИК.'),
  bank_account: z.string().trim().min(10, 'Укажите расчетный счет.'),
  correspondent_account: z.string().trim().min(10, 'Укажите корреспондентский счет.'),
  notes: z.string().trim().max(1000, 'Сократите комментарий до 1000 символов.'),
});

export type OwnerAccountProfileFormValues = z.infer<typeof ownerAccountProfileSchema>;
export type OwnerOrganizationFormValues = z.infer<typeof ownerOrganizationSchema>;
export type OwnerBankProfileFormValues = z.infer<typeof ownerBankProfileSchema>;
