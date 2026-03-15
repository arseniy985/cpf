<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('manual_deposit_requests', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('amount');
            $table->string('currency', 3)->default('RUB');
            $table->string('status', 40)->default('awaiting_transfer');
            $table->string('reference_code')->unique();
            $table->string('idempotency_key')->nullable()->unique();
            $table->string('recipient_name');
            $table->string('bank_name');
            $table->string('bank_account');
            $table->string('bank_bik')->nullable();
            $table->string('correspondent_account')->nullable();
            $table->string('payment_purpose');
            $table->string('manager_name')->nullable();
            $table->string('manager_email')->nullable();
            $table->string('manager_phone')->nullable();
            $table->string('manager_telegram')->nullable();
            $table->string('payer_name');
            $table->string('payer_bank')->nullable();
            $table->string('payer_account_last4', 4)->nullable();
            $table->text('comment')->nullable();
            $table->string('receipt_disk')->nullable();
            $table->string('receipt_path')->nullable();
            $table->string('receipt_original_name')->nullable();
            $table->string('receipt_mime_type')->nullable();
            $table->unsignedBigInteger('receipt_size')->default(0);
            $table->text('review_note')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('receipt_uploaded_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('credited_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUlid('wallet_transaction_id')->nullable()->constrained('wallet_transactions')->nullOnDelete();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('manual_deposit_requests');
    }
};
