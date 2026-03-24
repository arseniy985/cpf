<?php

namespace App\Filament\Support;

use App\Filament\Pages\OperationsQueue;
use App\Filament\Resources\ContactLeads\ContactLeadResource;
use App\Filament\Resources\FaqItems\FaqItemResource;
use App\Filament\Resources\InvestmentApplications\InvestmentApplicationResource;
use App\Filament\Resources\KycDocuments\KycDocumentResource;
use App\Filament\Resources\KycProfiles\KycProfileResource;
use App\Filament\Resources\ManualDepositRequests\ManualDepositRequestResource;
use App\Filament\Resources\OfferingRounds\OfferingRoundResource;
use App\Filament\Resources\OwnerOnboardings\OwnerOnboardingResource;
use App\Filament\Resources\PaymentTransactions\PaymentTransactionResource;
use App\Filament\Resources\Projects\ProjectResource;
use App\Filament\Resources\StaticPages\StaticPageResource;
use App\Filament\Resources\Users\UserResource;
use App\Filament\Resources\WithdrawalRequests\WithdrawalRequestResource;
use App\Modules\Compliance\Domain\Models\KycDocument;
use App\Modules\Identity\Domain\Models\KycProfile;
use App\Modules\Investing\Domain\Models\InvestmentApplication;
use App\Modules\Origination\Domain\Models\OfferingRound;
use App\Modules\Origination\Domain\Models\OwnerOnboarding;
use App\Modules\Payments\Domain\Models\ManualDepositRequest;
use App\Modules\Payments\Domain\Models\PaymentTransaction;
use App\Modules\Payments\Domain\Models\WithdrawalRequest;

class ManagerWorkspaceData
{
    public static function build(): array
    {
        $cutoff = now()->subDay();

        $sections = [
            [
                'title' => 'Заявки и проверки',
                'icon' => 'checks',
                'description' => 'Очереди, где менеджеру нужно принять решение по инвесторам и компаниям.',
                'items' => [
                    self::queue(
                        label: 'Анкеты инвесторов',
                        icon: 'profile',
                        description: 'Новые анкеты инвесторов, которые ждут проверки и решения.',
                        count: KycProfile::query()->where('status', 'pending_review')->count(),
                        overdue: KycProfile::query()
                            ->where('status', 'pending_review')
                            ->where(fn ($query) => $query
                                ->where('submitted_at', '<=', $cutoff)
                                ->orWhere(fn ($subQuery) => $subQuery->whereNull('submitted_at')->where('created_at', '<=', $cutoff)))
                            ->count(),
                        url: KycProfileResource::getUrl('index'),
                        action: 'Открыть анкеты',
                    ),
                    self::queue(
                        label: 'Документы инвесторов',
                        icon: 'document',
                        description: 'Паспорта и другие документы, которые ждут подтверждения.',
                        count: KycDocument::query()->where('status', 'pending_review')->count(),
                        overdue: KycDocument::query()->where('status', 'pending_review')->where('created_at', '<=', $cutoff)->count(),
                        url: KycDocumentResource::getUrl('index'),
                        action: 'Открыть документы',
                    ),
                    self::queue(
                        label: 'Проверка компаний',
                        icon: 'shield',
                        description: 'Компании владельцев, которые ждут KYB-проверки и активации.',
                        count: OwnerOnboarding::query()->where('status', 'kyb_under_review')->count(),
                        overdue: OwnerOnboarding::query()
                            ->where('status', 'kyb_under_review')
                            ->where(fn ($query) => $query
                                ->where('submitted_at', '<=', $cutoff)
                                ->orWhere(fn ($subQuery) => $subQuery->whereNull('submitted_at')->where('updated_at', '<=', $cutoff)))
                            ->count(),
                        url: OwnerOnboardingResource::getUrl('index'),
                        action: 'Открыть проверки',
                    ),
                    self::queue(
                        label: 'Заявки инвесторов',
                        icon: 'briefcase',
                        description: 'Новые инвестиционные заявки по проектам и раундам.',
                        count: InvestmentApplication::query()->where('status', 'pending')->count(),
                        overdue: InvestmentApplication::query()->where('status', 'pending')->where('created_at', '<=', $cutoff)->count(),
                        url: InvestmentApplicationResource::getUrl('index'),
                        action: 'Открыть заявки',
                    ),
                ],
            ],
            [
                'title' => 'Платежи',
                'icon' => 'payments',
                'description' => 'Очереди, связанные с ручными пополнениями, выводами и синхронизацией операций.',
                'items' => [
                    self::queue(
                        label: 'Пополнения вручную',
                        icon: 'deposit',
                        description: 'Заявки, которые нужно проверить, подтвердить или зачислить.',
                        count: ManualDepositRequest::query()->whereIn('status', ['under_review', 'approved'])->count(),
                        overdue: ManualDepositRequest::query()
                            ->whereIn('status', ['under_review', 'approved'])
                            ->where('created_at', '<=', $cutoff)
                            ->count(),
                        url: ManualDepositRequestResource::getUrl('index'),
                        action: 'Открыть пополнения',
                    ),
                    self::queue(
                        label: 'Заявки на вывод',
                        icon: 'withdrawal',
                        description: 'Выводы, которые ждут одобрения или подтверждения выплаты.',
                        count: WithdrawalRequest::query()->whereIn('status', ['pending_review', 'approved'])->count(),
                        overdue: WithdrawalRequest::query()
                            ->whereIn('status', ['pending_review', 'approved'])
                            ->where('created_at', '<=', $cutoff)
                            ->count(),
                        url: WithdrawalRequestResource::getUrl('index'),
                        action: 'Открыть выводы',
                    ),
                    self::queue(
                        label: 'Платёжные операции',
                        icon: 'card',
                        description: 'Онлайн-платежи, которые нужно сверить или синхронизировать.',
                        count: PaymentTransaction::query()->whereIn('status', ['pending', 'waiting_for_capture'])->count(),
                        overdue: PaymentTransaction::query()
                            ->whereIn('status', ['pending', 'waiting_for_capture'])
                            ->where('created_at', '<=', $cutoff)
                            ->count(),
                        url: PaymentTransactionResource::getUrl('index'),
                        action: 'Открыть операции',
                    ),
                ],
            ],
            [
                'title' => 'Сделки и проекты',
                'icon' => 'projects',
                'description' => 'Очереди модерации проектов и раундов, влияющие на витрину и сделки.',
                'items' => [
                    self::queue(
                        label: 'Раунды размещения',
                        icon: 'round',
                        description: 'Раунды, которые ждут публикации или возврата на доработку.',
                        count: OfferingRound::query()->where('status', 'pending_review')->count(),
                        overdue: OfferingRound::query()
                            ->where('status', 'pending_review')
                            ->where(fn ($query) => $query
                                ->where('review_submitted_at', '<=', $cutoff)
                                ->orWhere(fn ($subQuery) => $subQuery->whereNull('review_submitted_at')->where('updated_at', '<=', $cutoff)))
                            ->count(),
                        url: OfferingRoundResource::getUrl('index'),
                        action: 'Открыть раунды',
                    ),
                ],
            ],
        ];

        $allQueues = collect($sections)
            ->flatMap(fn (array $section): array => $section['items'])
            ->values();

        $awaitingCustomer = ManualDepositRequest::query()
            ->where('status', 'awaiting_user_clarification')
            ->count();

        return [
            'summary' => [
                [
                    'label' => 'Требует решения',
                    'icon' => 'inbox',
                    'value' => $allQueues->sum('count'),
                    'description' => 'Все очереди, где менеджеру нужно действие прямо сейчас.',
                    'tone' => 'slate',
                ],
                [
                    'label' => 'Просрочено > 24 часов',
                    'icon' => 'warning',
                    'value' => $allQueues->sum('overdue'),
                    'description' => 'Задачи, которые уже висят дольше рабочего дня.',
                    'tone' => $allQueues->sum('overdue') > 0 ? 'rose' : 'emerald',
                ],
                [
                    'label' => 'Ждут ответа пользователя',
                    'icon' => 'message',
                    'value' => $awaitingCustomer,
                    'description' => 'Пополнения, где менеджер уже запросил уточнение.',
                    'tone' => 'amber',
                ],
                [
                    'label' => 'Открыть все входящие',
                    'icon' => 'arrow',
                    'value' => 'Перейти',
                    'description' => 'Единая страница со всеми очередями и прямыми переходами.',
                    'tone' => 'blue',
                    'url' => OperationsQueue::getUrl(),
                ],
            ],
            'sections' => $sections,
            'quickLinks' => [
                ['label' => 'Проекты', 'icon' => 'projects', 'description' => 'Каталог проектов и их статусы.', 'url' => ProjectResource::getUrl('index')],
                ['label' => 'Страницы сайта', 'icon' => 'globe', 'description' => 'Основные CMS-страницы и публикации.', 'url' => StaticPageResource::getUrl('index')],
                ['label' => 'FAQ сайта', 'icon' => 'faq', 'description' => 'Ответы на частые вопросы на витрине.', 'url' => FaqItemResource::getUrl('index')],
                ['label' => 'Лиды', 'icon' => 'leads', 'description' => 'Новые обращения и контакты инвесторов.', 'url' => ContactLeadResource::getUrl('index')],
                ['label' => 'Пользователи', 'icon' => 'users', 'description' => 'Управление доступом и ролями.', 'url' => UserResource::getUrl('index')],
            ],
        ];
    }

    public static function pendingTaskCount(): int
    {
        return collect(static::build()['sections'])
            ->flatMap(fn (array $section): array => $section['items'])
            ->sum('count');
    }

    public static function overdueTaskCount(): int
    {
        return collect(static::build()['sections'])
            ->flatMap(fn (array $section): array => $section['items'])
            ->sum('overdue');
    }

    /**
     * @return array<string, int|string|null>
     */
    private static function queue(
        string $label,
        string $icon,
        string $description,
        int $count,
        int $overdue,
        string $url,
        string $action,
    ): array {
        return [
            'label' => $label,
            'icon' => $icon,
            'description' => $description,
            'count' => $count,
            'overdue' => $overdue,
            'url' => $url,
            'action' => $action,
        ];
    }
}
