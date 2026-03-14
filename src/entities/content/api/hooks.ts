'use client';

import { useQuery } from '@tanstack/react-query';
import {
  fetchBlogCategories,
  fetchBlogPost,
  fetchBlogPosts,
  fetchCaseStudies,
  fetchFaqs,
  fetchHome,
  fetchLegalDocuments,
  fetchReviews,
  fetchStaticPage,
} from './service';

export function useHomeQuery() {
  return useQuery({
    queryKey: ['content', 'home'],
    queryFn: fetchHome,
  });
}

export function useFaqsQuery() {
  return useQuery({
    queryKey: ['content', 'faq'],
    queryFn: fetchFaqs,
  });
}

export function useLegalDocumentsQuery() {
  return useQuery({
    queryKey: ['content', 'legal-documents'],
    queryFn: fetchLegalDocuments,
  });
}

export function useStaticPageQuery(key: 'about' | 'how-it-works' | 'contacts') {
  return useQuery({
    queryKey: ['content', 'page', key],
    queryFn: () => fetchStaticPage(key),
  });
}

export function useReviewsQuery() {
  return useQuery({
    queryKey: ['content', 'reviews'],
    queryFn: fetchReviews,
  });
}

export function useCaseStudiesQuery() {
  return useQuery({
    queryKey: ['content', 'case-studies'],
    queryFn: fetchCaseStudies,
  });
}

export function useBlogCategoriesQuery() {
  return useQuery({
    queryKey: ['content', 'blog-categories'],
    queryFn: fetchBlogCategories,
  });
}

export function useBlogPostsQuery() {
  return useQuery({
    queryKey: ['content', 'blog-posts'],
    queryFn: fetchBlogPosts,
  });
}

export function useBlogPostQuery(slug: string) {
  return useQuery({
    queryKey: ['content', 'blog-post', slug],
    queryFn: () => fetchBlogPost(slug),
    enabled: Boolean(slug),
  });
}
