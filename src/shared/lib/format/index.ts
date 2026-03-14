export function formatMoney(value: number, currency: string = 'RUB') {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactMoney(value: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(value: string | null | undefined) {
  if (!value) {
    return 'Не указано';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return 'Не указано';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function formatRoleLabel(role: string) {
  const labels: Record<string, string> = {
    investor: 'Инвестор',
    project_owner: 'Инициатор проекта',
    manager: 'Менеджер',
    compliance: 'Compliance',
    accountant: 'Финансы',
    content_manager: 'Контент',
    admin: 'Администратор',
  };

  return labels[role] ?? role;
}
