<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Electeur;
use App\Models\Parrains;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use App\Mail\CodeVerificationMail;


class ParrainController extends Controller
{
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'NumeroCarteElecteur' => 'required|exists:Electeurs,NumeroCarteElecteur|unique:Parrains,NumeroCarteElecteur',
            'CIN' => 'required|exists:Electeurs,CIN|unique:Parrains,CIN',
            'Nom' => 'required|exists:Electeurs,Nom',
            'BureauVote' => 'required|exists:Electeurs,BureauVote',
            'Email' => 'required|email|unique:Parrains,Email',
            'Telephone' => 'required|unique:Parrains,Telephone',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Échec de validation', 'errors' => $validator->errors()], 400);
        }

        // Générer un code d'authentification aléatoire
        $codeAuth = rand(100000, 999999);
        $expiration = now()->addMinutes(10);

        $parrain = Parrains::create([
            'NumeroCarteElecteur' => $request->NumeroCarteElecteur,
            'CIN' => $request->CIN,
            'Nom' => $request->Nom,
            'BureauVote' => $request->BureauVote,
            'Email' => $request->Email,
            'Telephone' => $request->Telephone,
            'CodeAuth' => $codeAuth,
            'CodeExpiration' => $expiration
        ]);

        // Simuler l'envoi du code par mail/SMS
        Mail::to($request->Email)->send(new CodeVerificationMail($codeAuth));

        return response()->json(['message' => 'Compte créé avec succès ✅', 'parrain' => $parrain]);
    }
    public function login(Request $request)
{
    // Valider les données de connexion
    $validator = Validator::make($request->all(), [
        'Email' => 'required|email',
        'Password' => 'required',
    ]);

    if ($validator->fails()) {
        return response()->json(['message' => 'Validation échouée', 'errors' => $validator->errors()], 400);
    }

    // Vérifier les informations d'identification
    $parrain = Parrains::where('Email', $request->Email)->first();

    if (!$parrain || !Hash::check($request->Password, $parrain->Password)) {
        return response()->json(['message' => 'Email ou mot de passe incorrect'], 401);
    }

    // Authentifier l'utilisateur et générer un token
    $token = $parrain->createToken('ParrainToken')->plainTextToken;

    return response()->json([
        'message' => 'Connexion réussie',
        'token' => $token
    ]);
}

}