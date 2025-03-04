<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Candidat;
use App\Models\Electeur;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\Parrainage;

class CandidatController extends Controller
{
    // ✅ 1️⃣ Vérifier si l'électeur existe
    public function verifierElecteur(Request $request)
    {
        $request->validate([
            'NumeroCarteElecteur' => 'required|string'
        ]);

        $electeur = Electeur::where('NumeroCarteElecteur', $request->NumeroCarteElecteur)->first();

        if (!$electeur) {
            return response()->json(['message' => 'Le candidat considéré n’est pas présent dans le fichier électoral.'], 404);
        }

        if (Candidat::where('NumeroCarteElecteur', $request->NumeroCarteElecteur)->exists()) {
            return response()->json(['message' => 'Candidat déjà enregistré !'], 409);
        }


        return response()->json([
            'Nom' => $electeur->Nom,
            'Prenom' => $electeur->Prenom,
            'DateNaissance' => $electeur->DateNaissance
        ]);
    }

    // ✅ 2️⃣ Enregistrer un candidat
    public function enregistrerCandidat(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'NumeroCarteElecteur' => 'required|string|unique:Candidats',
            'Email' => 'required|email|unique:Candidats',
            'Telephone' => 'required|string|unique:Candidats',
            'PartiPolitique' => 'nullable|string',
            'Slogan' => 'nullable|string',
            'Photo' => 'nullable|string',
            'Couleurs' => 'nullable|string',
            'URL' => 'nullable|url'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $codeSecurite = rand(10000, 99999);

        $candidat = Candidat::create([
            'NumeroCarteElecteur' => $request->NumeroCarteElecteur,
            'Nom' => $request->Nom,
            'Prenom' => $request->Prenom,
            'DateNaissance' => $request->DateNaissance,
            'Email' => $request->Email,
            'Telephone' => $request->Telephone,
            'PartiPolitique' => $request->PartiPolitique,
            'Slogan' => $request->Slogan,
            'Photo' => $request->Photo,
            'Couleurs' => $request->Couleurs,
            'URL' => $request->URL,
            'CodeSecurite' => $codeSecurite
        ]);

        // ✅ Envoyer le code de sécurité par email
        Mail::raw("Votre code de sécurité est : $codeSecurite", function ($message) use ($candidat) {
            $message->to($candidat->Email)
                    ->subject('Code de sécurité - Parrainage');
        });

        return response()->json(['message' => 'Candidat enregistré avec succès ✅']);
    }

    // ✅ 3️⃣ Lister les candidats
    public function getCandidats()
    {
        return response()->json(Candidat::all());
    }

    // ✅ 4️⃣ Générer un nouveau code de sécurité
    public function regenererCodeSecurite(Request $request)
    {
        $request->validate(['NumeroCarteElecteur' => 'required|string']);

        $candidat = Candidat::where('NumeroCarteElecteur', $request->NumeroCarteElecteur)->first();

        if (!$candidat) {
            return response()->json(['message' => 'Candidat non trouvé.'], 404);
        }

        $nouveauCode = rand(10000, 99999);
        $candidat->update(['CodeSecurite' => $nouveauCode]);

        Mail::raw("Votre nouveau code de sécurité est : $nouveauCode", function ($message) use ($candidat) {
            $message->to($candidat->Email)
                    ->subject('Nouveau Code de Sécurité - Parrainage');
        });

        return response()->json(['message' => 'Nouveau code généré et envoyé ✅']);
    }


    // ✅ 4️⃣ Récupérer un candidat par son ID
    public function getCandidatById($id)
    {
        $candidat = Candidat::find($id);

        if (!$candidat) {
            return response()->json(['message' => 'Candidat non trouvé'], 404);
        }

        return response()->json($candidat);
    }
    public function login(Request $request)
    {
        $request->validate([
            'Email' => 'required|email',
            'CodeSecurite' => 'required|string',
        ]);

        $candidat = Candidat::where('Email', $request->email)->first();

        if (!$candidat || !Hash::check($request->CodeSecurite, $candidat->CodeSecurite)) {
            return response()->json(['message' => 'Identifiants incorrects'], 401);
        }


        // Supprimer les anciens tokens avant d'en créer un nouveau
        $candidat->tokens()->delete();

        // Générer un nouveau token pour l'utilisateur
        $token = $candidat->createToken('CandidatToken', ['candidat'])->plainTextToken;



        return response()->json([
            'token' => $token,
            'candidat' => $candidat]);
    }
    public function getParrainages(Request $request)
    {
        $candidat = Auth::user();
        $parrainages = $candidat->parrainages()->orderBy('created_at', 'desc')->get();

        return response()->json($parrainages);
    }
    public function getParrainageStats(Request $request)
    {
        $candidat = Auth::user();
        $parrainages = $candidat->parrainages;

        $stats = [
            'total' => $parrainages->count(),
            'today' => $parrainages->where('created_at', '>=', now()->startOfDay())->count(),
            'yesterday' => $parrainages->where('created_at', '>=', now()->subDay()->startOfDay())->where('created_at', '<', now()->startOfDay())->count(),
            'lastWeek' => $parrainages->where('created_at', '>=', now()->subWeek())->count(),
            'byDay' => $parrainages->groupBy(function ($date) {
                return $date->created_at->format('Y-m-d');
            })->map(function ($day) {
                return $day->count();
            }),
            'byRegion' => $parrainages->groupBy('region')->map(function ($region) {
                return $region->count();
            }),
        ];

        return response()->json($stats);
    }


}