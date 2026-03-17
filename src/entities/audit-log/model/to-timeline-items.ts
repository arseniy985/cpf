import type { AuditLogEntry } from '@/entities/audit-log/api/types';

type TimelineTone = 'default' | 'success' | 'warning';

function resolveTone(entry: AuditLogEntry): TimelineTone {
  if (['created', 'approved', 'activated', 'published', 'went_live'].includes(entry.event)) {
    return 'success';
  }

  if (['rejected', 'revision_requested', 'documents_required', 'suspended'].includes(entry.event)) {
    return 'warning';
  }

  return 'default';
}

export function toTimelineItems(entries: AuditLogEntry[]) {
  return entries.map((entry) => ({
    id: entry.id,
    title: entry.subjectLabel,
    description: entry.changedFields.length
      ? `${entry.description}. Поля: ${entry.changedFields.join(', ')}.`
      : entry.description,
    meta: entry.causerName
      ? `${entry.createdAt ?? 'Без даты'} · ${entry.causerName}`
      : entry.createdAt ?? 'Без даты',
    tone: resolveTone(entry),
  }));
}
