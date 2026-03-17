import { z } from 'zod';
import { hasCompletePhoneNumber } from '@/shared/lib/forms/phone';

export const profileSettingsSchema = z.object({
  name: z.string().min(2, 'Укажите имя'),
  phone: z.string().trim().optional().refine((value) => !value || hasCompletePhoneNumber(value), {
    message: 'Введите телефон полностью.',
  }),
  notifications_email: z.boolean(),
  notifications_sms: z.boolean(),
  notifications_marketing: z.boolean(),
});

export type ProfileSettingsFormValues = z.infer<typeof profileSettingsSchema>;
