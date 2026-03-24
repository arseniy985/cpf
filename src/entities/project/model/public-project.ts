import type { ApiProject } from '@/entities/project/api/types';

export type PublicProjectDocument = {
  id: string;
  title: string;
  kind: string;
  label: string | null;
  fileUrl: string | null;
  isPublic: boolean;
};

export type PublicProject = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  thesis: string | null;
  riskSummary: string | null;
  location: string;
  assetType: string;
  status: string;
  fundingStatus: string;
  riskLevel: string;
  payoutFrequency: string;
  minInvestment: number;
  targetAmount: number;
  currentAmount: number;
  targetYield: number;
  termMonths: number;
  coverImageUrl: string | null;
  heroMetric: string | null;
  isFeatured: boolean;
  publishedAt: string | null;
  fundingProgress: number;
  documents: PublicProjectDocument[];
};

export const projectCategoryLabels: Record<string, string> = {
  Все: 'Все',
  commercial_real_estate: 'Коммерческая недвижимость',
  income_property: 'Доходный объект',
  logistics: 'Логистика',
};

const fundingStatusLabels: Record<string, string> = {
  preparing: 'Подготовка',
  collecting: 'Идёт сбор',
  closed: 'Сбор завершён',
};

const riskLevelLabels: Record<string, string> = {
  low: 'Низкий',
  moderate: 'Умеренный',
  medium: 'Средний',
  elevated: 'Повышенный',
  high: 'Высокий',
};

const payoutFrequencyLabels: Record<string, string> = {
  monthly: 'Ежемесячно',
  quarterly: 'Ежеквартально',
  at_exit: 'В конце проекта',
  at_maturity: 'В конце периода',
};

const documentKindLabels: Record<string, string> = {
  memorandum: 'Инвестиционный меморандум',
  presentation: 'Презентация проекта',
  financial_model: 'Финансовая модель',
  legal_document: 'Юридический документ',
  report: 'Отчёт',
  faq: 'Вопросы и ответы',
  other: 'Документ',
};

function normalizeProjectValue(value: string | null | undefined) {
  return value?.trim().toLowerCase().replace(/[\s-]+/g, '_') ?? '';
}

export function getProjectCategoryLabel(assetType: string) {
  const normalized = normalizeProjectValue(assetType);

  return projectCategoryLabels[assetType] ?? projectCategoryLabels[normalized] ?? assetType;
}

export function getProjectFundingStatusLabel(status: string | null | undefined) {
  const normalized = normalizeProjectValue(status);

  return fundingStatusLabels[normalized] ?? 'Статус уточняется';
}

export function getProjectRiskLevelLabel(riskLevel: string | null | undefined) {
  if (!riskLevel) {
    return 'Не указан';
  }

  const normalized = normalizeProjectValue(riskLevel);

  return riskLevelLabels[normalized] ?? riskLevel;
}

export function getProjectPayoutFrequencyLabel(payoutFrequency: string | null | undefined) {
  if (!payoutFrequency) {
    return 'Не указана';
  }

  const normalized = normalizeProjectValue(payoutFrequency);

  return payoutFrequencyLabels[normalized] ?? payoutFrequency;
}

export function getProjectDocumentKindLabel(kind: string | null | undefined) {
  if (!kind) {
    return 'Документ';
  }

  const normalized = normalizeProjectValue(kind);

  return documentKindLabels[normalized] ?? kind.replaceAll('_', ' ');
}

export function formatProjectMoney(value: number) {
  return `${value.toLocaleString('ru-RU')} ₽`;
}

export function formatProjectYield(value: number) {
  return `${value.toFixed(1)}%`;
}

export function formatProjectTerm(termMonths: number) {
  return `${termMonths} мес`;
}

export function mapApiProjectToPublicProject(project: ApiProject): PublicProject {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    excerpt: project.excerpt,
    description: project.description,
    thesis: project.thesis,
    riskSummary: project.riskSummary,
    location: project.location,
    assetType: project.assetType,
    status: project.status,
    fundingStatus: project.fundingStatus,
    riskLevel: project.riskLevel,
    payoutFrequency: project.payoutFrequency,
    minInvestment: project.minInvestment,
    targetAmount: project.targetAmount,
    currentAmount: project.currentAmount,
    targetYield: project.targetYield,
    termMonths: project.termMonths,
    coverImageUrl: project.coverImageUrl,
    heroMetric: project.heroMetric,
    isFeatured: project.isFeatured,
    publishedAt: project.publishedAt,
    fundingProgress: project.fundingProgress,
    documents: project.documents.map((document) => ({
      id: document.id,
      title: document.title,
      kind: document.kind,
      label: document.label,
      fileUrl: document.fileUrl,
      isPublic: document.isPublic,
    })),
  };
}
