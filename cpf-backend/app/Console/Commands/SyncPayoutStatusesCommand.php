<?php

namespace App\Console\Commands;

use App\Modules\Payments\Services\DistributionService;
use Illuminate\Console\Command;

class SyncPayoutStatusesCommand extends Command
{
    protected $signature = 'payments:sync-payouts {--limit=100 : Maximum number of payout instructions to sync}';

    protected $description = 'Refresh statuses for pending automatic payouts';

    public function handle(DistributionService $distributionService): int
    {
        $synced = $distributionService->syncPendingPayouts((int) $this->option('limit'));

        $this->info(sprintf('Synced %d payout instruction(s).', $synced));

        return self::SUCCESS;
    }
}
