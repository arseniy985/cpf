<?php

namespace App\Providers;

use App\Modules\Payments\Contracts\PaymentGateway;
use App\Modules\Payments\Services\YooKassaPaymentGateway;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(PaymentGateway::class, function () {
            return match (config('payments.default')) {
                'yookassa' => new YooKassaPaymentGateway,
                default => throw new \RuntimeException('Unsupported payment gateway.'),
            };
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
