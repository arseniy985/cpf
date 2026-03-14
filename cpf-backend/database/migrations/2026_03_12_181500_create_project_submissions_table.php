<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_submissions', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('full_name');
            $table->string('email');
            $table->string('phone', 40)->nullable();
            $table->string('company_name')->nullable();
            $table->string('project_name');
            $table->string('asset_type', 80);
            $table->unsignedBigInteger('target_amount');
            $table->text('message')->nullable();
            $table->string('status', 40)->default('new');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_submissions');
    }
};
