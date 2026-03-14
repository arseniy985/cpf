<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_transactions', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('gateway')->default('yookassa');
            $table->string('type')->default('deposit');
            $table->string('status')->default('pending');
            $table->unsignedBigInteger('amount');
            $table->string('currency', 3)->default('RUB');
            $table->string('external_id')->nullable()->index();
            $table->string('confirmation_url')->nullable();
            $table->json('payload')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_transactions');
    }
};
