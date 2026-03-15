import type { LucideIcon } from 'lucide-react';
import {
  BellDot,
  BriefcaseBusiness,
  Building2,
  CircleUserRound,
  FileStack,
  FolderKanban,
  Landmark,
  LayoutDashboard,
  ShieldCheck,
  WalletCards,
} from 'lucide-react';

export type CabinetNavGroup = {
  id: string;
  label: string;
  items: CabinetNavItem[];
};

export type CabinetNavItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  match: 'exact' | 'prefix';
};

export type CabinetRouteMeta = {
  section: string;
  title: string;
  description: string;
};

const investorNavigation: CabinetNavItem[] = [
  {
    href: '/dashboard',
    label: 'Рабочий стол',
    description: 'Главное по заявкам, деньгам и задачам',
    icon: LayoutDashboard,
    match: 'exact',
  },
  {
    href: '/dashboard/portfolio',
    label: 'Портфель',
    description: 'Ваши заявки и подтвержденные участия',
    icon: BriefcaseBusiness,
    match: 'prefix',
  },
  {
    href: '/dashboard/wallet',
    label: 'Кошелек',
    description: 'Пополнения, выводы и история операций',
    icon: WalletCards,
    match: 'prefix',
  },
  {
    href: '/dashboard/documents',
    label: 'Документы',
    description: 'Договоры и материалы по сделкам',
    icon: FileStack,
    match: 'prefix',
  },
  {
    href: '/dashboard/kyc',
    label: 'Проверка профиля',
    description: 'Анкета и документы для проверки',
    icon: ShieldCheck,
    match: 'prefix',
  },
];

const ownerNavigation: CabinetNavItem[] = [
  {
    href: '/owner',
    label: 'Обзор',
    description: 'Статус профиля компании, задачи и ближайшие шаги',
    icon: Building2,
    match: 'exact',
  },
  {
    href: '/owner/organization',
    label: 'Организация',
    description: 'Юрлицо, реквизиты и проверка профиля',
    icon: ShieldCheck,
    match: 'prefix',
  },
  {
    href: '/owner/projects',
    label: 'Проекты',
    description: 'Черновики, карточки проектов и публикация',
    icon: FolderKanban,
    match: 'prefix',
  },
  {
    href: '/owner/rounds',
    label: 'Раунды',
    description: 'Сбор, аллокации и распределения по каждому объекту',
    icon: Landmark,
    match: 'prefix',
  },
  {
    href: '/owner/payouts',
    label: 'Выплаты',
    description: 'Очередь выплат и операции, требующие внимания',
    icon: WalletCards,
    match: 'prefix',
  },
];

const systemNavigation: CabinetNavItem[] = [
  {
    href: '/dashboard/notifications',
    label: 'Уведомления',
    description: 'Важные изменения и статусы',
    icon: BellDot,
    match: 'prefix',
  },
  {
    href: '/dashboard/settings',
    label: 'Настройки',
    description: 'Профиль и вход в кабинет',
    icon: CircleUserRound,
    match: 'prefix',
  },
];

const routeMatchers: Array<{
  match: (pathname: string) => boolean;
  meta: CabinetRouteMeta;
}> = [
  {
    match: (pathname) => pathname === '/dashboard',
    meta: {
      section: 'Личный кабинет',
      title: 'Рабочий стол',
      description: 'Главные показатели, ближайшие задачи и последние изменения по вашему кабинету.',
    },
  },
  {
    match: (pathname) => pathname.startsWith('/dashboard/portfolio'),
    meta: {
      section: 'Портфель',
      title: 'Портфель',
      description: 'Ваши инвестиционные заявки, подтверждения участия и статус по каждому проекту.',
    },
  },
  {
    match: (pathname) => pathname.startsWith('/dashboard/wallet'),
    meta: {
      section: 'Кошелек',
      title: 'Кошелек',
      description: 'Пополнения, выводы и история движения средств.',
    },
  },
  {
    match: (pathname) => pathname.startsWith('/dashboard/documents'),
    meta: {
      section: 'Документы',
      title: 'Документы',
      description: 'Юридические документы платформы и материалы по вашим сделкам.',
    },
  },
  {
    match: (pathname) => pathname.startsWith('/dashboard/kyc'),
    meta: {
      section: 'Проверка профиля',
      title: 'Проверка профиля',
      description: 'Анкета, документы и комментарии менеджера по вашей проверке.',
    },
  },
  {
    match: (pathname) => pathname.startsWith('/dashboard/notifications'),
    meta: {
      section: 'Уведомления',
      title: 'Уведомления',
      description: 'Все изменения по заявкам, проверкам и операциям.',
    },
  },
  {
    match: (pathname) => pathname.startsWith('/dashboard/settings'),
    meta: {
      section: 'Настройки',
      title: 'Настройки',
      description: 'Профиль пользователя, контакты и управление текущей сессией.',
    },
  },
  {
    match: (pathname) => pathname === '/owner',
    meta: {
      section: 'Кабинет владельца',
      title: 'Кабинет объекта',
      description: 'Готовность профиля компании, статус проверки и ближайшие шаги по запуску проектов.',
    },
  },
  {
    match: (pathname) => pathname.startsWith('/owner/organization'),
    meta: {
      section: 'Профиль компании',
      title: 'Организация',
      description: 'Юрлицо, банковские реквизиты и данные для проверки.',
    },
  },
  {
    match: (pathname) => pathname === '/owner/projects',
    meta: {
      section: 'Проекты',
      title: 'Мои проекты',
      description: 'Полный список проектов, статусы раундов и доступ к рабочим карточкам.',
    },
  },
  {
    match: (pathname) => pathname === '/owner/rounds',
    meta: {
      section: 'Раунды',
      title: 'Раунды привлечения',
      description: 'Рабочий список раундов: стадии сбора, аллокации, распределения и готовность к выплатам.',
    },
  },
  {
    match: (pathname) => pathname.startsWith('/owner/rounds/'),
    meta: {
      section: 'Раунды',
      title: 'Карточка раунда',
      description: 'Аллокации, реестры выплат и действия по текущему раунду.',
    },
  },
  {
    match: (pathname) => pathname === '/owner/payouts',
    meta: {
      section: 'Выплаты',
      title: 'Очередь выплат',
      description: 'Состояние выплат, причины ручной обработки и последние результаты.',
    },
  },
  {
    match: (pathname) => pathname === '/owner/projects/new',
    meta: {
      section: 'Проекты',
      title: 'Новый проект',
      description: 'Создание черновика проекта для дальнейшей модерации и размещения.',
    },
  },
  {
    match: (pathname) => pathname.startsWith('/owner/projects/'),
    meta: {
      section: 'Проекты',
      title: 'Карточка проекта',
      description: 'Редактирование сделки, документы, отчеты и метрики текущего раунда.',
    },
  },
];

export function getCabinetNavigation(roles: string[]): CabinetNavGroup[] {
  const groups: CabinetNavGroup[] = [
    {
      id: 'investor',
      label: '',
      items: investorNavigation,
    },
  ];

  if (roles.includes('project_owner')) {
    groups.push({
      id: 'owner',
      label: 'Владелец объекта',
      items: ownerNavigation,
    });
  }

  groups.push({
    id: 'system',
    label: 'Система',
    items: systemNavigation,
  });

  return groups;
}

export function getCabinetRouteMeta(pathname: string): CabinetRouteMeta {
  return routeMatchers.find((route) => route.match(pathname))?.meta ?? {
    section: pathname.startsWith('/owner') ? 'Кабинет владельца' : 'Личный кабинет',
    title: 'Рабочее пространство',
    description: 'Основные рабочие разделы по деньгам, документам и статусам.',
  };
}

export function isCabinetItemActive(pathname: string, item: CabinetNavItem) {
  if (item.match === 'exact') {
    return pathname === item.href;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function getCabinetAreaLabel(pathname: string) {
  return pathname.startsWith('/owner') ? 'Кабинет владельца' : 'Личный кабинет';
}

export function getLandingShortcut(pathname: string) {
  return pathname.startsWith('/owner') ? '/owner/projects' : '/dashboard';
}

export const cabinetUtilityLinks = [
  {
    href: '/projects',
    label: 'Каталог проектов',
    icon: Landmark,
  },
];
