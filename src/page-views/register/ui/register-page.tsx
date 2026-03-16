import { Suspense } from 'react';
import { AuthFlow } from '@/features/auth/ui/auth-flow';

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <AuthFlow mode="register" />
    </Suspense>
  );
}
