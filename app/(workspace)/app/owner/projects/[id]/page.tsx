import OwnerProjectDetailPageV2 from '@/pages/owner-project-detail-v2/ui/owner-project-detail-page';

export default async function OwnerProjectDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <OwnerProjectDetailPageV2 slug={id} />;
}
