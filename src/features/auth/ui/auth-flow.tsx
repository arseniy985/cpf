'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/widgets/site-header';
import Footer from '@/widgets/site-footer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useSession } from '@/features/session/model/use-session';
import {
  getAuthPageCopy,
  type AuthMode,
  type AuthStep,
  type VerificationContext,
} from '@/features/auth/model/auth-flow';
import { CredentialsForm } from '@/features/auth/ui/credentials-form';
import { PasswordRecoveryForm } from '@/features/auth/ui/password-recovery-form';
import { VerifyCodeForm } from '@/features/auth/ui/verify-code-form';

export function AuthFlow({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const session = useSession();
  const pageCopy = getAuthPageCopy(mode);
  const [step, setStep] = useState<AuthStep>('credentials');
  const [verificationContext, setVerificationContext] = useState<VerificationContext | null>(null);
  const [email, setEmail] = useState(mode === 'login' ? 'investor@cpf.local' : '');

  useEffect(() => {
    if (session.user) {
      router.replace('/dashboard');
    }
  }, [router, session.user]);

  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <div className="flex-1 py-12">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl">
            <Card className="rounded-[32px]">
              <CardHeader className="space-y-3 border-none px-8 pt-8 pb-0 md:px-10">
                <div className="h-2 w-16 bg-teal-400" />
                <div>
                  <h2 className="text-3xl font-display font-black text-indigo-950">
                    {pageCopy.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {step === 'credentials'
                      ? 'Заполните данные и перейдите к подтверждению.'
                      : step === 'code'
                        ? 'Проверьте почту и введите 6-значный код.'
                        : 'Запросите код восстановления и задайте новый пароль.'}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="px-8 pb-8 pt-6 md:px-10">
                {step === 'credentials' ? (
                  <CredentialsForm
                    mode={mode}
                    alternateHref={pageCopy.alternateHref}
                    alternateLabel={pageCopy.alternateLabel}
                    submitLabel={pageCopy.submitLabel}
                    onRecovery={() => setStep('recovery')}
                    onSuccess={(result) => {
                      if (result.kind === 'authenticated') {
                        session.setToken(result.token);
                        router.replace('/dashboard');
                        return;
                      }

                      setEmail(result.email);
                      setVerificationContext({
                        email: result.email,
                        purpose: result.purpose,
                      });
                      setStep('code');
                    }}
                  />
                ) : null}

                {step === 'code' && verificationContext ? (
                  <VerifyCodeForm
                    context={verificationContext}
                    onBack={() => setStep('credentials')}
                    onSuccess={(token) => {
                      session.setToken(token);
                      router.replace('/dashboard');
                    }}
                  />
                ) : null}

                {step === 'recovery' ? (
                  <PasswordRecoveryForm
                    initialEmail={email}
                    onBack={() => setStep('credentials')}
                  />
                ) : null}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
