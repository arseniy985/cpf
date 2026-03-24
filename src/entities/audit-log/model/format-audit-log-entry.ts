import type { AuditLogEntry } from '@/entities/audit-log/api/types';
import { formatDateTime } from '@/shared/lib/format';

const fieldLabels: Record<string, string> = {
  status: 'статус',
  slug: 'адрес страницы',
  title: 'название',
  opens_at: 'дата открытия',
  closed_at: 'дата закрытия',
  closes_at: 'дата завершения',
  went_live_at: 'дата публикации',
  review_submitted_at: 'дата отправки на проверку',
  project_id: 'проект',
  term_months: 'срок',
  target_yield: 'доходность',
  target_amount: 'целевая сумма',
  current_amount: 'собранная сумма',
  min_investment: 'минимальная инвестиция',
  owner_account_id: 'владелец',
  payout_frequency: 'график выплат',
  oversubscription_allowed: 'переподписка',
  notes: 'комментарий',
  published_at: 'дата публикации',
  excerpt: 'краткое описание',
  description: 'описание',
  thesis: 'инвестиционный тезис',
  risk_summary: 'риски',
  legal_name: 'юридическое название',
};

function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

function lowerFirst(value: string) {
  return value ? value.charAt(0).toLowerCase() + value.slice(1) : value;
}

function getFieldLabel(field: string) {
  const normalized = normalizeKey(field);

  return fieldLabels[normalized] ?? field.replaceAll('_', ' ');
}

function formatChangedFields(fields: string[]) {
  if (!fields.length) {
    return null;
  }

  return fields.map(getFieldLabel).join(', ');
}

function getEntryTitle(entry: AuditLogEntry) {
  const subject = lowerFirst(entry.subjectLabel);

  switch (entry.event) {
    case 'created':
      return `Создан ${subject}`;
    case 'updated':
      return `Обновлён ${subject}`;
    case 'deleted':
      return `Удалён ${subject}`;
    case 'approved':
      return `${entry.subjectLabel} одобрен`;
    case 'published':
    case 'went_live':
      return `${entry.subjectLabel} опубликован`;
    case 'rejected':
      return `${entry.subjectLabel} отклонён`;
    case 'revision_requested':
      return `Нужна доработка: ${subject}`;
    case 'documents_required':
      return `Нужны документы: ${subject}`;
    case 'suspended':
      return `${entry.subjectLabel} приостановлен`;
    default:
      return entry.subjectLabel;
  }
}

function getEntryDescription(entry: AuditLogEntry) {
  const fields = formatChangedFields(entry.changedFields);

  switch (entry.event) {
    case 'created':
      return fields ? `Заполнены основные данные: ${fields}.` : 'Объект добавлен в систему.';
    case 'updated':
      return fields ? `Изменены данные: ${fields}.` : 'Данные обновлены.';
    case 'deleted':
      return 'Запись удалена.';
    case 'approved':
      return 'Проверка завершена успешно.';
    case 'published':
    case 'went_live':
      return 'Объект стал доступен пользователям.';
    case 'rejected':
      return 'Изменение отклонено после проверки.';
    case 'revision_requested':
      return fields ? `Нужно доработать: ${fields}.` : 'Нужно внести правки после проверки.';
    case 'documents_required':
      return 'Для продолжения не хватает документов.';
    case 'suspended':
      return 'Доступ или публикация временно ограничены.';
    default:
      return fields ? `${entry.description}. Изменены поля: ${fields}.` : entry.description;
  }
}

export function formatAuditLogEntry(entry: AuditLogEntry) {
  return {
    title: getEntryTitle(entry),
    description: getEntryDescription(entry),
    meta: entry.causerName
      ? `${formatDateTime(entry.createdAt)} · ${entry.causerName}`
      : formatDateTime(entry.createdAt),
  };
}
