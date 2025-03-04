<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

class CandidatAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    { $token = $request->bearerToken();
        if (!$token) {
            return response()->json(['message' => 'Non authentifié ❌'], 401);
        }

        $accessToken = PersonalAccessToken::findToken($token);
        if (!$accessToken || $accessToken->tokenable_type !== 'App\Models\Candidat') {
            return response()->json(['message' => 'Accès interdit ❌'], 403);
        }
        return $next($request);
    }
}
