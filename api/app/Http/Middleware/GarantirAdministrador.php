<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class GarantirAdministrador
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()?->eAdministrador()) {
            abort(403, 'Esta ação não é permitida.');
        }

        return $next($request);
    }
}
