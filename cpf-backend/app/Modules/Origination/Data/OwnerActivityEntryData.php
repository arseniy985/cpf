<?php

namespace App\Modules\Origination\Data;

use Spatie\Activitylog\Models\Activity;
use Spatie\LaravelData\Data;

class OwnerActivityEntryData extends Data
{
    /**
     * @param  array<int, string>  $changedFields
     */
    public function __construct(
        public string $id,
        public string $event,
        public string $description,
        public string $subjectType,
        public string $subjectLabel,
        public array $changedFields,
        public ?string $causerName,
        public ?string $createdAt,
    ) {}

    public static function fromModel(Activity $activity): self
    {
        $properties = $activity->properties ?? collect();
        $changedFields = array_values(array_unique([
            ...array_keys($properties->get('attributes', [])),
            ...array_keys($properties->get('old', [])),
        ]));

        return new self(
            id: (string) $activity->id,
            event: (string) ($activity->event ?? 'updated'),
            description: $activity->description !== '' ? $activity->description : 'Изменение сохранено',
            subjectType: class_basename((string) $activity->subject_type),
            subjectLabel: self::resolveSubjectLabel($activity),
            changedFields: $changedFields,
            causerName: $activity->causer?->name,
            createdAt: $activity->created_at?->toAtomString(),
        );
    }

    private static function resolveSubjectLabel(Activity $activity): string
    {
        return match (class_basename((string) $activity->subject_type)) {
            'OwnerAccount' => 'Профиль owner',
            'OwnerOrganization' => 'Организация',
            'OwnerBankProfile' => 'Реквизиты',
            'OwnerOnboarding' => 'Onboarding',
            'OwnerMember' => 'Участник команды',
            'Project' => 'Проект',
            'OfferingRound' => 'Раунд',
            default => 'Событие',
        };
    }
}
