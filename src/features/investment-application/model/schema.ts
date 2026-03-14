import { z } from 'zod';

export function createInvestmentApplicationSchema(minInvestment: number) {
  return z.object({
    amount: z.string().min(1, 'Укажите сумму заявки.'),
    notes: z.string().optional(),
  });
}
