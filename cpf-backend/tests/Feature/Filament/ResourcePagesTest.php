<?php

namespace Tests\Feature\Filament;

use App\Filament\Resources\BlogCategories\Pages\ManageBlogCategories;
use App\Filament\Resources\BlogPosts\Pages\ManageBlogPosts;
use App\Filament\Resources\CaseStudies\Pages\ManageCaseStudies;
use App\Filament\Resources\ContactLeads\Pages\ManageContactLeads;
use App\Filament\Resources\FaqItems\Pages\ManageFaqItems;
use App\Filament\Resources\InvestmentApplications\Pages\ManageInvestmentApplications;
use App\Filament\Resources\KycDocuments\Pages\ManageKycDocuments;
use App\Filament\Resources\KycProfiles\Pages\ManageKycProfiles;
use App\Filament\Resources\LegalDocuments\Pages\ManageLegalDocuments;
use App\Filament\Resources\Notifications\Pages\ManageNotifications;
use App\Filament\Resources\PaymentTransactions\Pages\ManagePaymentTransactions;
use App\Filament\Resources\ProjectDocuments\Pages\ManageProjectDocuments;
use App\Filament\Resources\ProjectFaqItems\Pages\ManageProjectFaqItems;
use App\Filament\Resources\ProjectReports\Pages\ManageProjectReports;
use App\Filament\Resources\Projects\Pages\ManageProjects;
use App\Filament\Resources\ProjectSubmissions\Pages\ManageProjectSubmissions;
use App\Filament\Resources\Reviews\Pages\ManageReviews;
use App\Filament\Resources\StaticPages\Pages\ManageStaticPages;
use App\Filament\Resources\Users\Pages\ManageUsers;
use App\Filament\Resources\WithdrawalRequests\Pages\ManageWithdrawalRequests;
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
use App\Modules\Payments\Domain\Models\WithdrawalRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\Concerns\InteractsWithAdminPanel;
use Tests\TestCase;

class ResourcePagesTest extends TestCase
{
    use InteractsWithAdminPanel;
    use RefreshDatabase;

    protected bool $seed = true;

    public function test_admin_can_load_all_core_resource_pages(): void
    {
        $this->actingAsAdmin();

        Livewire::test(ManageUsers::class)
            ->assertOk()
            ->assertCanSeeTableRecords(User::query()->get());

        Livewire::test(ManageProjects::class)
            ->assertOk()
            ->assertCanSeeTableRecords(Project::query()->get());

        Livewire::test(ManageProjectDocuments::class)
            ->assertOk()
            ->assertCanSeeTableRecords(ProjectDocument::query()->get());

        Livewire::test(ManageProjectFaqItems::class)
            ->assertOk()
            ->assertCanSeeTableRecords(ProjectFaqItem::query()->get());

        Livewire::test(ManageProjectReports::class)
            ->assertOk()
            ->assertCanSeeTableRecords(ProjectReport::query()->get());

        Livewire::test(ManageContactLeads::class)
            ->assertOk()
            ->assertCanSeeTableRecords(ContactLead::query()->get());

        Livewire::test(ManageProjectSubmissions::class)
            ->assertOk()
            ->assertCanSeeTableRecords(ProjectSubmission::query()->get());

        Livewire::test(ManageInvestmentApplications::class)
            ->assertOk()
            ->assertCanSeeTableRecords(InvestmentApplication::query()->get());

        Livewire::test(ManageFaqItems::class)
            ->assertOk()
            ->assertCanSeeTableRecords(FaqItem::query()->get());

        Livewire::test(ManageLegalDocuments::class)
            ->assertOk()
            ->assertCanSeeTableRecords(LegalDocument::query()->get());

        Livewire::test(ManageKycProfiles::class)
            ->assertOk()
            ->assertCanSeeTableRecords(KycProfile::query()->get());

        Livewire::test(ManageKycDocuments::class)
            ->assertOk()
            ->assertCanSeeTableRecords(KycDocument::query()->get());

        Livewire::test(ManageNotifications::class)
            ->assertOk()
            ->assertCanSeeTableRecords(Notification::query()->get());

        Livewire::test(ManagePaymentTransactions::class)
            ->assertOk()
            ->assertCanSeeTableRecords(PaymentTransaction::query()->get());

        Livewire::test(ManageWithdrawalRequests::class)
            ->assertOk()
            ->assertCanSeeTableRecords(WithdrawalRequest::query()->get());

        Livewire::test(ManageStaticPages::class)
            ->assertOk()
            ->assertCanSeeTableRecords(StaticPage::query()->get());

        Livewire::test(ManageReviews::class)
            ->assertOk()
            ->assertCanSeeTableRecords(Review::query()->get());

        Livewire::test(ManageCaseStudies::class)
            ->assertOk()
            ->assertCanSeeTableRecords(CaseStudy::query()->get());

        Livewire::test(ManageBlogCategories::class)
            ->assertOk()
            ->assertCanSeeTableRecords(BlogCategory::query()->get());

        Livewire::test(ManageBlogPosts::class)
            ->assertOk()
            ->assertCanSeeTableRecords(BlogPost::query()->get());
    }
}
