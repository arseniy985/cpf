type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

type StatusPresentation = {
  label: string;
  tone: StatusTone;
  description?: string;
};

const statusMap: Record<string, StatusPresentation> = {
  email_verified: { label: 'Email подтверждён', tone: 'success' },
  email_not_verified: { label: 'Email не подтверждён', tone: 'warning' },
  verified: { label: 'Подтверждено', tone: 'success' },
  pending: { label: 'Ожидает обработки', tone: 'warning' },
  draft: { label: 'Черновик', tone: 'neutral' },
  review: { label: 'На проверке', tone: 'info' },
  approved: { label: 'Подтверждено', tone: 'success' },
  rejected: { label: 'Отклонено', tone: 'danger' },
  cancelled: { label: 'Отменено', tone: 'neutral' },
  completed: { label: 'Завершено', tone: 'success' },
  confirmed: { label: 'Подтверждено', tone: 'success' },
  failed: { label: 'Ошибка', tone: 'danger' },
  succeeded: { label: 'Исполнено', tone: 'success' },
  posted: { label: 'Проведено', tone: 'success' },
  paid: { label: 'Выплачено', tone: 'success' },
  processing_manual_payout: { label: 'Ручная обработка', tone: 'warning' },
  awaiting_transfer: { label: 'Ожидает перевода', tone: 'warning' },
  awaiting_user_clarification: { label: 'Нужно уточнение', tone: 'warning' },
  under_review: { label: 'На проверке', tone: 'info' },
  credited: { label: 'Зачислено', tone: 'success' },
  expired: { label: 'Срок истёк', tone: 'danger' },
  waiting_for_capture: { label: 'Ожидает подтверждения', tone: 'info' },
  canceled: { label: 'Отменено', tone: 'neutral' },
  voided: { label: 'Аннулировано', tone: 'neutral' },
  pending_review: { label: 'Ожидает проверки', tone: 'warning' },
  kyc_draft: { label: 'KYC черновик', tone: 'neutral' },
  kyc_review: { label: 'KYC на проверке', tone: 'info' },
  kyc_approved: { label: 'KYC подтверждён', tone: 'success' },
  kyc_rejected: { label: 'KYC отклонён', tone: 'danger' },
  lead: { label: 'Лид', tone: 'neutral' },
  invited: { label: 'Приглашён', tone: 'info' },
  account_created: { label: 'Аккаунт создан', tone: 'info' },
  kyb_in_progress: { label: 'KYB в работе', tone: 'warning' },
  kyb_under_review: { label: 'KYB на проверке', tone: 'info' },
  kyb_approved: { label: 'KYB подтверждён', tone: 'success' },
  kyb_rejected: { label: 'KYB отклонён', tone: 'danger' },
  active: { label: 'Активен', tone: 'success' },
  suspended: { label: 'Приостановлен', tone: 'danger' },
  precheck: { label: 'Предпроверка', tone: 'info' },
  documents_required: { label: 'Нужны документы', tone: 'warning' },
  revision_requested: { label: 'Нужна доработка', tone: 'warning' },
  approved_for_listing: { label: 'Готов к размещению', tone: 'success' },
  published: { label: 'Опубликован', tone: 'success' },
  archived: { label: 'Архив', tone: 'neutral' },
  awaiting_documents: { label: 'Ожидает документы', tone: 'warning' },
  ready: { label: 'Готов', tone: 'success' },
  live: { label: 'Идёт размещение', tone: 'success' },
  fully_allocated: { label: 'Полностью распределён', tone: 'success' },
  closed: { label: 'Закрыт', tone: 'neutral' },
  settling: { label: 'Расчёты', tone: 'info' },
};

export function getStatusPresentation(status: string | null | undefined): StatusPresentation {
  if (!status) {
    return {
      label: 'Не задано',
      tone: 'neutral',
    };
  }

  const normalized = status.trim().toLowerCase().replace(/[\s-]+/g, '_');

  return statusMap[normalized] ?? {
    label: status.replace(/_/g, ' '),
    tone: 'neutral',
  };
}

export function getStatusToneClass(tone: StatusTone) {
  switch (tone) {
    case 'info':
      return 'border-cabinet-accent/30 bg-cabinet-accent-soft text-cabinet-accent-strong';
    case 'success':
      return 'border-cabinet-success/20 bg-cabinet-success/10 text-cabinet-success';
    case 'warning':
      return 'border-cabinet-warning/20 bg-cabinet-warning/10 text-cabinet-warning';
    case 'danger':
      return 'border-cabinet-error/20 bg-cabinet-error/10 text-cabinet-error';
    default:
      return 'border-cabinet-border bg-cabinet-panel text-cabinet-muted-ink';
  }
}
