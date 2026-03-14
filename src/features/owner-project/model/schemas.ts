import { z } from 'zod';

export const ownerProjectSchema = z.object({
  slug: z.string().min(2, 'Укажите slug.'),
  title: z.string().min(3, 'Укажите название.'),
  excerpt: z.string().min(10, 'Добавьте краткое описание.'),
  description: z.string().min(20, 'Добавьте полное описание.'),
  thesis: z.string().optional(),
  risk_summary: z.string().optional(),
  location: z.string().min(2, 'Укажите локацию.'),
  asset_type: z.string().min(2, 'Укажите тип актива.'),
  risk_level: z.string().min(2, 'Укажите уровень риска.'),
  payout_frequency: z.string().min(2, 'Укажите частоту выплат.'),
  min_investment: z.string().min(1, 'Укажите минимальный вход.'),
  target_amount: z.string().min(1, 'Укажите цель раунда.'),
  target_yield: z.string().min(1, 'Укажите доходность.'),
  term_months: z.string().min(1, 'Укажите срок в месяцах.'),
  cover_image_url: z.string().url('Нужен корректный URL.').or(z.literal('')),
  hero_metric: z.string().optional(),
});

export type OwnerProjectFormValues = z.infer<typeof ownerProjectSchema>;

export const ownerProjectDocumentSchema = z.object({
  title: z.string().min(2, 'Укажите название документа.'),
  kind: z.string().min(2, 'Укажите тип документа.'),
  file_url: z.string().url('Нужен корректный URL.').or(z.literal('')),
});

export type OwnerProjectDocumentFormValues = z.infer<typeof ownerProjectDocumentSchema>;

export const ownerProjectReportSchema = z.object({
  title: z.string().min(2, 'Укажите название отчета.'),
  report_date: z.string().min(1, 'Укажите дату отчета.'),
  file_url: z.string().url('Нужен корректный URL.').or(z.literal('')),
  summary: z.string().optional(),
});

export type OwnerProjectReportFormValues = z.infer<typeof ownerProjectReportSchema>;
