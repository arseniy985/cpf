import { z } from 'zod';

export const profileSettingsSchema = z.object({
  name: z.string().min(2, 'Укажите имя'),
  phone: z.string().trim().optional(),
});

export type ProfileSettingsFormValues = z.infer<typeof profileSettingsSchema>;
