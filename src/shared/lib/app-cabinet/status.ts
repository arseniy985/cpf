type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

type StatusMeta = {
  label: string;
  tone: StatusTone;
};

const statusMap: Record<string, StatusMeta> = {
  verified: { label: 'Подтверждено', tone: 'success' },
  confirmed: { label: 'Подтверждено', tone: 'success' },
  succeeded: { label: 'Исполнено', tone: 'success' },
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
  preparing: { label: 'Подготовка', tone: 'info' },
  collecting: { label: 'Идёт сбор', tone: 'success' },
  archived: { label: 'В архиве', tone: 'neutral' },
  kyc_draft: { label: 'Черновик проверки', tone: 'neutral' },
  kyc_review: { label: 'Проверка профиля', tone: 'info' },
  kyc_approved: { label: 'Профиль подтверждён', tone: 'success' },
  kyc_rejected: { label: 'Проверка не пройдена', tone: 'danger' },
  lead: { label: 'Лид', tone: 'neutral' },
  invited: { label: 'Приглашён', tone: 'info' },
  account_created: { label: 'Аккаунт создан', tone: 'info' },
  kyb_in_progress: { label: 'Проверка компании', tone: 'info' },
  kyb_under_review: { label: 'Компания на проверке', tone: 'info' },
  kyb_approved: { label: 'Компания подтверждена', tone: 'success' },
  kyb_rejected: { label: 'Проверка компании не пройдена', tone: 'danger' },
  active: { label: 'Активен', tone: 'success' },
  suspended: { label: 'Ограничен', tone: 'danger' },
  fully_paid: { label: 'Выплачено', tone: 'success' },
  owner: { label: 'Владелец', tone: 'info' },
  admin: { label: 'Администратор', tone: 'info' },
  member: { label: 'Участник', tone: 'neutral' },
  operator: { label: 'Оператор', tone: 'info' },
  manager: { label: 'Менеджер', tone: 'info' },
  viewer: { label: 'Наблюдатель', tone: 'neutral' },
  signer: { label: 'Подписант', tone: 'info' },
  finance_manager: { label: 'Финансовый менеджер', tone: 'info' },
  legal_manager: { label: 'Юридический менеджер', tone: 'info' },
};

export function getStatusMeta(status: string | null | undefined): StatusMeta {
  if (!status) {
    return {
      label: 'Нет статуса',
      tone: 'neutral',
    };
  }

  const normalized = status.trim().toLowerCase().replace(/[\s-]+/g, '_');

  return statusMap[normalized] ?? {
    label: status.replaceAll('_', ' ').replaceAll('-', ' '),
    tone: 'neutral',
  };
}

export function getStatusToneClasses(tone: StatusTone) {
  switch (tone) {
    case 'success':
      return 'border-transparent bg-brand-success/10 text-brand-success';
    case 'warning':
      return 'border-transparent bg-brand-warning/10 text-brand-warning';
    case 'danger':
      return 'border-transparent bg-brand-error/10 text-brand-error';
    case 'info':
      return 'border-transparent bg-brand-secondary text-brand-primary';
    default:
      return 'border-slate-200 text-brand-text';
  }
}
