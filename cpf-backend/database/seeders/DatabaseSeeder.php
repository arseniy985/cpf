<?php

namespace Database\Seeders;

use App\Models\User;
use App\Modules\Catalog\Domain\Models\Project;
use App\Modules\Catalog\Domain\Models\ProjectDocument;
use App\Modules\Catalog\Domain\Models\ProjectFaqItem;
use App\Modules\Compliance\Domain\Models\KycDocument;
use App\Modules\Content\Domain\Models\BlogCategory;
use App\Modules\Content\Domain\Models\BlogPost;
use App\Modules\Content\Domain\Models\CaseStudy;
use App\Modules\Content\Domain\Models\FaqItem;
use App\Modules\Content\Domain\Models\LegalDocument;
use App\Modules\Content\Domain\Models\Review;
use App\Modules\Content\Domain\Models\StaticPage;
use App\Modules\CRM\Domain\Models\ContactLead;
use App\Modules\Engagement\Domain\Models\Notification;
use App\Modules\Identity\Domain\Models\KycProfile;
use App\Modules\Investing\Domain\Models\InvestmentApplication;
use App\Modules\Origination\Domain\Models\ProjectReport;
use App\Modules\Origination\Domain\Models\ProjectSubmission;
use App\Modules\Payments\Domain\Models\PaymentTransaction;
use App\Modules\Payments\Domain\Models\WalletTransaction;
use App\Modules\Payments\Domain\Models\WithdrawalRequest;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        foreach (['admin', 'manager', 'compliance', 'content_manager', 'investor', 'project_owner', 'accountant', 'partner'] as $role) {
            Role::findOrCreate($role);
        }

        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@cpf.local'],
            [
                'name' => 'CPF Admin',
                'phone' => '+7 999 000 00 01',
                'password' => 'password',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
        );
        $admin->syncRoles(['admin']);

        $investor = User::query()->updateOrCreate(
            ['email' => 'investor@cpf.local'],
            [
                'name' => 'Investor Demo',
                'phone' => '+7 999 000 00 02',
                'password' => 'password',
                'is_active' => true,
                'email_verified_at' => now(),
                'notification_preferences' => [
                    'email' => true,
                    'sms' => false,
                    'marketing' => false,
                ],
            ],
        );
        $investor->syncRoles(['investor']);

        $projectOwner = User::query()->updateOrCreate(
            ['email' => 'owner@cpf.local'],
            [
                'name' => 'Owner Demo',
                'phone' => '+7 999 000 00 05',
                'password' => 'password',
                'is_active' => true,
                'email_verified_at' => now(),
            ],
        );
        $projectOwner->syncRoles(['project_owner']);

        $project1 = Project::query()->updateOrCreate(
            ['slug' => 'galleria-moscow'],
            [
                'owner_id' => $projectOwner->id,
                'title' => 'Торговый центр "Галерея"',
                'excerpt' => 'Действующий арендный объект в Москве с ежемесячным денежным потоком.',
                'description' => 'Объект с устойчивым арендным потоком, якорными арендаторами и прозрачной отчетностью.',
                'thesis' => 'Понятная арендная модель, ежемесячные выплаты, низкий порог входа.',
                'risk_summary' => 'Основной риск связан с ротацией арендаторов и рынком коммерческой недвижимости.',
                'location' => 'Москва, ЦАО',
                'asset_type' => 'commercial_real_estate',
                'status' => 'published',
                'funding_status' => 'collecting',
                'risk_level' => 'moderate',
                'payout_frequency' => 'monthly',
                'min_investment' => 10000,
                'target_amount' => 30000000,
                'current_amount' => 16200000,
                'target_yield' => 18.5,
                'term_months' => 24,
                'cover_image_url' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
                'hero_metric' => '18.5% годовых',
                'is_featured' => true,
                'published_at' => now()->subDays(5),
            ],
        );

        $project2 = Project::query()->updateOrCreate(
            ['slug' => 'warehouse-a-plus'],
            [
                'owner_id' => $projectOwner->id,
                'title' => 'Складской комплекс A+',
                'excerpt' => 'Логистический актив с долгосрочным договором аренды.',
                'description' => 'Складской объект с подтвержденным спросом и прогнозируемым денежным потоком.',
                'thesis' => 'Защищенная экономика проекта и понятная стратегия выхода.',
                'risk_summary' => 'Основной риск связан с рынком аренды складских площадей.',
                'location' => 'Московская область',
                'asset_type' => 'commercial_real_estate',
                'status' => 'published',
                'funding_status' => 'collecting',
                'risk_level' => 'low',
                'payout_frequency' => 'monthly',
                'min_investment' => 50000,
                'target_amount' => 45000000,
                'current_amount' => 22100000,
                'target_yield' => 16.2,
                'term_months' => 18,
                'cover_image_url' => 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80',
                'hero_metric' => '16.2% годовых',
                'is_featured' => true,
                'published_at' => now()->subDays(2),
            ],
        );

        foreach ([$project1, $project2] as $project) {
            ProjectDocument::query()->updateOrCreate(
                ['project_id' => $project->id, 'title' => 'Инвестиционный меморандум'],
                [
                    'kind' => 'memorandum',
                    'label' => 'PDF',
                    'file_url' => 'https://example.com/docs/memorandum.pdf',
                    'is_public' => true,
                    'sort_order' => 1,
                ],
            );

            ProjectDocument::query()->updateOrCreate(
                ['project_id' => $project->id, 'title' => 'Юридическое заключение'],
                [
                    'kind' => 'legal-opinion',
                    'label' => 'PDF',
                    'file_url' => 'https://example.com/docs/legal-opinion.pdf',
                    'is_public' => true,
                    'sort_order' => 2,
                ],
            );

            ProjectFaqItem::query()->updateOrCreate(
                ['project_id' => $project->id, 'question' => 'Как устроены выплаты по проекту?'],
                [
                    'answer' => 'Выплаты происходят согласно графику проекта и отображаются в кабинете.',
                    'sort_order' => 1,
                    'is_published' => true,
                ],
            );

            ProjectReport::query()->updateOrCreate(
                ['project_id' => $project->id, 'title' => 'Ежемесячный отчет'],
                [
                    'summary' => 'Стабильная загрузка площадей и выполнение плана по аренде.',
                    'file_url' => 'https://example.com/reports/monthly-report.pdf',
                    'report_date' => now()->subMonth()->toDateString(),
                    'is_public' => true,
                ],
            );
        }

        InvestmentApplication::query()->updateOrCreate(
            ['user_id' => $investor->id, 'project_id' => $project1->id],
            [
                'amount' => 150000,
                'status' => 'approved',
                'agreement_url' => 'https://example.com/agreements/galleria-moscow.pdf',
                'notes' => 'Повторный инвестор.',
            ],
        );

        InvestmentApplication::query()->updateOrCreate(
            ['user_id' => $investor->id, 'project_id' => $project2->id],
            [
                'amount' => 50000,
                'status' => 'pending',
                'notes' => 'Ожидает пополнения.',
            ],
        );

        ContactLead::query()->updateOrCreate(
            ['email' => 'lead@cpf.local'],
            [
                'full_name' => 'Анна Потенциальная',
                'phone' => '+7 999 000 00 03',
                'subject' => 'Консультация по инвестированию',
                'source' => 'landing',
                'message' => 'Хочу понять, как устроены выплаты.',
                'status' => 'new',
            ],
        );

        ProjectSubmission::query()->updateOrCreate(
            ['email' => 'submission-owner@cpf.local'],
            [
                'full_name' => 'Игорь Собственник',
                'phone' => '+7 999 000 00 04',
                'company_name' => 'ООО Актив',
                'project_name' => 'Торговая галерея Юг',
                'asset_type' => 'commercial_real_estate',
                'target_amount' => 55000000,
                'message' => 'Ищем капитал под выкуп объекта и обновление арендаторов.',
                'status' => 'new',
            ],
        );

        PaymentTransaction::query()->updateOrCreate(
            ['external_id' => 'demo-yookassa-payment'],
            [
                'user_id' => $investor->id,
                'gateway' => 'yookassa',
                'type' => 'deposit',
                'status' => 'paid',
                'amount' => 500000,
                'currency' => 'RUB',
                'idempotency_key' => 'seed-demo-yookassa-payment',
                'confirmation_url' => 'https://yookassa.ru/demo-confirmation',
                'payload' => ['demo' => true],
                'processed_at' => now()->subDay(),
                'synced_at' => now()->subDay(),
            ],
        );

        WalletTransaction::query()->updateOrCreate(
            [
                'user_id' => $investor->id,
                'type' => 'deposit',
                'reference_type' => PaymentTransaction::class,
                'reference_id' => PaymentTransaction::query()->where('external_id', 'demo-yookassa-payment')->value('id'),
            ],
            [
                'direction' => 'credit',
                'status' => 'posted',
                'amount' => 500000,
                'currency' => 'RUB',
                'description' => 'Пополнение баланса через YooKassa',
                'occurred_at' => now()->subDay(),
            ],
        );

        WithdrawalRequest::query()->updateOrCreate(
            ['user_id' => $investor->id, 'bank_account' => '40817810000000000001'],
            [
                'amount' => 30000,
                'status' => 'pending_review',
                'bank_name' => 'Т-Банк',
                'comment' => 'Тестовая заявка на вывод.',
                'idempotency_key' => 'seed-withdrawal-request',
            ],
        );

        KycProfile::query()->updateOrCreate(
            ['user_id' => $investor->id],
            [
                'status' => 'approved',
                'legal_name' => 'Investor Demo',
                'birth_date' => '1990-05-20',
                'tax_id' => '770123456789',
                'document_number' => '4510 123456',
                'address' => 'Москва, ул. Примерная, 1',
                'submitted_at' => now()->subDays(10),
                'reviewed_at' => now()->subDays(8),
                'reviewed_by' => $admin->id,
            ],
        );

        KycProfile::query()->updateOrCreate(
            ['user_id' => $projectOwner->id],
            [
                'status' => 'pending_review',
                'legal_name' => 'ООО Актив',
                'tax_id' => '770987654321',
                'document_number' => '7700 555555',
                'address' => 'Москва, ул. Бизнес, 12',
                'submitted_at' => now()->subDays(2),
            ],
        );

        $investorKycProfile = KycProfile::query()->where('user_id', $investor->id)->firstOrFail();

        Storage::disk('private')->put('kyc-documents/demo/passport.pdf', 'demo passport file');

        KycDocument::query()->updateOrCreate(
            ['kyc_profile_id' => $investorKycProfile->id, 'kind' => 'passport'],
            [
                'status' => 'approved',
                'original_name' => 'passport.pdf',
                'disk' => 'private',
                'path' => 'kyc-documents/demo/passport.pdf',
                'mime_type' => 'application/pdf',
                'size' => 123456,
                'reviewed_at' => now()->subDays(8),
                'reviewed_by' => $admin->id,
            ],
        );

        foreach ([
            [
                'user_id' => $investor->id,
                'type' => 'investment',
                'title' => 'Заявка подтверждена',
                'body' => 'Ваше участие в проекте "Торговый центр Галерея" подтверждено.',
                'action_url' => '/dashboard',
            ],
            [
                'user_id' => $projectOwner->id,
                'type' => 'owner_project',
                'title' => 'Проект ожидает модерации',
                'body' => 'Заявка по проекту передана менеджеру платформы.',
                'action_url' => '/owner/projects',
            ],
        ] as $notification) {
            Notification::query()->updateOrCreate(
                ['user_id' => $notification['user_id'], 'title' => $notification['title']],
                $notification,
            );
        }

        foreach ([
            ['Инвестиции', 'Как вывести деньги?', 'Вывод оформляется через кабинет после обработки заявки.'],
            ['Инвестиции', 'Что если арендаторы уйдут?', 'Платформа раскрывает риск-профиль и план действий по проекту.'],
            ['Сделки', 'Как мы отбираем проекты?', 'Каждый проект проходит внутреннюю проверку и финансовую упаковку.'],
        ] as [$group, $question, $answer]) {
            FaqItem::query()->updateOrCreate(
                ['question' => $question],
                [
                    'group_name' => $group,
                    'answer' => $answer,
                    'sort_order' => 1,
                    'is_published' => true,
                ],
            );
        }

        foreach ([
            ['slug' => 'participation-agreement', 'title' => 'Договор участия', 'type' => 'agreement'],
            ['slug' => 'risk-disclosure', 'title' => 'Раскрытие рисков', 'type' => 'risk'],
        ] as $document) {
            LegalDocument::query()->updateOrCreate(
                ['slug' => $document['slug']],
                [
                    'title' => $document['title'],
                    'summary' => 'Публичный юридический документ платформы.',
                    'document_type' => $document['type'],
                    'file_url' => 'https://example.com/docs/'.$document['slug'].'.pdf',
                    'status' => 'published',
                    'published_at' => now()->subDay(),
                ],
            );
        }

        foreach ([
            [
                'key' => 'about',
                'title' => 'О платформе ЦПФ',
                'headline' => 'Структурируем сделки вокруг проверенных активов',
                'summary' => 'Платформа помогает инвесторам и владельцам активов пройти путь сделки без хаоса.',
                'body' => 'ЦПФ объединяет каталог проверенных проектов, сопровождение сделки, документы и отчетность.',
            ],
            [
                'key' => 'how',
                'title' => 'Как это работает',
                'headline' => 'От выбора проекта до выплат',
                'summary' => 'Инвестор регистрируется, проходит KYC, пополняет баланс и подтверждает участие.',
                'body' => 'Инициатор подает проект, проходит модерацию и публикует отчетность в личном кабинете.',
            ],
            [
                'key' => 'contacts',
                'title' => 'Контакты',
                'headline' => 'Свяжитесь с командой платформы',
                'summary' => 'Работаем с инвесторами, инициаторами проектов и партнерами.',
                'body' => 'Москва, Пресненская набережная, 12. support@cpf.local. +7 999 000 00 10.',
            ],
        ] as $page) {
            StaticPage::query()->updateOrCreate(['key' => $page['key']], $page + ['is_published' => true]);
        }

        Review::query()->updateOrCreate(
            ['author_name' => 'Мария Инвестор'],
            [
                'author_role' => 'Частный инвестор',
                'company_name' => null,
                'rating' => 5,
                'body' => 'Понравилась прозрачность проекта и работа кабинета после входа в сделку.',
                'sort_order' => 1,
                'is_published' => true,
            ],
        );

        CaseStudy::query()->updateOrCreate(
            ['slug' => 'galleria-case'],
            [
                'title' => 'Кейс: торговая галерея в Москве',
                'excerpt' => 'Как платформа упаковала арендный актив и закрыла первый раунд.',
                'body' => 'Команда провела due diligence, подготовила материалы и вывела проект на сбор.',
                'result_metric' => '16.2 млн ₽ привлечено',
                'is_published' => true,
                'published_at' => now()->subDays(3),
            ],
        );

        $blogCategory = BlogCategory::query()->updateOrCreate(
            ['slug' => 'market'],
            ['name' => 'Рынок недвижимости'],
        );

        BlogPost::query()->updateOrCreate(
            ['slug' => 'warehouse-demand-2026'],
            [
                'category_id' => $blogCategory->id,
                'title' => 'Почему складские объекты остаются устойчивым сегментом',
                'excerpt' => 'Краткий разбор спроса на логистические активы и их инвестиционной модели.',
                'body' => 'Складская недвижимость сохраняет спрос за счет электронной коммерции и устойчивых арендаторов.',
                'tags' => ['склады', 'логистика', 'доходность'],
                'is_published' => true,
                'published_at' => now()->subDay(),
            ],
        );
    }
}
