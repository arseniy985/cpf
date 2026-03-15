<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payment_transactions', function (Blueprint $table): void {
            $table->dropUnique('payment_transactions_idempotency_key_unique');
            $table->unique(['user_id', 'idempotency_key'], 'payment_transactions_user_idempotency_unique');
            $table->unique('external_id', 'payment_transactions_external_id_unique');
        });

        Schema::table('withdrawal_requests', function (Blueprint $table): void {
            $table->dropUnique('withdrawal_requests_idempotency_key_unique');
            $table->unique(['user_id', 'idempotency_key'], 'withdrawal_requests_user_idempotency_unique');
        });

        Schema::table('wallet_transactions', function (Blueprint $table): void {
            $table->unique(
                ['reference_type', 'reference_id', 'type', 'direction'],
                'wallet_transactions_reference_operation_unique',
            );
        });
    }

    public function down(): void
    {
        Schema::table('wallet_transactions', function (Blueprint $table): void {
            $table->dropUnique('wallet_transactions_reference_operation_unique');
        });

        Schema::table('withdrawal_requests', function (Blueprint $table): void {
            $table->dropUnique('withdrawal_requests_user_idempotency_unique');
            $table->unique('idempotency_key', 'withdrawal_requests_idempotency_key_unique');
        });

        Schema::table('payment_transactions', function (Blueprint $table): void {
            $table->dropUnique('payment_transactions_user_idempotency_unique');
            $table->dropUnique('payment_transactions_external_id_unique');
            $table->unique('idempotency_key', 'payment_transactions_idempotency_key_unique');
        });
    }
};
