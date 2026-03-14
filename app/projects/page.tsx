import ProjectsPage from '@/pages/projects';

export default async function ProjectsRoute({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;

  return <ProjectsPage initialSearch={params.search ?? ''} />;
}
