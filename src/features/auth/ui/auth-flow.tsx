'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/widgets/site-header';
import Footer from '@/widgets/site-footer';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useSession } from '@/features/session/model/use-session';
import {
  getAuthPageCopy,
  getPostAuthRedirect,
  type AuthIntent,
  type AuthMode,
  type AuthStep,
  type VerificationContext,
} from '@/features/auth/model/auth-flow';
import { AuthPromoPanel } from '@/features/auth/ui/auth-promo-panel';
import { CredentialsForm } from '@/features/auth/ui/credentials-form';
import { PasswordRecoveryForm } from '@/features/auth/ui/password-recovery-form';
import { VerifyCodeForm } from '@/features/auth/ui/verify-code-form';

export function AuthFlow({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const session = useSession();
  const [intent, setIntent] = useState<AuthIntent>(() => {
    if (typeof window === 'undefined') {
      return 'investor';
    }

    return new URLSearchParams(window.location.search).get('intent') === 'owner' ? 'owner' : 'investor';
  });
  const pageCopy = getAuthPageCopy(mode, intent);
  const [step, setStep] = useState<AuthStep>('credentials');
  const [verificationContext, setVerificationContext] = useState<VerificationContext | null>(null);
  const [email, setEmail] = useState(mode === 'login' ? 'investor@cpf.local' : '');

  useEffect(() => {
    if (session.user) {
      router.replace(getPostAuthRedirect(session.user));
    }
  }, [router, session.user]);

  return (
    <main className="flex min-h-screen flex-col bg-[#f7f2ea]">
      <Header />
      <div className="flex-1 py-12">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
            <AuthPromoPanel mode={mode} intent={intent} subtitle={pageCopy.subtitle} />

            <Card className="overflow-hidden rounded-[36px] border-[#d5cabb] bg-[#fffdf8] shadow-[0_28px_80px_rgba(95,70,47,0.12)]">
              <CardHeader className="space-y-4 border-none px-8 pt-8 pb-0 md:px-10">
                <div className="flex items-center justify-between gap-3">
                  <div className={`h-2 w-20 rounded-full ${intent === 'owner' ? 'bg-[#d7854f]' : 'bg-teal-400'}`} />
                  {mode === 'register' ? (
                    <div className="inline-flex rounded-full border border-[#e3d5c6] bg-[#f6efe4] p-1">
                      {[
                        { value: 'investor', label: 'Инвестор' },
                        { value: 'owner', label: 'Владелец' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setIntent(option.value as AuthIntent)}
                          className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                            intent === option.value
                              ? 'bg-[#1f3242] text-white'
                              : 'text-[#6c604f] hover:text-[#1f3242]'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div>
                  <h2 className="text-3xl font-display font-black text-[#1f3242] md:text-4xl">
                    {pageCopy.title}
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#6c604f] md:text-base">
                    {step === 'credentials'
                      ? pageCopy.subtitle
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
                    intent={intent}
                    alternateHref={pageCopy.alternateHref}
                    alternateLabel={pageCopy.alternateLabel}
                    submitLabel={pageCopy.submitLabel}
                    onRecovery={() => setStep('recovery')}
                    onSuccess={(result) => {
                      if (result.kind === 'authenticated') {
                        session.setToken(result.token);
                        router.replace(getPostAuthRedirect(result.user, mode === 'register' ? intent : undefined));
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
                    onSuccess={({ token, user }) => {
                      session.setToken(token);
                      router.replace(getPostAuthRedirect(user, mode === 'register' ? intent : undefined));
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
