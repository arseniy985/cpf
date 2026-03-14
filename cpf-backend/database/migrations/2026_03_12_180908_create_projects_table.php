<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('excerpt', 500);
            $table->text('description');
            $table->text('thesis')->nullable();
            $table->text('risk_summary')->nullable();
            $table->string('location');
            $table->string('asset_type', 60);
            $table->string('status', 40)->default('draft');
            $table->string('funding_status', 40)->default('preparing');
            $table->string('risk_level', 40);
            $table->string('payout_frequency', 40)->default('monthly');
            $table->unsignedBigInteger('min_investment');
            $table->unsignedBigInteger('target_amount');
            $table->unsignedBigInteger('current_amount')->default(0);
            $table->decimal('target_yield', 5, 2);
            $table->unsignedSmallInteger('term_months');
            $table->string('cover_image_url')->nullable();
            $table->string('hero_metric')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
