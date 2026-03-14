<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('email_auth_codes', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignId('user_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('email')->index();
            $table->string('purpose', 40);
            $table->string('code_hash');
            $table->unsignedTinyInteger('attempts')->default(0);
            $table->timestamp('expires_at');
            $table->timestamp('consumed_at')->nullable();
            $table->timestamps();

            $table->index(['email', 'purpose', 'expires_at']);
        });

        Schema::create('wallet_transactions', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type', 40);
            $table->string('direction', 10);
            $table->string('status', 20)->default('posted');
            $table->unsignedBigInteger('amount');
            $table->string('currency', 3)->default('RUB');
            $table->string('reference_type')->nullable();
            $table->string('reference_id')->nullable();
            $table->string('description')->nullable();
            $table->json('meta')->nullable();
            $table->timestamp('occurred_at');
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['reference_type', 'reference_id']);
        });

        Schema::create('kyc_documents', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignUlid('kyc_profile_id')->constrained('kyc_profiles')->cascadeOnDelete();
            $table->string('kind', 40);
            $table->string('status', 40)->default('pending_review');
            $table->string('original_name');
            $table->string('disk')->default('private');
            $table->string('path');
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('size')->default(0);
            $table->text('review_comment')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::table('payment_transactions', function (Blueprint $table): void {
            $table->string('status_reason')->nullable()->after('status');
            $table->timestamp('synced_at')->nullable()->after('processed_at');
        });

        Schema::table('withdrawal_requests', function (Blueprint $table): void {
            $table->foreignUlid('wallet_transaction_id')->nullable()->after('reviewed_by')->constrained('wallet_transactions')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('withdrawal_requests', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('wallet_transaction_id');
        });

        Schema::table('payment_transactions', function (Blueprint $table): void {
            $table->dropColumn(['status_reason', 'synced_at']);
        });

        Schema::dropIfExists('kyc_documents');
        Schema::dropIfExists('wallet_transactions');
        Schema::dropIfExists('email_auth_codes');
    }
};
