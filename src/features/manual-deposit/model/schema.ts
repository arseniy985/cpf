import { z } from 'zod';

export const manualDepositSchema = z.object({
  amount: z.string().min(1, 'Укажите сумму перевода.'),
  payer_name: z.string().trim().min(3, 'Укажите имя плательщика.').max(255, 'Слишком длинное имя.'),
  payer_bank: z.string().trim().max(255, 'Слишком длинное название банка.').optional(),
  payer_account_last4: z.string().trim().max(4, 'Нужно не более 4 цифр.').optional(),
  comment: z.string().trim().max(2000, 'Комментарий слишком длинный.').optional(),
});

export type ManualDepositFormValues = z.infer<typeof manualDepositSchema>;
