<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->json('notification_preferences')->nullable()->after('last_login_at');
        });

        Schema::table('projects', function (Blueprint $table): void {
            $table->foreignId('owner_id')->nullable()->after('id')->constrained('users')->nullOnDelete();
            $table->timestamp('review_submitted_at')->nullable()->after('published_at');
        });

        Schema::table('investment_applications', function (Blueprint $table): void {
            $table->timestamp('confirmed_at')->nullable()->after('status');
            $table->string('agreement_url')->nullable()->after('confirmed_at');
        });

        Schema::table('payment_transactions', function (Blueprint $table): void {
            $table->string('idempotency_key')->nullable()->after('external_id')->unique();
        });

        Schema::create('kyc_profiles', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('status', 40)->default('draft');
            $table->string('legal_name');
            $table->date('birth_date')->nullable();
            $table->string('tax_id', 32)->nullable();
            $table->string('document_number', 120)->nullable();
            $table->string('address')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('notifications', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type', 80)->default('system');
            $table->string('title');
            $table->text('body');
            $table->string('action_url')->nullable();
            $table->json('payload')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'read_at']);
        });

        Schema::create('withdrawal_requests', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('amount');
            $table->string('status', 40)->default('pending_review');
            $table->string('bank_name');
            $table->string('bank_account');
            $table->text('comment')->nullable();
            $table->string('idempotency_key')->nullable()->unique();
            $table->text('review_note')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['user_id', 'status']);
        });

        Schema::create('project_reports', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignUlid('project_id')->constrained('projects')->cascadeOnDelete();
            $table->string('title');
            $table->text('summary')->nullable();
            $table->string('file_url')->nullable();
            $table->date('report_date');
            $table->boolean('is_public')->default(false);
            $table->timestamps();
        });

        Schema::create('project_faq_items', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignUlid('project_id')->constrained('projects')->cascadeOnDelete();
            $table->string('question');
            $table->text('answer');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        Schema::create('static_pages', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('key')->unique();
            $table->string('title');
            $table->string('headline')->nullable();
            $table->text('summary')->nullable();
            $table->longText('body')->nullable();
            $table->json('meta')->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        Schema::create('reviews', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('author_name');
            $table->string('author_role')->nullable();
            $table->string('company_name')->nullable();
            $table->unsignedTinyInteger('rating')->default(5);
            $table->text('body');
            $table->boolean('is_published')->default(true);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('case_studies', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('excerpt', 500);
            $table->longText('body');
            $table->string('result_metric')->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });

        Schema::create('blog_categories', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('blog_posts', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignUlid('category_id')->nullable()->constrained('blog_categories')->nullOnDelete();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('excerpt', 500);
            $table->longText('body');
            $table->json('tags')->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blog_posts');
        Schema::dropIfExists('blog_categories');
        Schema::dropIfExists('case_studies');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('static_pages');
        Schema::dropIfExists('project_faq_items');
        Schema::dropIfExists('project_reports');
        Schema::dropIfExists('withdrawal_requests');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('kyc_profiles');

        Schema::table('payment_transactions', function (Blueprint $table): void {
            $table->dropUnique(['idempotency_key']);
            $table->dropColumn('idempotency_key');
        });

        Schema::table('investment_applications', function (Blueprint $table): void {
            $table->dropColumn(['confirmed_at', 'agreement_url']);
        });

        Schema::table('projects', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('owner_id');
            $table->dropColumn('review_submitted_at');
        });

        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn('notification_preferences');
        });
    }
};
