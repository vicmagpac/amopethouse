<?php

namespace App\Providers;

use App\Models\Usuario;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Event::listen(Registered::class, SendEmailVerificationNotification::class);

        ResetPassword::createUrlUsing(function (Usuario $usuario, string $token): string {
            return rtrim((string) config('app.frontend_url'), '/')
                .'/redefinir-senha?token='.$token
                .'&email='.urlencode($usuario->getEmailForPasswordReset());
        });
    }
}
