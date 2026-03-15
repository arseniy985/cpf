<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $connectionName = config('activitylog.database_connection');
        $tableName = config('activitylog.table_name');
        $schema = Schema::connection($connectionName);

        if (! $schema->hasTable($tableName)) {
            return;
        }

        $driver = DB::connection($connectionName)->getDriverName();

        if (in_array($driver, ['mysql', 'mariadb'], true)) {
            DB::connection($connectionName)->statement(
                sprintf(
                    'ALTER TABLE `%s` MODIFY `subject_id` VARCHAR(36) NULL, MODIFY `causer_id` VARCHAR(36) NULL',
                    $tableName,
                ),
            );

            return;
        }

        if ($driver === 'pgsql') {
            DB::connection($connectionName)->statement(
                sprintf(
                    'ALTER TABLE "%s" ALTER COLUMN "subject_id" TYPE VARCHAR(36) USING "subject_id"::VARCHAR(36), ALTER COLUMN "causer_id" TYPE VARCHAR(36) USING "causer_id"::VARCHAR(36)',
                    $tableName,
                ),
            );
        }
    }

    public function down(): void
    {
        // Keep string-compatible morph ids to preserve ULID activity history.
    }
};
