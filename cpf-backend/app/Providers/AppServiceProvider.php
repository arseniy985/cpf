<?php

namespace App\Providers;

use App\Modules\Payments\Contracts\PaymentGateway;
use App\Modules\Payments\Contracts\PayoutGateway;
use App\Modules\Payments\Services\YooKassaPayoutGateway;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(PaymentGateway::class, function () {
            $gatewayClass = config('payments.gateways.'.config('payments.default'));

            if (! is_string($gatewayClass)) {
                throw new \RuntimeException('Unsupported payment gateway.');
            }

            return app($gatewayClass);
        });

        $this->app->bind(PayoutGateway::class, fn () => app(YooKassaPayoutGateway::class));
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $appUrl = (string) config('app.url');

        if (parse_url($appUrl, PHP_URL_SCHEME) === 'https') {
            URL::forceRootUrl(rtrim($appUrl, '/'));
            URL::forceScheme('https');
        }

        RateLimiter::for('auth.login', function (Request $request): Limit {
            $email = strtolower((string) $request->input('email'));

            return Limit::perMinute((int) config('cpf.auth.throttle.login_per_minute', 10))
                ->by(sprintf('auth:login:%s:%s', $email, $request->ip()));
        });

        RateLimiter::for('auth.email-code.issue', function (Request $request): Limit {
            $email = strtolower((string) $request->input('email'));

            return Limit::perMinutes(10, (int) config('cpf.auth.throttle.email_code_issue_per_ten_minutes', 5))
                ->by(sprintf('auth:issue:%s:%s', $email, $request->ip()));
        });

        RateLimiter::for('auth.email-code.verify', function (Request $request): Limit {
            $email = strtolower((string) $request->input('email'));
            $purpose = strtolower((string) $request->input('purpose'));

            return Limit::perMinutes(10, (int) config('cpf.auth.throttle.email_code_verify_per_ten_minutes', 10))
                ->by(sprintf('auth:verify:%s:%s:%s', $email, $purpose, $request->ip()));
        });

        RateLimiter::for('auth.password-reset', function (Request $request): Limit {
            $email = strtolower((string) $request->input('email'));

            return Limit::perMinutes(10, (int) config('cpf.auth.throttle.password_reset_per_ten_minutes', 5))
                ->by(sprintf('auth:password-reset:%s:%s', $email, $request->ip()));
        });
    }
}
