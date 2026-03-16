'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, CheckCircle2, Command, Landmark, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CabinetBrand } from '@/widgets/cabinet-shell/ui/cabinet-brand';
import { useSession } from '@/features/session/model/use-session';
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
  const [intent, setIntent] = useState<AuthIntent>('investor');
  const pageCopy = getAuthPageCopy(mode, intent);
  const [step, setStep] = useState<AuthStep>('credentials');
  const [verificationContext, setVerificationContext] = useState<VerificationContext | null>(null);
  const [email, setEmail] = useState(mode === 'login' ? 'investor@cpf.local' : '');

  const shellHighlights = useMemo(
    () => intent === 'owner'
      ? [
          { icon: Landmark, label: 'Кабинет владельца', value: 'Данные компании, объекты и отчеты' },
          { icon: ShieldCheck, label: 'Проверка', value: 'Понятный путь от анкеты до публикации' },
          { icon: Command, label: 'Рабочее пространство', value: 'Отдельный раздел для владельца объекта' },
        ]
      : [
          { icon: CheckCircle2, label: 'Кабинет инвестора', value: 'Проекты, портфель и документы' },
          { icon: ShieldCheck, label: 'Контроль', value: 'Статусы проверки и заявок в одном месте' },
          { icon: Command, label: 'Быстрый доступ', value: 'После входа сразу открывается кабинет' },
        ],
    [intent],
  );

  useEffect(() => {
    if (mode !== 'register') {
      return;
    }

    setIntent(searchParams.get('intent') === 'owner' ? 'owner' : 'investor');
  }, [mode, searchParams]);

  useEffect(() => {
    if (session.user) {
      router.replace(getPostAuthRedirect(session.user));
    }
  }, [router, session.user]);

  const handleIntentChange = (nextIntent: AuthIntent) => {
    setIntent(nextIntent);
    setStep('credentials');
    setVerificationContext(null);

    const params = new URLSearchParams(searchParams.toString());
    params.set('intent', nextIntent);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <main
      id="main-content"
      className="relative min-h-screen overflow-hidden bg-[#090d14] text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,190,196,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(242,163,94,0.16),transparent_28%),linear-gradient(135deg,#090d14_0%,#131927_52%,#1d1420_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
      <div className="absolute left-[8%] top-28 hidden h-36 w-36 rounded-full border border-white/8 bg-white/4 blur-3xl lg:block" />
      <div className="absolute bottom-8 right-[10%] hidden h-44 w-44 rounded-full border border-[#f0b07c]/16 bg-[#f0b07c]/10 blur-3xl lg:block" />

      <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <CabinetBrand className="rounded-[1.6rem] bg-white/6 px-3 py-3 backdrop-blur-sm" />
          {mode === 'register' ? <AuthIntentSwitcher value={intent} onChange={handleIntentChange} /> : null}
        </div>

        <div className="flex flex-1 items-center py-8 md:py-10">
          <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(22rem,30rem)] lg:items-end">
            <div className="order-2 lg:order-1">
              <Badge className={`border-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.28em] ${
                intent === 'owner'
                  ? 'bg-[#f2a35e]/14 text-[#ffd8b3]'
                  : 'bg-[#28c6d1]/14 text-[#bff8ff]'
              }`}>
                {intent === 'owner' ? 'Кабинет владельца' : 'Кабинет инвестора'}
              </Badge>
              <h1 className="mt-6 max-w-4xl text-5xl font-display font-semibold leading-[0.92] tracking-tight text-balance md:text-7xl">
                {mode === 'register'
                  ? intent === 'owner'
                    ? 'Создайте кабинет владельца и добавьте первый объект.'
                    : 'Создайте кабинет инвестора и откройте доступ к проектам.'
                  : 'Войдите в кабинет и продолжите работу.'}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/66 md:text-lg">
                {step === 'credentials'
                  ? pageCopy.subtitle
                  : step === 'code'
                    ? 'Проверьте почту и введите одноразовый код. После подтверждения откроется ваш кабинет.'
                    : 'Запросите код восстановления, задайте новый пароль и снова войдите в кабинет.'}
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {shellHighlights.map((item) => (
                  <div key={item.label} className="rounded-[1.8rem] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
                    <item.icon className={`h-5 w-5 ${intent === 'owner' ? 'text-[#f4bf8f]' : 'text-[#84f4ff]'}`} aria-hidden="true" />
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-white/44">{item.label}</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/78">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-white/52">
                <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">Проверка личности и компании в одном месте</span>
                <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">Сразу переход в личный кабинет</span>
                <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2">Только нужные действия без лишних экранов</span>
              </div>
            </div>

            <Card className="order-1 overflow-hidden rounded-[2rem] border-white/10 bg-[#f5efe4] text-[#182235] shadow-[0_30px_100px_rgba(0,0,0,0.35)] lg:order-2">
              <CardHeader className="space-y-5 border-none px-7 pb-0 pt-7 md:px-8">
                <div className="flex items-center justify-between gap-3">
                  <div className={`h-2.5 w-24 rounded-full ${intent === 'owner' ? 'bg-[#d17e44]' : 'bg-[#1abdc8]'}`} />
                  <span className="rounded-full border border-[#d9cebd] bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6b6257]">
                    {mode === 'register' ? 'Регистрация' : 'Вход'}
                  </span>
                </div>
                <div>
                  <h2 className="text-4xl font-display font-semibold leading-none text-[#182235] md:text-5xl">
                    {pageCopy.title}
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#6a6259] md:text-base">
                    {step === 'credentials'
                      ? pageCopy.subtitle
                      : step === 'code'
                        ? 'Введите 6-значный код из письма и завершите вход.'
                        : 'Запросите код, подтвердите личность и задайте новый пароль.'}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="px-7 pb-7 pt-6 md:px-8">
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
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5 text-xs uppercase tracking-[0.22em] text-white/36">
          <span>Личный кабинет платформы</span>
          <Link href={mode === 'register' ? '/login' : '/register?intent=investor'} className="inline-flex items-center gap-2 transition-colors hover:text-white">
            {mode === 'register' ? 'Уже есть доступ' : 'Нужен новый кабинет'}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
