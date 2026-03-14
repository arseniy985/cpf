export type ApiProjectDocument = {
  id: string;
  title: string;
  kind: string;
  label: string | null;
  fileUrl: string | null;
  isPublic: boolean;
};

export type ApiProject = {
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
  documents: ApiProjectDocument[];
};

export type ApiProjectsResponse = {
  data: ApiProject[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
};

export type ApiProjectResponse = {
  data: ApiProject;
};

export type ProjectFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type ProjectForecast = {
  projectId: string;
  amount: number;
  termMonths: number;
  monthlyIncome: number;
  totalPayout: number;
  schedule: Array<{
    month: number;
    payout: number;
  }>;
};
