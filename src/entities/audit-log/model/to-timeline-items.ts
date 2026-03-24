import type { AuditLogEntry } from '@/entities/audit-log/api/types';
import { formatAuditLogEntry } from './format-audit-log-entry';

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
    ...formatAuditLogEntry(entry),
    tone: resolveTone(entry),
  }));
}
