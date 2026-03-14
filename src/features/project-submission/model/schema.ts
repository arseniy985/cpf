import { z } from 'zod';

export const projectSubmissionSchema = z.object({
  full_name: z.string().min(2, 'Укажите имя.'),
  email: z.string().email('Введите корректный email.'),
  phone: z.string().min(6, 'Укажите телефон.'),
  project_name: z.string().min(3, 'Укажите название проекта.'),
  company_name: z.string().optional(),
  target_amount: z.string().min(1, 'Укажите целевую сумму.'),
  message: z.string().optional(),
});

export type ProjectSubmissionFormValues = z.infer<typeof projectSubmissionSchema>;
