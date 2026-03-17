<?php

namespace App\Modules\Origination\Services;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Spatie\Activitylog\Models\Activity;

class OwnerActivityService
{
    /**
     * @param  array<int, Model|null>  $subjects
     * @return Collection<int, Activity>
     */
    public function forSubjects(array $subjects, int $limit = 20): Collection
    {
        $pairs = collect($subjects)
            ->filter()
            ->map(fn (Model $subject) => [
                'subject_type' => $subject::class,
                'subject_id' => (string) $subject->getKey(),
            ])
            ->values();

        if ($pairs->isEmpty()) {
            return collect();
        }

        return Activity::query()
            ->with('causer')
            ->where(function ($query) use ($pairs): void {
                foreach ($pairs as $pair) {
                    $query->orWhere(function ($nested) use ($pair): void {
                        $nested
                            ->where('subject_type', $pair['subject_type'])
                            ->where('subject_id', $pair['subject_id']);
                    });
                }
            })
            ->latest()
            ->limit($limit)
            ->get();
    }
}
