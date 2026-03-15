<?php

use App\Modules\Catalog\Http\Controllers\PublicProjectController;
use App\Modules\Compliance\Http\Controllers\KycDocumentController;
use App\Modules\Content\Http\Controllers\PublicContentController;
use App\Modules\CRM\Http\Controllers\ContactLeadController;
use App\Modules\Engagement\Http\Controllers\NotificationController;
use App\Modules\Identity\Http\Controllers\AuthController;
use App\Modules\Identity\Http\Controllers\KycProfileController;
use App\Modules\Identity\Http\Controllers\ProfileController;
use App\Modules\Investing\Http\Controllers\CabinetDocumentController;
use App\Modules\Investing\Http\Controllers\InvestmentApplicationController;
use App\Modules\Investing\Http\Controllers\InvestorDashboardController;
use App\Modules\Origination\Http\Controllers\OwnerProjectController;
use App\Modules\Origination\Http\Controllers\OwnerProjectDocumentController;
use App\Modules\Origination\Http\Controllers\OwnerProjectReportController;
use App\Modules\Origination\Http\Controllers\OwnerAccountController;
use App\Modules\Origination\Http\Controllers\OwnerBankProfileController;
use App\Modules\Origination\Http\Controllers\OwnerOnboardingController;
use App\Modules\Origination\Http\Controllers\OwnerOrganizationController;
use App\Modules\Origination\Http\Controllers\OwnerRoundController;
use App\Modules\Origination\Http\Controllers\OwnerWorkspaceController;
use App\Modules\Origination\Http\Controllers\ProjectSubmissionController;
use App\Modules\Payments\Http\Controllers\OwnerDistributionController;
use App\Modules\Payments\Http\Controllers\CreateDepositController;
use App\Modules\Payments\Http\Controllers\InvestorPayoutProfileController;
use App\Modules\Payments\Http\Controllers\PaymentTransactionController;
use App\Modules\Payments\Http\Controllers\PaymentWebhookController;
use App\Modules\Payments\Http\Controllers\WalletTransactionController;
use App\Modules\Payments\Http\Controllers\WithdrawalRequestController;
use Illuminate\Support\Facades\Route;

    Route::prefix('v1')->group(function (): void {
        Route::prefix('auth')->group(function (): void {
        Route::post('register', [AuthController::class, 'register'])
            ->middleware('throttle:auth.email-code.issue');
        Route::post('login', [AuthController::class, 'login'])
            ->middleware('throttle:auth.login');
        Route::post('request-email-code', [AuthController::class, 'requestEmailCode'])
            ->middleware('throttle:auth.email-code.issue');
        Route::post('verify-email-code', [AuthController::class, 'verifyEmailCode'])
            ->middleware('throttle:auth.email-code.verify');
        Route::post('password/forgot', [AuthController::class, 'forgotPassword'])
            ->middleware('throttle:auth.password-reset');
        Route::post('password/reset', [AuthController::class, 'resetPassword'])
            ->middleware('throttle:auth.email-code.verify');
    });

    Route::get('home', [PublicContentController::class, 'home']);
    Route::prefix('public')->group(function (): void {
        Route::get('home', [PublicContentController::class, 'home']);
        Route::get('about', [PublicContentController::class, 'about']);
        Route::get('how-it-works', [PublicContentController::class, 'how']);
        Route::get('contacts', [PublicContentController::class, 'contacts']);
    });
    Route::get('faq', [PublicContentController::class, 'faqs']);
    Route::get('legal-documents', [PublicContentController::class, 'legalDocuments']);
    Route::get('documents', [PublicContentController::class, 'legalDocuments']);
    Route::get('reviews', [PublicContentController::class, 'reviews']);
    Route::get('case-studies', [PublicContentController::class, 'caseStudies']);
    Route::get('blog/categories', [PublicContentController::class, 'blogCategories']);
    Route::get('blog/posts', [PublicContentController::class, 'blogPosts']);
    Route::get('blog/posts/{slug}', [PublicContentController::class, 'blogPost']);
    Route::get('projects', [PublicProjectController::class, 'index']);
    Route::get('projects/{projectSlug}', [PublicProjectController::class, 'show']);
    Route::get('projects/{projectSlug}/documents', [PublicProjectController::class, 'documents']);
    Route::get('projects/{projectSlug}/faq', [PublicProjectController::class, 'faq']);
    Route::get('projects/{projectSlug}/payout-forecast', [PublicProjectController::class, 'payoutForecast']);
    Route::post('calculator/estimate', [PublicProjectController::class, 'calculate']);
    Route::post('contact-leads', [ContactLeadController::class, 'store']);
    Route::post('leads/contact', [ContactLeadController::class, 'store']);
    Route::post('leads/consultation', [ContactLeadController::class, 'store']);
    Route::post('leads/callback', [ContactLeadController::class, 'store']);
    Route::post('project-submissions', [ProjectSubmissionController::class, 'store']);
    Route::post('payments/webhooks/yookassa', [PaymentWebhookController::class, 'handleYooKassa'])
        ->middleware('yookassa.webhook');

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::prefix('auth')->group(function (): void {
            Route::get('me', [AuthController::class, 'me']);
            Route::post('refresh', [AuthController::class, 'refresh']);
            Route::post('logout', [AuthController::class, 'logout']);
        });

        Route::get('me', [AuthController::class, 'me']);
        Route::patch('me', [ProfileController::class, 'update']);
        Route::post('me/kyc', [KycProfileController::class, 'store']);
        Route::get('me/kyc', [KycProfileController::class, 'show']);
        Route::get('me/payout-profile', [InvestorPayoutProfileController::class, 'show']);
        Route::patch('me/payout-profile', [InvestorPayoutProfileController::class, 'upsert'])->middleware('kyc.approved');
        Route::get('me/kyc/documents', [KycDocumentController::class, 'index']);
        Route::post('me/kyc/documents', [KycDocumentController::class, 'store']);
        Route::get('me/kyc/documents/{kycDocument}/download', [KycDocumentController::class, 'download'])->name('kyc-documents.download');

        Route::get('dashboard', [InvestorDashboardController::class, 'show']);
        Route::get('cabinet/overview', [InvestorDashboardController::class, 'show']);
        Route::get('cabinet/investments', [InvestmentApplicationController::class, 'index']);
        Route::get('cabinet/investments/{investmentApplication}', [InvestmentApplicationController::class, 'show']);
        Route::get('cabinet/transactions', [WalletTransactionController::class, 'index']);
        Route::get('cabinet/documents', [CabinetDocumentController::class, 'index']);
        Route::get('cabinet/notifications', [NotificationController::class, 'index']);
        Route::patch('cabinet/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);

        Route::get('investment-applications', [InvestmentApplicationController::class, 'index']);
        Route::post('investment-applications', [InvestmentApplicationController::class, 'store'])
            ->middleware('kyc.approved');
        Route::get('investments/{investmentApplication}', [InvestmentApplicationController::class, 'show']);
        Route::post('investments', [InvestmentApplicationController::class, 'store'])
            ->middleware('kyc.approved');
        Route::get('investments/{investmentApplication}/agreement', [InvestmentApplicationController::class, 'agreement']);
        Route::post('investments/{investmentApplication}/confirm', [InvestmentApplicationController::class, 'confirm'])
            ->middleware('kyc.approved');

        Route::get('payment-transactions', [PaymentTransactionController::class, 'index']);
        Route::get('payment-transactions/{paymentTransaction}', [PaymentTransactionController::class, 'show']);

        Route::middleware('idempotency')->group(function (): void {
            Route::post('deposits', [CreateDepositController::class, 'store'])->middleware('kyc.approved');
            Route::post('wallet/deposits', [CreateDepositController::class, 'store'])->middleware('kyc.approved');
            Route::post('wallet/withdrawals', [WithdrawalRequestController::class, 'store'])->middleware('kyc.approved');
        });

        Route::get('wallet/deposits', [PaymentTransactionController::class, 'index']);
        Route::get('wallet/deposits/{paymentTransaction}', [PaymentTransactionController::class, 'show']);
        Route::get('wallet/withdrawals', [WithdrawalRequestController::class, 'index']);
        Route::get('wallet/withdrawals/{withdrawalRequest}', [WithdrawalRequestController::class, 'show']);
        Route::post('wallet/withdrawals/{withdrawalRequest}/cancel', [WithdrawalRequestController::class, 'cancel']);
    });

    Route::middleware(['auth:sanctum', 'role.any:project_owner'])->prefix('owner')->group(function (): void {
        Route::get('workspace', [OwnerWorkspaceController::class, 'show']);
        Route::patch('account', [OwnerAccountController::class, 'update']);
        Route::patch('organization', [OwnerOrganizationController::class, 'update']);
        Route::patch('bank-profile', [OwnerBankProfileController::class, 'update']);
        Route::post('onboarding/submit', [OwnerOnboardingController::class, 'submit']);
        Route::get('rounds', [OwnerRoundController::class, 'index']);
        Route::post('rounds', [OwnerRoundController::class, 'store']);
        Route::get('rounds/{round}', [OwnerRoundController::class, 'show']);
        Route::patch('rounds/{round}', [OwnerRoundController::class, 'update']);
        Route::post('rounds/{round}/submit-review', [OwnerRoundController::class, 'submitReview']);
        Route::post('rounds/{round}/go-live', [OwnerRoundController::class, 'goLive'])->middleware('kyb.approved');
        Route::post('rounds/{round}/close', [OwnerRoundController::class, 'close'])->middleware('kyb.approved');
        Route::get('rounds/{round}/distributions', [OwnerDistributionController::class, 'index'])->middleware('kyb.approved');
        Route::post('rounds/{round}/distributions', [OwnerDistributionController::class, 'store'])->middleware('kyb.approved');
        Route::get('distributions/{distribution}', [OwnerDistributionController::class, 'show'])->middleware('kyb.approved');
        Route::post('distributions/{distribution}/approve', [OwnerDistributionController::class, 'approve'])->middleware('kyb.approved');
        Route::post('distributions/{distribution}/run-payouts', [OwnerDistributionController::class, 'runPayouts'])->middleware('kyb.approved');
        Route::get('payouts', [OwnerDistributionController::class, 'payouts'])->middleware('kyb.approved');
        Route::get('projects', [OwnerProjectController::class, 'index']);
        Route::post('projects', [OwnerProjectController::class, 'store']);
        Route::get('projects/{project}', [OwnerProjectController::class, 'show']);
        Route::patch('projects/{project}', [OwnerProjectController::class, 'update']);
        Route::post('projects/{project}/submit-review', [OwnerProjectController::class, 'submitReview']);
        Route::get('projects/{project}/investments', [OwnerProjectController::class, 'investments']);
        Route::get('projects/{project}/reports', [OwnerProjectReportController::class, 'index']);
        Route::post('projects/{project}/reports', [OwnerProjectReportController::class, 'store']);
        Route::get('projects/{project}/documents', [OwnerProjectDocumentController::class, 'index']);
        Route::post('projects/{project}/documents', [OwnerProjectDocumentController::class, 'store']);
    });
});
