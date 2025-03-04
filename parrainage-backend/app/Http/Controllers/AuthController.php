<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class AuthController extends Controller {
    // Inscription
    public function register(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'Utilisateur créé avec succès ✅']);
    }

    // Connexion
    public function login(Request $request) {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages(['email' => 'Identifiants incorrects ❌']);
        }

        $token = $user->createToken('authToken')->plainTextToken;
        return response()->json(['token' => $token, 'user' => $user]);
    }
    

    // Déconnexion
    public function logout(Request $request) {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Déconnexion réussie ✅']);
    }

    // Récupérer les infos de l'utilisateur
    public function me(Request $request) {
        return response()->json($request->user());
    }
}