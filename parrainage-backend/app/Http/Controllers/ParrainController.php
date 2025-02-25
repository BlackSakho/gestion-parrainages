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
    public function verifyParrainInfo(Request $request) {
        $validator = Validator::make($request->all(), [
            'NumeroCarteElecteur' => 'required|exists:Electeurs,NumeroCarteElecteur',
            'CIN' => 'required|exists:Electeurs,CIN',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Échec de validation', 'errors' => $validator->errors()], 400);
        }

        return response()->json(['success' => true, 'message' => 'Informations validées.']);
    }

    public function register(Request $request) {
        $validator = Validator::make($request->all(), [

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


}