<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('investor_payout_profiles')) {
            return;
        }

        Schema::create('investor_payout_profiles', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignUlid('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('provider', 40)->default('yookassa');
            $table->string('status', 40)->default('draft');
            $table->string('payout_method_label')->nullable();
            $table->text('payout_token')->nullable();
            $table->timestamp('last_verified_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('investor_payout_profiles');
    }
};
