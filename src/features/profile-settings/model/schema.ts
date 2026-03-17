import { z } from 'zod';

export const profileSettingsSchema = z.object({
  name: z.string().min(2, 'Укажите имя'),
  phone: z.string().trim().optional(),
  notifications_email: z.boolean(),
  notifications_sms: z.boolean(),
  notifications_marketing: z.boolean(),
});

export type ProfileSettingsFormValues = z.infer<typeof profileSettingsSchema>;
