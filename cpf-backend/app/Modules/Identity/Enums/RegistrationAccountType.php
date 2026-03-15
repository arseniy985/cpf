<?php

namespace App\Modules\Identity\Enums;

enum RegistrationAccountType: string
{
    case Investor = 'investor';
    case Owner = 'owner';
}
