import { z } from 'zod';

export const withdrawFundsSchema = z.object({
  amount: z.string().min(1, 'Укажите сумму вывода.'),
  bank_name: z.string().min(2, 'Укажите банк.'),
  bank_account: z.string().min(8, 'Укажите счет или номер карты.'),
  comment: z.string().optional(),
});

export type WithdrawFundsFormValues = z.infer<typeof withdrawFundsSchema>;
