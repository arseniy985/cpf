import { z } from 'zod';
import { hasCompletePhoneNumber } from '@/shared/lib/forms/phone';

export const contactRequestSchema = z.object({
  full_name: z.string().min(2, 'Укажите имя.'),
  phone: z.string().refine(hasCompletePhoneNumber, 'Введите телефон полностью.'),
  email: z.string().email('Введите корректный email.'),
  message: z.string().optional(),
});

export type ContactRequestFormValues = z.infer<typeof contactRequestSchema>;
