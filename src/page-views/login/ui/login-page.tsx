import { Suspense } from 'react';
import { AuthFlow } from '@/features/auth/ui/auth-flow';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthFlow mode="login" />
    </Suspense>
  );
}
