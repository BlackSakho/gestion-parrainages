<?php

namespace App\Http\Controllers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\PeriodeParrainage;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PeriodeParrainageController extends Controller
{
     // ✅ 1️⃣ Créer ou Mettre à Jour la Période de Parrainage
    public function enregistrerPeriode(Request $request)
    {
        $request->validate([
            'DateDebut' => 'required|date',
            'DateFin' => 'required|date|after:DateDebut',
        ]);

        $dateDebut = Carbon::parse($request->DateDebut);
        $dateFin = Carbon::parse($request->DateFin);
        $dateActuelle = Carbon::now();

        // Vérification des règles métier
        if ($dateDebut->lt($dateActuelle->addMonths(6))) {
            return response()->json(['message' => 'La Date de Début doit être supérieure d\'au moins 6 mois par rapport à la date actuelle.'], 400);
        }

        // Désactiver toute autre période existante
        DB::table('PeriodeParrainage')->update(['Active' => false]);

        // Enregistrer la nouvelle période
        $periode = PeriodeParrainage::updateOrCreate(
            ['id' => 1], // On garde une seule période active
            [
                'DateDebut' => $dateDebut,
                'DateFin' => $dateFin,
                'Active' => false
            ]
        );

        return response()->json(['message' => 'Période enregistrée avec succès ✅', 'periode' => $periode]);
    }

    // ✅ 2️⃣ Vérifier et Activer/Désactiver Automatiquement la Période
    public function verifierActivation()
    {
        $periode = PeriodeParrainage::first();

        if (!$periode) {
            return response()->json(['message' => 'Aucune période enregistrée ❌'], 404);
        }

        $dateActuelle = Carbon::now();
        $active = false;

        if ($dateActuelle->gte($periode->DateDebut) && $dateActuelle->lte($periode->DateFin)) {
            $active = true;
        }

        $periode->update(['Active' => $active]);

        return response()->json([
            'message' => $active ? 'Période de parrainage active ✅' : 'Période de parrainage inactive ❌',
            'periode' => $periode
        ]);
    }

    // ✅ 3️⃣ Récupérer la Période de Parrainage Actuelle
    public function getPeriode()
    {
        $periode = PeriodeParrainage::first();
        return response()->json($periode ?: ['message' => 'Aucune période trouvée ❌'], $periode ? 200 : 404);
    }
}
