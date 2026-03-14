<?php

namespace App\Modules\Identity\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EmailCodeNotification extends Notification
{
    use Queueable;

    public function __construct(
        private readonly string $code,
        private readonly string $purpose,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $purposeLabel = match ($this->purpose) {
            'verify_email' => 'подтверждения email',
            'login' => 'входа в аккаунт',
            'password_reset' => 'сброса пароля',
            default => 'подтверждения операции',
        };

        return (new MailMessage)
            ->subject('Код '.$purposeLabel.' в ЦПФ')
            ->greeting('Здравствуйте')
            ->line('Ваш код для '.$purposeLabel.':')
            ->line($this->code)
            ->line('Код действует 10 минут. Если вы не запрашивали его, просто проигнорируйте письмо.');
    }
}
