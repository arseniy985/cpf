<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('offering_rounds', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignUlid('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignUlid('owner_account_id')->constrained('owner_accounts')->cascadeOnDelete();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('status', 40)->default('draft');
            $table->unsignedBigInteger('target_amount');
            $table->unsignedBigInteger('current_amount')->default(0);
            $table->unsignedBigInteger('min_investment');
            $table->decimal('target_yield', 5, 2);
            $table->string('payout_frequency', 40)->default('monthly');
            $table->unsignedSmallInteger('term_months');
            $table->boolean('oversubscription_allowed')->default(false);
            $table->timestamp('opens_at')->nullable();
            $table->timestamp('closes_at')->nullable();
            $table->timestamp('review_submitted_at')->nullable();
            $table->timestamp('went_live_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['project_id', 'status']);
        });

        Schema::table('investment_applications', function (Blueprint $table): void {
            $table->foreignUlid('offering_round_id')->nullable()->after('project_id')->constrained('offering_rounds')->nullOnDelete();
        });

        Schema::create('investor_allocations', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignUlid('offering_round_id')->constrained('offering_rounds')->cascadeOnDelete();
            $table->foreignUlid('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUlid('investment_application_id')->nullable()->unique()->constrained('investment_applications')->nullOnDelete();
            $table->unsignedBigInteger('amount');
            $table->string('status', 40)->default('confirmed');
            $table->string('agreement_url')->nullable();
            $table->timestamp('allocated_at')->nullable();
            $table->timestamp('settled_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['offering_round_id', 'status']);
            $table->index(['user_id', 'status']);
        });

        Schema::create('distributions', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignUlid('offering_round_id')->constrained('offering_rounds')->cascadeOnDelete();
            $table->foreignUlid('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignUlid('owner_account_id')->constrained('owner_accounts')->cascadeOnDelete();
            $table->string('title');
            $table->string('period_label');
            $table->date('period_start')->nullable();
            $table->date('period_end')->nullable();
            $table->unsignedBigInteger('total_amount');
            $table->unsignedInteger('lines_count')->default(0);
            $table->string('status', 40)->default('draft');
            $table->string('payout_mode', 40)->default('manual');
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['offering_round_id', 'status']);
        });

        Schema::create('payout_instructions', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignUlid('distribution_id')->nullable()->constrained('distributions')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->unsignedBigInteger('amount');
            $table->string('currency', 3)->default('RUB');
            $table->string('direction', 40)->default('investor_distribution');
            $table->string('gateway', 40)->default('manual');
            $table->string('status', 40)->default('draft');
            $table->string('external_id')->nullable();
            $table->string('reference_label')->nullable();
            $table->json('payload')->nullable();
            $table->text('failure_reason')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('synced_at')->nullable();
            $table->timestamps();

            $table->index(['distribution_id', 'status']);
        });

        Schema::create('distribution_lines', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignUlid('distribution_id')->constrained('distributions')->cascadeOnDelete();
            $table->foreignUlid('investor_allocation_id')->constrained('investor_allocations')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUlid('payout_instruction_id')->nullable()->unique()->constrained('payout_instructions')->nullOnDelete();
            $table->unsignedBigInteger('amount');
            $table->string('status', 40)->default('draft');
            $table->text('failure_reason')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->unique(['distribution_id', 'investor_allocation_id']);
            $table->index(['distribution_id', 'status']);
        });

        $now = now();
        $projects = DB::table('projects')->whereNotNull('owner_account_id')->get();

        foreach ($projects as $project) {
            $roundId = (string) Str::ulid();
            DB::table('offering_rounds')->insert([
                'id' => $roundId,
                'project_id' => $project->id,
                'owner_account_id' => $project->owner_account_id,
                'slug' => Str::slug($project->slug.'-main-round'),
                'title' => $project->title.' · Основной раунд',
                'status' => $project->status === 'published' ? 'live' : 'draft',
                'target_amount' => $project->target_amount,
                'current_amount' => $project->current_amount,
                'min_investment' => $project->min_investment,
                'target_yield' => $project->target_yield,
                'payout_frequency' => $project->payout_frequency,
                'term_months' => $project->term_months,
                'oversubscription_allowed' => false,
                'opens_at' => $project->published_at ?? $now,
                'closes_at' => null,
                'review_submitted_at' => $project->review_submitted_at,
                'went_live_at' => $project->published_at,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            DB::table('investment_applications')
                ->where('project_id', $project->id)
                ->update(['offering_round_id' => $roundId]);

            $confirmedApplications = DB::table('investment_applications')
                ->where('project_id', $project->id)
                ->where('status', 'confirmed')
                ->get();

            foreach ($confirmedApplications as $application) {
                DB::table('investor_allocations')->insert([
                    'id' => (string) Str::ulid(),
                    'offering_round_id' => $roundId,
                    'project_id' => $project->id,
                    'user_id' => $application->user_id,
                    'investment_application_id' => $application->id,
                    'amount' => $application->amount,
                    'status' => 'confirmed',
                    'agreement_url' => $application->agreement_url,
                    'allocated_at' => $application->confirmed_at ?? $application->updated_at,
                    'created_at' => $application->created_at,
                    'updated_at' => $application->updated_at,
                ]);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('distribution_lines');
        Schema::dropIfExists('payout_instructions');
        Schema::dropIfExists('distributions');
        Schema::dropIfExists('investor_allocations');

        Schema::table('investment_applications', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('offering_round_id');
        });

        Schema::dropIfExists('offering_rounds');
    }
};
