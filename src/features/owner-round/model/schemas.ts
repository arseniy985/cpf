import { z } from 'zod';

const slugPattern = /^[a-z0-9-]+$/;

export const ownerRoundSchema = z.object({
  project_id: z.string().trim().min(1, 'Выберите проект.'),
  slug: z.string().trim().min(2, 'Укажите slug раунда.').regex(slugPattern, 'Используйте латиницу, цифры и дефис.'),
  title: z.string().trim().min(2, 'Укажите название раунда.'),
  target_amount: z.string().trim().min(1, 'Укажите целевой объем.'),
  min_investment: z.string().trim().min(1, 'Укажите минимальный чек.'),
  target_yield: z.string().trim().min(1, 'Укажите доходность.'),
  payout_frequency: z.enum(['monthly', 'quarterly', 'at_maturity']),
  term_months: z.string().trim().min(1, 'Укажите срок раунда.'),
  oversubscription_allowed: z.boolean(),
  opens_at: z.string().trim().optional(),
  closes_at: z.string().trim().optional(),
  notes: z.string().trim().max(2000, 'Сократите комментарий до 2000 символов.'),
});

export const ownerDistributionSchema = z.object({
  title: z.string().trim().min(2, 'Укажите название распределения.'),
  period_label: z.string().trim().min(2, 'Укажите период.'),
  period_start: z.string().trim().optional(),
  period_end: z.string().trim().optional(),
  total_amount: z.string().trim().min(1, 'Укажите сумму распределения.'),
  payout_mode: z.enum(['manual', 'yookassa']),
  notes: z.string().trim().max(2000, 'Сократите комментарий до 2000 символов.'),
});

export type OwnerRoundFormValues = z.infer<typeof ownerRoundSchema>;
export type OwnerDistributionFormValues = z.infer<typeof ownerDistributionSchema>;
