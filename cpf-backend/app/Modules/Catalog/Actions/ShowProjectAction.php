<?php

namespace App\Modules\Catalog\Actions;

use App\Modules\Catalog\Domain\Models\Project;

class ShowProjectAction
{
    public function execute(Project $project): Project
    {
        return $project->load('documents');
    }
}
