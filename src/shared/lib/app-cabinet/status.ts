type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

type StatusMeta = {
  label: string;
  tone: StatusTone;
};

const statusMap: Record<string, StatusMeta> = {
  verified: { label: 'Подтверждено', tone: 'success' },
  'email verified': { label: 'Почта подтверждена', tone: 'success' },
  'email not verified': { label: 'Почта не подтверждена', tone: 'warning' },
  draft: { label: 'Черновик', tone: 'neutral' },
  review: { label: 'На проверке', tone: 'info' },
  pending_review: { label: 'На проверке', tone: 'info' },
  pending: { label: 'В работе', tone: 'info' },
  approved: { label: 'Подтверждено', tone: 'success' },
  approved_for_listing: { label: 'Одобрено к размещению', tone: 'success' },
  rejected: { label: 'Отклонено', tone: 'danger' },
  revision_requested: { label: 'Нужна доработка', tone: 'warning' },
  cancelled: { label: 'Отменено', tone: 'neutral' },
  canceled: { label: 'Отменено', tone: 'neutral' },
  completed: { label: 'Завершено', tone: 'success' },
  failed: { label: 'Ошибка', tone: 'danger' },
  paid: { label: 'Выплачено', tone: 'success' },
  posted: { label: 'Проведено', tone: 'success' },
  voided: { label: 'Аннулировано', tone: 'neutral' },
  live: { label: 'Активен', tone: 'success' },
  ready: { label: 'Готово', tone: 'success' },
  closed: { label: 'Закрыт', tone: 'neutral' },
  settling: { label: 'Расчёты', tone: 'info' },
  fully_allocated: { label: 'Полностью распределён', tone: 'success' },
  awaiting_documents: { label: 'Ждёт документы', tone: 'warning' },
  awaiting_transfer: { label: 'Ожидает перевод', tone: 'warning' },
  awaiting_user_clarification: { label: 'Нужно уточнение', tone: 'warning' },
  credited: { label: 'Зачислено', tone: 'success' },
  under_review: { label: 'На проверке', tone: 'info' },
  processing_manual_payout: { label: 'Ручная обработка', tone: 'warning' },
  precheck: { label: 'Предпроверка', tone: 'info' },
  documents_required: { label: 'Нужны документы', tone: 'warning' },
  published: { label: 'Опубликован', tone: 'success' },
  archived: { label: 'В архиве', tone: 'neutral' },
  kyc_draft: { label: 'KYC черновик', tone: 'neutral' },
  kyc_review: { label: 'KYC на проверке', tone: 'info' },
  kyc_approved: { label: 'KYC подтверждён', tone: 'success' },
  kyc_rejected: { label: 'KYC отклонён', tone: 'danger' },
  lead: { label: 'Лид', tone: 'neutral' },
  invited: { label: 'Приглашён', tone: 'info' },
  account_created: { label: 'Аккаунт создан', tone: 'info' },
  kyb_in_progress: { label: 'KYB в работе', tone: 'info' },
  kyb_under_review: { label: 'KYB на проверке', tone: 'info' },
  kyb_approved: { label: 'KYB подтверждён', tone: 'success' },
  kyb_rejected: { label: 'KYB отклонён', tone: 'danger' },
  active: { label: 'Активен', tone: 'success' },
  suspended: { label: 'Ограничен', tone: 'danger' },
  fully_paid: { label: 'Выплачено', tone: 'success' },
};

export function getStatusMeta(status: string | null | undefined): StatusMeta {
  if (!status) {
    return {
      label: 'Нет статуса',
      tone: 'neutral',
    };
  }

  return statusMap[status] ?? {
    label: status.replaceAll('_', ' '),
    tone: 'neutral',
  };
}

export function getStatusToneClasses(tone: StatusTone) {
  switch (tone) {
    case 'success':
      return 'border-app-cabinet-success/20 bg-app-cabinet-success/10 text-app-cabinet-success';
    case 'warning':
      return 'border-app-cabinet-warning/25 bg-app-cabinet-warning/10 text-app-cabinet-warning';
    case 'danger':
      return 'border-app-cabinet-danger/20 bg-app-cabinet-danger/10 text-app-cabinet-danger';
    case 'info':
      return 'border-app-cabinet-accent/25 bg-app-cabinet-accent/10 text-app-cabinet-primary';
    default:
      return 'border-app-cabinet-border bg-app-cabinet-secondary text-app-cabinet-text';
  }
}
