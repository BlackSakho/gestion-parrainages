<?php

namespace App\Http\Controllers;

use App\Models\Candidat;
use Illuminate\Http\Request;
use App\Models\Parrainage;
use App\Models\Parrains;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\CodeVerificationMail;

class ParrainageController extends Controller
{
    public function enregistrer(Request $request) {
        $validator = Validator::make($request->all(), [
            'NumeroCarteElecteur' => 'required|exists:Parrains,NumeroCarteElecteur',
            'CIN' => 'required|exists:Parrains,CIN',
            'CodeAuth' => 'required',
            'CandidatID' => 'required|exists:Candidats,NumeroCarteElecteur'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Données invalides ❌', 'errors' => $validator->errors()], 400);
        }

        $parrain = Parrains::where('NumeroCarteElecteur', $request->NumeroCarteElecteur)->first();

        if (!$parrain || $parrain->CodeAuth !== $request->CodeAuth || now()->greaterThan($parrain->CodeExpiration)) {
            return response()->json(['message' => 'Code d\'authentification invalide ou expiré ❌'], 400);
        }

        // Générer un code de validation à 5 chiffres
        $codeValidation = rand(10000, 99999);

        Parrainage::create([
            'ElecteurID' => $parrain->id,
            'CandidatID' => $request->CandidatID,
            'CodeValidation' => $codeValidation
        ]);


        // Envoi du code par email
        Mail::to($request->user()->email)->send(new CodeVerificationMail($codeValidation));

        return response()->json(['message' => 'Parrainage enregistré ✅', 'CodeValidation' => $codeValidation]);
    }

}