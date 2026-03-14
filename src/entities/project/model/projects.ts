import type { PublicProject } from './public-project';

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  minInvestment: string;
  yield: string;
  term: string;
  funded: number;
  image: string;
  status: string;
  shortDescription: string;
  riskLevel: string;
};

export const projects: Project[] = [
  {
    id: '1',
    slug: '1',
    title: 'Торговый центр "Галерея"',
    category: 'Арендный бизнес',
    location: 'Москва, ЦАО',
    minInvestment: '50 000 ₽',
    yield: '22.5%',
    term: '36 мес',
    funded: 85,
    image: 'https://picsum.photos/seed/building1/1200/800',
    status: 'Сбор средств',
    shortDescription: 'Объект с действующими арендаторами и долгосрочными договорами аренды.',
    riskLevel: 'Умеренный',
  },
  {
    id: '2',
    slug: '2',
    title: 'Складской комплекс А+',
    category: 'Логистика',
    location: 'Московская область',
    minInvestment: '10 000 ₽',
    yield: '19.8%',
    term: '24 мес',
    funded: 100,
    image: 'https://picsum.photos/seed/warehouse/1200/800',
    status: 'Сбор закрыт',
    shortDescription: 'Склад с якорным арендатором и подтвержденным денежным потоком.',
    riskLevel: 'Низкий',
  },
  {
    id: '3',
    slug: '3',
    title: 'Сеть стрит-ритейла',
    category: 'Редевелопмент',
    location: 'Санкт-Петербург',
    minInvestment: '100 000 ₽',
    yield: '26.0%',
    term: '12 мес',
    funded: 45,
    image: 'https://picsum.photos/seed/street/1200/800',
    status: 'Сбор средств',
    shortDescription: 'Реконцепция помещений под арендаторов ежедневного спроса.',
    riskLevel: 'Повышенный',
  },
  {
    id: '4',
    slug: '4',
    title: 'Сеть кофеен "Утро"',
    category: 'Готовый бизнес',
    location: 'Москва',
    minInvestment: '150 000 ₽',
    yield: '30.0%',
    term: '18 мес',
    funded: 12,
    image: 'https://picsum.photos/seed/coffee/1200/800',
    status: 'Сбор средств',
    shortDescription: 'Пакет действующих точек с операционной моделью и отчетностью.',
    riskLevel: 'Повышенный',
  },
  {
    id: '5',
    slug: '5',
    title: 'Медицинская клиника',
    category: 'Готовый бизнес',
    location: 'Казань',
    minInvestment: '500 000 ₽',
    yield: '24.0%',
    term: '48 мес',
    funded: 60,
    image: 'https://picsum.photos/seed/clinic/1200/800',
    status: 'Сбор средств',
    shortDescription: 'Клиника с действующей лицензией и стабильной базой пациентов.',
    riskLevel: 'Умеренный',
  },
  {
    id: '6',
    slug: '6',
    title: 'IT-компания (SaaS)',
    category: 'Доли предприятий',
    location: 'Иннополис',
    minInvestment: '1 000 000 ₽',
    yield: '45.0%',
    term: '60 мес',
    funded: 90,
    image: 'https://picsum.photos/seed/it/1200/800',
    status: 'Сбор средств',
    shortDescription: 'Долевое участие в продуктовой компании с подтвержденной выручкой.',
    riskLevel: 'Высокий',
  },
];

export const projectCategories = [
  'Все',
  'Арендный бизнес',
  'Готовый бизнес',
  'Редевелопмент',
  'Доли предприятий',
  'Логистика',
];

export function getProjectById(id: string) {
  return projects.find((project) => project.id === id);
}

function mapLegacyCategory(category: string) {
  if (category === 'Логистика') {
    return 'logistics';
  }

  return 'commercial_real_estate';
}

function mapLegacyProject(project: Project): PublicProject {
  const minInvestment = Number(project.minInvestment.replace(/[^\d]/g, '')) || 0;
  const targetYield = Number(project.yield.replace('%', '').replace(',', '.')) || 0;
  const termMonths = Number(project.term.replace(/[^\d]/g, '')) || 0;

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    excerpt: project.shortDescription,
    description: project.shortDescription,
    thesis: null,
    riskSummary: null,
    location: project.location,
    assetType: mapLegacyCategory(project.category),
    status: 'published',
    fundingStatus: project.funded === 100 ? 'closed' : 'collecting',
    riskLevel: project.riskLevel,
    payoutFrequency: 'monthly',
    minInvestment,
    targetAmount: 1000000,
    currentAmount: Math.round((project.funded / 100) * 1000000),
    targetYield,
    termMonths,
    coverImageUrl: project.image,
    heroMetric: project.category,
    isFeatured: true,
    publishedAt: null,
    fundingProgress: project.funded,
    documents: [],
  };
}

export function getFallbackProjects({
  search,
  filter,
}: {
  search: string;
  filter: string;
}) {
  return projects
    .filter((project) => {
      const matchesSearch =
        search.trim().length === 0 ||
        project.title.toLowerCase().includes(search.trim().toLowerCase());

      const matchesFilter = filter === 'Все' || mapLegacyCategory(project.category) === filter;

      return matchesSearch && matchesFilter;
    })
    .map(mapLegacyProject);
}

export function getFallbackProjectBySlug(slug: string) {
  const project = projects.find((item) => item.slug === slug || item.id === slug);

  return project ? mapLegacyProject(project) : null;
}
