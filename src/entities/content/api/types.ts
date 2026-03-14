import type { ApiProject } from '@/entities/project/api/types';

export type HomeResponse = {
  data: {
    stats: {
      projectsCount: number;
      investorsCount: number;
      totalInvested: number;
    };
    featuredProjects: ApiProject[];
  };
};

export type FaqEntry = {
  id: string;
  groupName: string;
  question: string;
  answer: string;
};

export type FaqResponse = {
  data: FaqEntry[];
};

export type LegalDocument = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  documentType: string;
  fileUrl: string | null;
  publishedAt: string | null;
};

export type LegalDocumentsResponse = {
  data: LegalDocument[];
};

export type StaticPage = {
  id: string;
  key: string;
  title: string;
  headline: string | null;
  summary: string | null;
  body: string | null;
  meta: Record<string, unknown>;
};

export type StaticPageResponse = {
  data: StaticPage;
};

export type Review = {
  id: string;
  authorName: string;
  authorRole: string | null;
  companyName: string | null;
  rating: number;
  body: string;
};

export type ReviewResponse = {
  data: Review[];
};

export type CaseStudy = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  resultMetric: string | null;
  publishedAt: string | null;
};

export type CaseStudyResponse = {
  data: CaseStudy[];
};

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
};

export type BlogCategoryResponse = {
  data: BlogCategory[];
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  tags: string[];
  category: BlogCategory | null;
  publishedAt: string | null;
};

export type BlogPostResponse = {
  data: BlogPost;
};

export type BlogPostsResponse = {
  data: BlogPost[];
};
