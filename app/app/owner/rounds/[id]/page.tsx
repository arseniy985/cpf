import OwnerRoundDetailPageV2 from '@/pages/owner-round-detail-v2/ui/owner-round-detail-page';

export default async function OwnerRoundDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <OwnerRoundDetailPageV2 slug={id} />;
}
