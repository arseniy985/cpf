import { BlogPostPage } from '@/pages/blog/ui/blog-post-page';

export default async function BlogPostRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <BlogPostPage slug={slug} />;
}
