import { z } from 'zod';

export const contactRequestSchema = z.object({
  full_name: z.string().min(2, 'Укажите имя.'),
  phone: z.string().min(6, 'Укажите телефон.'),
  email: z.string().email('Введите корректный email.'),
  message: z.string().optional(),
});

export type ContactRequestFormValues = z.infer<typeof contactRequestSchema>;
