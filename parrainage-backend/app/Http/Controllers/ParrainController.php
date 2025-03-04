<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Electeur;
use App\Models\Parrains;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\CodeVerificationMail;
use App\Models\Candidat;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ParrainController extends Controller
{

     //  Connexion du parrain

     public function login(Request $request) {
        $request->validate([
            'NumeroCarteElecteur' => 'required|string|exists:parrains,NumeroCarteElecteur',
            'CIN' => 'required|string|exists:parrains,CIN',

        ]);

        // Récupérer les informations de l'électeur
        $electeur = Electeur::where('NumeroCarteElecteur', $request->NumeroCarteElecteur)
        ->where('CIN', $request->CIN)
        ->first();
        
        // Vérifier si le parrain existe
        $parrain = Parrains::where('NumeroCarteElecteur', $request->NumeroCarteElecteur)
            ->where('CIN', $request->CIN)
            ->first();

        if (!$parrain) {
            return response()->json(['message' => 'Identifiants invalides ❌'], 401);
        }



     if (!$electeur) {
         return response()->json(['message' => 'Électeur introuvable ❌'], 404);
     }


        // Supprimer les anciens tokens avant d'en créer un nouveau
        $parrain->tokens()->delete();

        // Générer un nouveau token pour l'utilisateur
        $token = $parrain->createToken('ParrainToken', ['parrain'])->plainTextToken;


        return response()->json([
            'message' => 'Authentification réussie ✅',
            'token' => $token,
            'electeur' => $electeur,
            'parrain' => $parrain,
            'success' => true,

        ]);

    }

    public function verifyParrain(Request $request)
    {
        $request->validate([
            'NumeroCarteElecteur' => 'required|string',
            'CIN' => 'required|string',
        ]);

        $parrain = Parrains::where('NumeroCarteElecteur', $request->NumeroCarteElecteur)
                          ->where('CIN', $request->CIN)
                          ->first();

        if ($parrain) {
            return response()->json([
                'success' => true,
                'message' => 'Identité vérifiée avec succès ✅',
                'parrain' => $parrain,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Électeur introuvable ❌',
            ], 404);
        }
    }


    //  Vérification des informations avant inscription
    public function verifyParrainInfo(Request $request) {
        $validator = Validator::make($request->all(), [
            'NumeroCarteElecteur' => 'required|exists:Electeurs,NumeroCarteElecteur',
            'CIN' => 'required|exists:Electeurs,CIN',
            'Nom' => 'required|exists:Electeurs,Nom',
            'BureauVote' => 'required|exists:Electeurs,BureauVote',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Échec de validation', 'errors' => $validator->errors()], 400);
        }

        return response()->json(['success' => true, 'message' => 'Informations validées ✅']);
    }

    //  Inscription du parrain-électeur
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'Email' => 'required|email|unique:Parrains,Email',
            'Telephone' => 'required|unique:Parrains,Telephone',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Échec de validation ❌', 'errors' => $validator->errors()], 400);
        }

        //  Générer un code d'authentification aléatoire
        $codeAuth = rand(100000, 999999);
        $expiration = Carbon::now()->addMinutes(10);

        $parrain = Parrains::updateOrCreate(
            ['NumeroCarteElecteur' => $request->NumeroCarteElecteur],
            [
                'CIN' => $request->CIN,
                'Nom' => $request->Nom,
                'BureauVote' => $request->BureauVote,
                'Email' => $request->Email,
                'Telephone' => $request->Telephone,
                'CodeAuth' => $codeAuth,
                'CodeExpiration' => $expiration
            ]
        );

        //  Envoi du code par mail
        Mail::to($request->Email)->send(new CodeVerificationMail($codeAuth));

        return response()->json(['message' => 'Compte créé avec succès ✅', 'parrain' => $parrain]);
    }


    //  Récupérer la liste des candidats
    public function getCandidats()
    {
        $candidats = Candidat::select(
            'id', 'Nom', 'Prenom', 'Email', 'Telephone',
            'PartiPolitique', 'Slogan', 'Photo', 'Couleurs', 'URL'
        )->get();

        return response()->json($candidats);
    }
}