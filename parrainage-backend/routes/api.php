<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Electeur;
use App\Models\FichierElectoral;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\ElecteurTemps;
use League\Csv\Reader;
use App\Models\ElecteursProblematiques;
use App\Http\Controllers\ElecteursProblematiqueController;
use App\Http\Controllers\PeriodeParrainageController;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CandidatController;
use App\Http\Controllers\UploadController;
use App\Models\HistoriqueUpload;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\ParrainController;
use App\Http\Controllers\ParrainageController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();

});
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/candidats/verifier', [CandidatController::class, 'verifierElecteur']);
    Route::post('/candidats', [CandidatController::class, 'enregistrerCandidat']);
    Route::get('/candidats', [CandidatController::class, 'getCandidats']);
    Route::post('/candidats/regenerer-code', [CandidatController::class, 'regenererCodeSecurite']);

});
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->put('/profil/update', function (Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'prenom' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users,email,' . $request->user()->id,
        'password' => 'nullable|string|min:6',
    ]);

    $user = $request->user();
    $user->name = $request->name;
    $user->prenom = $request->prenom;
    $user->email = $request->email;

    if ($request->password) {
        $user->password = Hash::make($request->password);
    }

    $user->save();

    return response()->json(['message' => 'Profil mis à jour avec succès ✅']);
});
Route::middleware('auth:sanctum')->post('/periode-parrainage', [PeriodeParrainageController::class, 'enregistrerPeriode']);
Route::middleware('auth:sanctum')->get('/periode-parrainage', [PeriodeParrainageController::class, 'getPeriode']);
Route::middleware('auth:sanctum')->get('/periode-parrainage/verifier', [PeriodeParrainageController::class, 'verifierActivation']);

Route::middleware('auth:sanctum')->post('/electeurs/upload', [UploadController::class, 'upload']);
Route::middleware('auth:sanctum')->post('/electeurs/valider/{idFichier?}', [UploadController::class, 'ControlerElecteurs']);
Route::middleware('auth:sanctum')->post('/electeurs/valider-importation/{idFichier?}', [UploadController::class, 'ValiderImportation']);
Route::middleware('auth:sanctum')->get('/electeurs/problematiques/{idFichier?}', [ElecteursProblematiqueController::class, 'getElecteursProblematique']);

Route::middleware('auth:sanctum')->get('/electeurs/en-attente', function () {
    $enAttente = DB::table('ElecteurTemps')->exists();
    return response()->json(['enAttente' => $enAttente]);
});


Route::get('/electeurs', function () {
    return response()->json(Electeur::all());
});
Route::post('/electeurs', function (Request $request) {
    $electeur = Electeur::create($request->all());
    return response()->json($electeur);
});

Route::post('/parrain/verify', [ParrainController::class, 'verifyParrainInfo']);
Route::post('/parrain/register', [ParrainController::class, 'register']);
Route::post('/parrain/login', [ParrainController::class, 'login']);
Route::post('/parrainage/enregistrer', [ParrainageController::class, 'enregistrer']);
Route::put('/parrain/update', [ParrainController::class, 'updateProfile'])->middleware('auth:sanctum');
Route::get('/candidats', [CandidatController::class, 'getCandidats']);










Route::post('/electeurs/valider/{id}', function ($id) {
    DB::transaction(function () use ($id) {
        // Récupérer l'électeur temporaire
        $electeurTemps = ElecteurTemps::findOrFail($id);

        // Insérer dans la table `electeurs`
        Electeur::create([
            'NumeroCarteElecteur' => $electeurTemps->NumeroCarteElecteur,
            'CIN' => $electeurTemps->CIN,
            'Nom' => $electeurTemps->Nom,
            'Prenom' => $electeurTemps->Prenom,
            'DateNaissance' => $electeurTemps->DateNaissance,
            'Commune' => $electeurTemps->Commune,
            'BureauVote' => $electeurTemps->BureauVote,
            'Email' => $electeurTemps->Email,
            'Telephone' => $electeurTemps->Telephone,
            'lieuDeNaissance' => $electeurTemps->LieuDeNaissance,
            'Sexe' => $electeurTemps->Sexe,
            'statut' => 'Validé'
        ]);

        // Supprimer de la table temporaire
        $electeurTemps->delete();
    });

    return response()->json(['message' => 'Électeur validé avec succès']);
});

Route::post('/electeurs/rejeter/{id}', function ($id, Request $request) {
    DB::transaction(function () use ($id, $request) {
        // Récupérer l'électeur temporaire
        $electeurTemps = ElecteurTemps::findOrFail($id);

        // Enregistrer dans la table `electeurs_problematiques`
        ElecteursProblematiques::create([
            'IDFichier' => $electeurTemps->IDFichier,
            'NumeroCarteElecteur' => $electeurTemps->NumeroCarteElecteur,
            'CIN' => $electeurTemps->cin,
            'NatureProbleme' => $request->input('raison')
        ]);

        // Supprimer de la table temporaire
        $electeurTemps->delete();
    });

    return response()->json(['message' => 'Électeur rejeté avec succès']);
});

Route::get('/fichiers/en-attente', function () {
    return response()->json(FichierElectoral::where('Statut', 'En attente')->get());
});

Route::post('/fichiers/valider/{fichierId}', function ($fichierId) {
    DB::statement("CALL ValiderImportation(?)", [$fichierId]);
    return response()->json(['message' => 'Fichier validé']);
});

Route::get('/electeurs-problematiques/{fichierId}', function ($fichierId) {
    return response()->json(ElecteursProblematiques::where('IDFichier', $fichierId)->get());
});

Route::get('/periode-parrainage/status', [PeriodeParrainageController::class, 'getStatus']);
Route::post('/periode-parrainage/ouvrir', [PeriodeParrainageController::class, 'ouvrir']);

Route::post('/periode-parrainage/fermer', [PeriodeParrainageController::class, 'fermer']);