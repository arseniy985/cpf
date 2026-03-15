<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('owner_accounts', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignId('primary_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('slug')->unique();
            $table->string('display_name');
            $table->string('status', 40)->default('account_created');
            $table->text('overview')->nullable();
            $table->string('website_url')->nullable();
            $table->timestamps();
        });

        Schema::create('owner_members', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignUlid('owner_account_id')->constrained('owner_accounts')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('role', 40)->default('owner');
            $table->string('status', 40)->default('active');
            $table->timestamps();

            $table->unique(['owner_account_id', 'user_id']);
        });

        Schema::create('owner_organizations', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignUlid('owner_account_id')->unique()->constrained('owner_accounts')->cascadeOnDelete();
            $table->string('legal_name')->nullable();
            $table->string('brand_name')->nullable();
            $table->string('entity_type', 40)->nullable();
            $table->string('registration_number', 64)->nullable();
            $table->string('tax_id', 32)->nullable();
            $table->string('website_url')->nullable();
            $table->string('address')->nullable();
            $table->string('signatory_name')->nullable();
            $table->string('signatory_role')->nullable();
            $table->string('beneficiary_name')->nullable();
            $table->text('overview')->nullable();
            $table->timestamps();
        });

        Schema::create('owner_bank_profiles', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignUlid('owner_account_id')->unique()->constrained('owner_accounts')->cascadeOnDelete();
            $table->string('payout_method', 40)->default('bank_transfer');
            $table->string('recipient_name')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('bank_bik', 32)->nullable();
            $table->string('bank_account', 64)->nullable();
            $table->string('correspondent_account', 64)->nullable();
            $table->string('status', 40)->default('draft');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('owner_onboardings', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignUlid('owner_account_id')->unique()->constrained('owner_accounts')->cascadeOnDelete();
            $table->string('status', 40)->default('account_created');
            $table->timestamp('invited_at')->nullable();
            $table->timestamp('account_created_at')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('activated_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
        });

        Schema::table('projects', function (Blueprint $table): void {
            $table->foreignUlid('owner_account_id')->nullable()->after('owner_id')->constrained('owner_accounts')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('owner_account_id');
        });

        Schema::dropIfExists('owner_onboardings');
        Schema::dropIfExists('owner_bank_profiles');
        Schema::dropIfExists('owner_organizations');
        Schema::dropIfExists('owner_members');
        Schema::dropIfExists('owner_accounts');
    }
};
