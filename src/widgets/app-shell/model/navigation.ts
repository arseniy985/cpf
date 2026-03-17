import type { LucideIcon } from 'lucide-react';
import {
  BellDot,
  BriefcaseBusiness,
  Building2,
  CircleDollarSign,
  FileStack,
  FolderKanban,
  HandCoins,
  Landmark,
  LayoutDashboard,
  Settings2,
  ShieldCheck,
  Users,
  WalletCards,
} from 'lucide-react';

export type WorkspaceMode = 'investor' | 'owner';

export type AppNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
  match: 'exact' | 'prefix';
};

export type AppRouteMeta = {
  title: string;
  section: string;
  description: string;
  mode: WorkspaceMode | 'shared';
};

export const investorNavigation: AppNavItem[] = [
  {
    href: '/app/investor',
    label: 'Обзор',
    icon: LayoutDashboard,
    description: 'Баланс, заявки, выплаты и ближайшие действия',
    match: 'exact',
  },
  {
    href: '/app/investor/portfolio',
    label: 'Портфель',
    icon: BriefcaseBusiness,
    description: 'Инвестиции, заявки и история изменений',
    match: 'prefix',
  },
  {
    href: '/app/investor/wallet',
    label: 'Кошелёк',
    icon: WalletCards,
    description: 'Заявки на пополнение, вывод и движение средств',
    match: 'prefix',
  },
  {
    href: '/app/investor/payouts',
    label: 'Выплаты',
    icon: HandCoins,
    description: 'Ожидаемые выплаты, начисления и задержки',
    match: 'prefix',
  },
  {
    href: '/app/investor/documents',
    label: 'Документы',
    icon: FileStack,
    description: 'Договоры, отчёты и подтверждения операций',
    match: 'prefix',
  },
  {
    href: '/app/investor/verification',
    label: 'Проверка',
    icon: ShieldCheck,
    description: 'KYC-анкета, документы и комментарии менеджера',
    match: 'prefix',
  },
];

export const ownerNavigation: AppNavItem[] = [
  {
    href: '/app/owner',
    label: 'Обзор',
    icon: Building2,
    description: 'Onboarding, проекты, раунды и обязательные шаги',
    match: 'exact',
  },
  {
    href: '/app/owner/organization',
    label: 'Организация',
    icon: ShieldCheck,
    description: 'Юрлицо, реквизиты и статусы KYB',
    match: 'prefix',
  },
  {
    href: '/app/owner/projects',
    label: 'Проекты',
    icon: FolderKanban,
    description: 'Паспорт актива, документы и публикация',
    match: 'prefix',
  },
  {
    href: '/app/owner/rounds',
    label: 'Раунды',
    icon: Landmark,
    description: 'Условия размещения, аллокации и статусы',
    match: 'prefix',
  },
  {
    href: '/app/owner/allocations',
    label: 'Аллокации',
    icon: CircleDollarSign,
    description: 'Заявки инвесторов и обработка распределений',
    match: 'prefix',
  },
  {
    href: '/app/owner/reporting',
    label: 'Отчётность',
    icon: FileStack,
    description: 'Отчёты, версии и отклонения от плана',
    match: 'prefix',
  },
  {
    href: '/app/owner/payouts',
    label: 'Выплаты',
    icon: WalletCards,
    description: 'Календарь, реестр получателей и возвраты',
    match: 'prefix',
  },
  {
    href: '/app/owner/team',
    label: 'Команда',
    icon: Users,
    description: 'Роли, права доступа и юридические подтверждения',
    match: 'prefix',
  },
];

export const sharedNavigation: AppNavItem[] = [
  {
    href: '/app',
    label: 'Аккаунт',
    icon: LayoutDashboard,
    description: 'Общий обзор двух режимов и быстрые переходы',
    match: 'exact',
  },
  {
    href: '/app/notifications',
    label: 'Уведомления',
    icon: BellDot,
    description: 'Единая лента по investor и owner',
    match: 'prefix',
  },
  {
    href: '/app/settings',
    label: 'Настройки',
    icon: Settings2,
    description: 'Профиль, выплаты, безопасность и роли',
    match: 'prefix',
  },
];

const routeMetaMatchers: Array<{
  match: (pathname: string) => boolean;
  meta: AppRouteMeta;
}> = [
  {
    match: (pathname) => pathname === '/app',
    meta: {
      title: 'Обзор аккаунта',
      section: 'Общий обзор',
      description: 'Статусы двух режимов, ключевые деньги и приоритетные действия по аккаунту.',
      mode: 'shared',
    },
  },
  {
    match: (pathname) => pathname === '/app/investor',
    meta: {
      title: 'Обзор инвестора',
      section: 'Investor Workspace',
      description: 'Баланс, заявки, подтверждённые инвестиции и ожидаемые выплаты без лишнего скролла.',
      mode: 'investor',
    },
  },
  {
    match: (pathname) => pathname.startsWith('/app/investor/portfolio'),
    meta: {
      title: 'Портфель',
      section: 'Investor Workspace',
      description: 'Все инвестиции и заявки со статусами, доходностью, сроком и документами.',
      mode: 'investor',
    },
  },
  {
    match: (pathname) => pathname.startsWith('/app/investor/wallet'),
    meta: {
      title: 'Кошелёк',
      section: 'Investor Workspace',
      description: 'Текущий баланс, заявки на пополнение и вывод, а также полная история движений.',
      mode: 'investor',
    },
  },
  {
    match: (pathname) => pathname.startsWith('/app/investor/payouts'),
    meta: {
      title: 'Выплаты и доход',
      section: 'Investor Workspace',
      description: 'Ожидаемые выплаты, начисления, фактические перечисления и причины задержек.',
      mode: 'investor',
    },
  },
  {
    match: (pathname) => pathname.startsWith('/app/investor/documents'),
    meta: {
      title: 'Документы инвестора',
      section: 'Investor Workspace',
      description: 'Договоры, отчёты по проектам и подтверждения операций в одном списке.',
      mode: 'investor',
    },
  },
  {
    match: (pathname) => pathname.startsWith('/app/investor/verification'),
    meta: {
      title: 'Проверка профиля',
      section: 'Investor Workspace',
      description: 'Анкета, документы, комментарии менеджера и следующий обязательный шаг.',
      mode: 'investor',
    },
  },
  {
    match: (pathname) => pathname === '/app/notifications',
    meta: {
      title: 'Уведомления',
      section: 'Shared',
      description: 'Единая лента событий по инвестициям, проверке, проектам и выплатам.',
      mode: 'shared',
    },
  },
  {
    match: (pathname) => pathname === '/app/settings',
    meta: {
      title: 'Настройки аккаунта',
      section: 'Shared',
      description: 'Профиль, контакты, выплаты, сессии и доступные режимы аккаунта.',
      mode: 'shared',
    },
  },
  {
    match: (pathname) => pathname === '/app/owner',
    meta: {
      title: 'Обзор owner workspace',
      section: 'Owner Workspace',
      description: 'Статус onboarding, замечания платформы, проекты, раунды и ближайшие обязательные действия.',
      mode: 'owner',
    },
  },
  {
    match: (pathname) => pathname.startsWith('/app/owner/organization'),
    meta: {
      title: 'Организация',
      section: 'Owner Workspace',
      description: 'Карточка owner account, юрлицо, реквизиты, документы и история изменений.',
      mode: 'owner',
    },
  },
  {
    match: (pathname) => pathname === '/app/owner/projects',
    meta: {
      title: 'Проекты',
      section: 'Owner Workspace',
      description: 'Список проектов, статусы публикации и переходы в рабочие карточки.',
      mode: 'owner',
    },
  },
  {
    match: (pathname) => pathname.startsWith('/app/owner/projects/'),
    meta: {
      title: 'Карточка проекта',
      section: 'Owner Workspace',
      description: 'Паспорт актива, финмодель, риски, документы, раунды и журнал изменений.',
      mode: 'owner',
    },
  },
  {
    match: (pathname) => pathname === '/app/owner/rounds',
    meta: {
      title: 'Раунды привлечения',
      section: 'Owner Workspace',
      description: 'Цели размещения, лимиты, прогресс сбора и статусы подготовки раундов.',
      mode: 'owner',
    },
  },
  {
    match: (pathname) => pathname.startsWith('/app/owner/rounds/'),
    meta: {
      title: 'Карточка раунда',
      section: 'Owner Workspace',
      description: 'Условия раунда, аллокации, документы, распределения и действия публикации.',
      mode: 'owner',
    },
  },
  {
    match: (pathname) => pathname.startsWith('/app/owner/allocations'),
    meta: {
      title: 'Инвесторы и аллокации',
      section: 'Owner Workspace',
      description: 'Заявки инвесторов, подтверждённые аллокации и история обработки.',
      mode: 'owner',
    },
  },
  {
    match: (pathname) => pathname.startsWith('/app/owner/reporting'),
    meta: {
      title: 'Отчётность',
      section: 'Owner Workspace',
      description: 'Регулярные отчёты, внеплановые уведомления и статусы публикации.',
      mode: 'owner',
    },
  },
  {
    match: (pathname) => pathname.startsWith('/app/owner/payouts'),
    meta: {
      title: 'Выплаты владельца',
      section: 'Owner Workspace',
      description: 'Календарь выплат, реестр получателей, ошибки, возвраты и ручная обработка.',
      mode: 'owner',
    },
  },
  {
    match: (pathname) => pathname.startsWith('/app/owner/team'),
    meta: {
      title: 'Команда и настройки',
      section: 'Owner Workspace',
      description: 'Приглашения, роли, права доступа, уведомления и юридические подтверждения.',
      mode: 'owner',
    },
  },
];

export function getAppRouteMeta(pathname: string): AppRouteMeta {
  return routeMetaMatchers.find((matcher) => matcher.match(pathname))?.meta ?? {
    title: 'Личный кабинет',
    section: 'Shared',
    description: 'Прозрачный кабинет инвестора и владельца объекта в одном аккаунте.',
    mode: pathname.startsWith('/app/owner') ? 'owner' : pathname.startsWith('/app/investor') ? 'investor' : 'shared',
  };
}

export function isNavItemActive(pathname: string, item: AppNavItem) {
  return item.match === 'exact' ? pathname === item.href : pathname.startsWith(item.href);
}

export function getModeRootHref(mode: WorkspaceMode) {
  return mode === 'owner' ? '/app/owner' : '/app/investor';
}
