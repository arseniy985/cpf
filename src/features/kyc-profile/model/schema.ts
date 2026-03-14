import { z } from 'zod';

export const kycProfileSchema = z.object({
  legal_name: z.string().min(2, 'Укажите юридическое имя.'),
  birth_date: z.string().optional(),
  tax_id: z.string().optional(),
  document_number: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export type KycProfileFormValues = z.infer<typeof kycProfileSchema>;
