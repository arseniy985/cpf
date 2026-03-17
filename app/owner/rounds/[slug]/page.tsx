import { redirect } from 'next/navigation';

export default async function OwnerRoundDetailsRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  redirect(`/app/owner/rounds/${slug}`);
}
