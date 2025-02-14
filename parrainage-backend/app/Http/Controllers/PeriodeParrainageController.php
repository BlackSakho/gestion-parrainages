<?php

namespace App\Http\Controllers;
use App\Models\PeriodeParrainage;
use Illuminate\Http\JsonResponse;

use Illuminate\Http\Request;

class PeriodeParrainageController extends Controller
{
    // Récupérer l'état actuel de la période de parrainage
    public function getStatus(): JsonResponse {
        $periode = PeriodeParrainage::latest()->first();
        return response()->json(['etat' => $periode ? $periode->etat : 'Fermé']);
    }

    // Ouvrir la période de parrainage
    public function ouvrir(): JsonResponse {
        $periode = PeriodeParrainage::latest()->first();
        $periode->update(['etat' => 'Ouvert']);
        return response()->json(['message' => 'Période de parrainage ouverte.']);
    }

    // Fermer la période de parrainage
    public function fermer(): JsonResponse {
        $periode = PeriodeParrainage::latest()->first();
        $periode->update(['etat' => 'Fermé']);
        return response()->json(['message' => 'Période de parrainage fermée.']);
    }
}