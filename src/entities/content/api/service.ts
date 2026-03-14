import { mapApiProjectToPublicProject } from '@/entities/project';
import { fetchJson } from '@/shared/api/http/client';
import type {
  BlogCategoryResponse,
  BlogPostResponse,
  BlogPostsResponse,
  CaseStudyResponse,
  FaqResponse,
  HomeResponse,
  LegalDocumentsResponse,
  ReviewResponse,
  StaticPageResponse,
} from './types';

export async function fetchHome() {
  const response = await fetchJson<HomeResponse>('/api/v1/home');

  return {
    stats: response.data.stats,
    featuredProjects: response.data.featuredProjects.map(mapApiProjectToPublicProject),
  };
}

export async function fetchFaqs() {
  const response = await fetchJson<FaqResponse>('/api/v1/faq');

  return response.data;
}

export async function fetchLegalDocuments() {
  const response = await fetchJson<LegalDocumentsResponse>('/api/v1/legal-documents');

  return response.data;
}

export async function fetchStaticPage(key: 'about' | 'how-it-works' | 'contacts') {
  const response = await fetchJson<StaticPageResponse>(`/api/v1/public/${key}`);

  return response.data;
}

export async function fetchReviews() {
  const response = await fetchJson<ReviewResponse>('/api/v1/reviews');

  return response.data;
}

export async function fetchCaseStudies() {
  const response = await fetchJson<CaseStudyResponse>('/api/v1/case-studies');

  return response.data;
}

export async function fetchBlogCategories() {
  const response = await fetchJson<BlogCategoryResponse>('/api/v1/blog/categories');

  return response.data;
}

export async function fetchBlogPosts() {
  const response = await fetchJson<BlogPostsResponse>('/api/v1/blog/posts');

  return response.data;
}

export async function fetchBlogPost(slug: string) {
  const response = await fetchJson<BlogPostResponse>(`/api/v1/blog/posts/${slug}`);

  return response.data;
}
