<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $responce = $next($request);

        $responce->header('Access-Control-Allow-Origin', 'https://naafiza.com, https://admin.naafiza.com');
        $responce->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        $responce->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return $responce;
    }
}
