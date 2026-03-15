import OwnerRoundDetailsPage from '@/pages/owner-round-details/ui/owner-round-details-page';

export default async function OwnerRoundDetailsRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <OwnerRoundDetailsPage slug={slug} />;
}
