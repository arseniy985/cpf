import ProjectDetailsPage from '@/pages/project-details';

export default async function ProjectDetailsRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ProjectDetailsPage projectSlug={id} />;
}
