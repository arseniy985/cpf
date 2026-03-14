import { Badge } from '@/components/ui/badge';

const tones: Record<string, string> = {
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  pending_review: 'border-amber-200 bg-amber-50 text-amber-700',
  approved: 'border-blue-200 bg-blue-50 text-blue-700',
  posted: 'border-blue-200 bg-blue-50 text-blue-700',
  confirmed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  verified: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  published: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  paid: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  succeeded: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  processing: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  draft: 'border-slate-200 bg-slate-100 text-slate-700',
  cancelled: 'border-slate-200 bg-slate-100 text-slate-700',
  failed: 'border-rose-200 bg-rose-50 text-rose-700',
  rejected: 'border-rose-200 bg-rose-50 text-rose-700',
  voided: 'border-rose-200 bg-rose-50 text-rose-700',
};

const labels: Record<string, string> = {
  pending: 'Ожидает действия',
  pending_review: 'На проверке',
  approved: 'Одобрено',
  confirmed: 'Подтверждено',
  draft: 'Черновик',
  published: 'Опубликовано',
  rejected: 'Отклонено',
  cancelled: 'Отменено',
  paid: 'Выплачено',
  posted: 'Проведено',
  succeeded: 'Успешно',
  failed: 'Ошибка',
  processing: 'В обработке',
  verified: 'Подтверждено',
  voided: 'Аннулировано',
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge className={tones[status] ?? tones.draft}>{labels[status] ?? status}</Badge>;
}
