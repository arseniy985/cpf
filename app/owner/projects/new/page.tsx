import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/app/owner/projects?dialog=create');
}
