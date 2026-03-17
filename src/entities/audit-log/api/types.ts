export type AuditLogEntry = {
  id: string;
  event: string;
  description: string;
  subjectType: string;
  subjectLabel: string;
  changedFields: string[];
  causerName: string | null;
  createdAt: string | null;
};

export type AuditLogResponse = {
  data: AuditLogEntry[];
};
