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

export function getProjectCategoryLabel(assetType: string) {
  return projectCategoryLabels[assetType] ?? assetType;
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
