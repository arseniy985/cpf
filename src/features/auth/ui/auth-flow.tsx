'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useSession } from '@/features/session/model/use-session';
import { CPFBrand } from '@/shared/ui/cpf-brand';
import {
  getAuthPageCopy,
  getPostAuthRedirect,
  type AuthIntent,
  type AuthMode,
  type AuthStep,
  type VerificationContext,
} from '@/features/auth/model/auth-flow';
import { AuthIntentSwitcher } from '@/features/auth/ui/auth-intent-switcher';
import { CredentialsForm } from '@/features/auth/ui/credentials-form';
import { PasswordRecoveryForm } from '@/features/auth/ui/password-recovery-form';
import { VerifyCodeForm } from '@/features/auth/ui/verify-code-form';

export function AuthFlow({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const session = useSession();
  const nextHref = searchParams.get('next');
  const postAuthHref = nextHref?.startsWith('/app') ? nextHref : null;
  const urlIntent = mode === 'register' && searchParams.get('intent') === 'owner' ? 'owner' : 'investor';
  const [manualIntent, setManualIntent] = useState<AuthIntent | null>(null);
  const intent = mode === 'register' ? (manualIntent ?? urlIntent) : 'investor';
  const pageCopy = getAuthPageCopy(mode, intent);
  const [step, setStep] = useState<AuthStep>('credentials');
  const [verificationContext, setVerificationContext] = useState<VerificationContext | null>(null);
  const [email, setEmail] = useState(mode === 'login' ? 'investor@cpf.local' : '');

  useEffect(() => {
    if (session.user) {
      router.replace(postAuthHref ?? getPostAuthRedirect(session.user));
    }
  }, [postAuthHref, router, session.user]);

  const handleIntentChange = (nextIntent: AuthIntent) => {
    setManualIntent(nextIntent);
    setStep('credentials');
    setVerificationContext(null);

    const params = new URLSearchParams(searchParams.toString());
    params.set('intent', nextIntent);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <main
      id="main-content"
      className="relative min-h-screen overflow-hidden bg-[#f6faff] text-slate-900"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(53,194,255,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(33,88,216,0.12),transparent_28%),linear-gradient(180deg,#f8fbff_0%,#eef5ff_100%)]" />
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(191,216,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(191,216,255,0.18)_1px,transparent_1px)] [background-size:96px_96px]" />
      <div className="absolute left-[-6rem] top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(53,194,255,0.28),rgba(53,194,255,0)_72%)] blur-3xl" />
      <div className="absolute right-[-7rem] top-12 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(33,88,216,0.18),rgba(33,88,216,0)_70%)] blur-3xl" />
      <div className="absolute bottom-[-4rem] left-[10%] h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(12,168,242,0.14),rgba(12,168,242,0)_72%)] blur-3xl" />
      <div className="absolute right-[12%] top-[22%] hidden h-24 w-24 rotate-12 rounded-[2rem] border border-white/70 bg-white/55 shadow-[0_24px_60px_rgba(33,88,216,0.08)] backdrop-blur-xl lg:block" />
      <div className="absolute bottom-[14%] left-[14%] hidden h-18 w-18 rounded-full border border-indigo-100 bg-white/70 shadow-[0_18px_40px_rgba(21,36,73,0.08)] lg:block" />

      <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <CPFBrand className="shrink-0" />
          {mode === 'register' ? <AuthIntentSwitcher value={intent} onChange={handleIntentChange} /> : <div />}
        </div>

        <div className="flex flex-1 items-center justify-center py-8 md:py-12">
          <Card className="w-full max-w-[32rem] overflow-hidden rounded-[2rem] border-white/80 bg-white/82 text-slate-900 shadow-[0_32px_90px_rgba(21,36,73,0.14)] backdrop-blur-xl">
            <CardHeader className="space-y-5 border-none px-6 pb-0 pt-6 sm:px-8 sm:pt-8">
              <div className="flex items-center justify-between gap-3">
                <span className={`h-2.5 w-24 rounded-full ${intent === 'owner' ? 'bg-indigo-500' : 'bg-teal-400'}`} />
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {mode === 'register' ? 'Регистрация' : 'Вход'}
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-display font-bold leading-tight text-indigo-950 sm:text-4xl">
                  {pageCopy.title}
                </h1>
                <p className="max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
                  {step === 'credentials'
                    ? pageCopy.subtitle
                    : step === 'code'
                      ? 'Введите 6-значный код из письма и завершите вход.'
                      : 'Запросите код, подтвердите email и задайте новый пароль.'}
                </p>
              </div>
            </CardHeader>

            <CardContent className="px-6 pb-6 pt-6 sm:px-8 sm:pb-8">
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
                      session.setToken('session');
                      router.replace(postAuthHref ?? getPostAuthRedirect(result.user, mode === 'register' ? intent : undefined));
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
                  onSuccess={({ user }) => {
                    session.setToken('session');
                    router.replace(postAuthHref ?? getPostAuthRedirect(user, mode === 'register' ? intent : undefined));
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
    </main>
  );
}
