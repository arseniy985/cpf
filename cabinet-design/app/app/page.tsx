import { redirect } from 'next/navigation';

export default function AppRoot() {
  // In a real app, we might check user preferences or last active role.
  // For now, default to investor overview.
  redirect('/app/investor');
}
