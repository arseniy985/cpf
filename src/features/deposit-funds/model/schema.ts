import { z } from 'zod';

export const depositFundsSchema = z.object({
  amount: z.string().min(1, 'Укажите сумму пополнения.'),
});

export type DepositFundsFormValues = z.infer<typeof depositFundsSchema>;
