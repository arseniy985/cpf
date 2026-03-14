<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('legal_documents', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->string('slug')->unique();
            $table->string('title');
            $table->text('summary')->nullable();
            $table->string('document_type', 60);
            $table->string('file_url')->nullable();
            $table->string('status', 40)->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('legal_documents');
    }
};
