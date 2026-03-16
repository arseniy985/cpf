import type { AccountType, AuthUser, EmailCodePurpose } from '@/entities/viewer/api/types';
import { isLoginCodeRequired, isRegistrationCodeRequired } from '@/shared/config/auth';

export type AuthMode = 'login' | 'register';
export type AuthStep = 'credentials' | 'code' | 'recovery';
export type AuthIntent = AccountType;

export type VerificationContext = {
  email: string;
  purpose: EmailCodePurpose;
};

export function getPostAuthRedirect(user: AuthUser, intent?: AuthIntent) {
  if (intent === 'owner' || user.roles.includes('project_owner')) {
    return '/owner';
  }

  return '/dashboard';
}

export function getAuthPageCopy(mode: AuthMode, intent: AuthIntent = 'investor') {
  if (mode === 'register') {
    const registerRequiresCode = isRegistrationCodeRequired();
    const isOwner = intent === 'owner';

    return {
      title: isOwner ? 'Создайте кабинет владельца' : 'Создайте кабинет инвестора',
      subtitle: registerRequiresCode
        ? isOwner
          ? 'После регистрации подтвердите email и сразу перейдете в кабинет владельца: заполните данные компании и добавьте первый объект.'
          : 'После регистрации отправим код подтверждения на email. После проверки откроется доступ к кабинету.'
        : isOwner
          ? 'Заполните данные, чтобы сразу открыть кабинет владельца, заполнить профиль компании и перейти к первому объекту.'
          : 'Заполните данные, чтобы сразу создать кабинет и перейти в рабочую зону платформы.',
      alternateHref: '/login',
      alternateLabel: 'Уже есть кабинет? Войти',
      submitLabel: registerRequiresCode
        ? isOwner
          ? 'Создать кабинет и получить код'
          : 'Продолжить и получить код'
        : isOwner
          ? 'Создать кабинет владельца'
          : 'Создать кабинет',
    };
  }

  const loginRequiresCode = isLoginCodeRequired();

  return {
    title: loginRequiresCode ? 'Вход по email-коду' : 'Вход в личный кабинет',
    subtitle: loginRequiresCode
      ? 'Сначала проверяем пароль, затем отправляем одноразовый код на email.'
      : 'Введите email и пароль, чтобы сразу перейти в личный кабинет.',
    alternateHref: '/register',
    alternateLabel: 'Нет кабинета? Зарегистрироваться',
    submitLabel: loginRequiresCode ? 'Отправить код для входа' : 'Войти',
  };
}
