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
use App\Http\Controllers\PeriodeParrainageController;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\AuthController;
use App\Models\HistoriqueUpload;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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

Route::get('/electeurs', function () {
    return response()->json(Electeur::all());
});
Route::post('/electeurs', function (Request $request) {
    $electeur = Electeur::create($request->all());
    return response()->json($electeur);
});
function ControlerFichierElecteurs($file, $checksum, $user) {
    // 1️⃣ Vérification du SHA256
    $computedChecksum = hash_file('sha256', $file->path());
    if ($computedChecksum !== $checksum) {
        Log::error('Erreur de checksum', ['checksum_attendu' => $checksum, 'checksum_recu' => $computedChecksum]);
        EnregistrerEchecUpload($user, $checksum, 'Checksum invalide');
        return false;
    }

    // 2️⃣ Vérification de l'encodage UTF-8
    $fullPath = $file->path();
    $content = file_get_contents($fullPath);
    if (!mb_check_encoding($content, 'UTF-8')) {
        Log::error('Erreur d’encodage', ['fichier' => $file->getClientOriginalName()]);
        EnregistrerEchecUpload($user, $checksum, 'Fichier non encodé en UTF-8');
        return false;
    }

    return true;
}

// Fonction pour enregistrer les échecs d’upload
function EnregistrerEchecUpload($user, $checksum, $message) {
    HistoriqueUpload::create([
        'UtilisateurID' => $user->id ?? null,
        'AdresseIP' => request()->ip(),
        'ClefUtilisee' => $checksum,
    ]);
}
Route::post('/electeurs/upload', function (Request $request) {
    if (!$request->hasFile('file') || !$request->has('checksum')) {
        return response()->json(['message' => 'Fichier ou checksum manquant.'], 400);
    }

    $file = $request->file('file');
    $checksum = $request->input('checksum');
    $user = Auth::user(); // Utilisateur connecté

    if (!ControlerFichierElecteurs($file, $checksum, $user)) {
        return response()->json(['message' => 'Le fichier ne respecte pas les critères.'], 400);
    }

    // Enregistrer le fichier dans storage/app/uploads/
    $filename = time() . '_' . $file->getClientOriginalName();
    $path = $file->storeAs('public', $filename); // ✅ Stocké en storage/app/uploads/

    // Vérifier si le fichier est bien stocké
    $fullPath = storage_path("app/public/$filename");
    if (!file_exists($fullPath)) {
        return response()->json(['message' => 'Le fichier n’a pas été correctement enregistré.'], 500);
    }

    // Calculer le checksum du fichier
    $computedChecksum = hash_file('sha256', $fullPath);
    Log::info('Checksum reçu:', ['checksum' => $checksum]);
    Log::info('Checksum calculé Laravel:', ['computed' => $computedChecksum]);

    // Comparer avec celui reçu
    if ($computedChecksum !== $checksum) {
        return response()->json(['message' => 'Checksum invalide.'], 400);
    }

    // Enregistrer le fichier dans la base de données
    $fichier = FichierElectoral::create([
        'NomFichier' => $filename,
        'Checksum' => $computedChecksum,
        'Statut' => 'En attente',
        'EtatUploadElecteurs' => TRUE
    ]);

    // Lire et stocker les données du CSV dans la table temporaire
    try {
        $csv = Reader::createFromPath($fullPath, 'r');
        $csv->setHeaderOffset(0); // Utiliser la première ligne comme en-tête

        foreach ($csv as $record) {
            if (!ElecteurTemps::where('NumeroCarteElecteur', $record['NumeroCarteElecteur'])->exists()) {
                ElecteurTemps::create([
                    'NumeroCarteElecteur' => $record['NumeroCarteElecteur'],
                    'CIN' => $record['CIN'],
                    'Nom' => $record['Nom'],
                    'Prenom' => $record['Prenom'],
                    'DateNaissance' => $record['DateNaissance'],
                    'BureauVote' => $record['BureauVote'],
                    'Email' => $record['Email'],
                    'Telephone' => $record['Telephone'],
                    'IDFichier' => $fichier->id
                ]);
            }
        }
    } catch (\Exception $e) {
        Log::error('Erreur lors du traitement du fichier CSV:', ['error' => $e->getMessage()]);
        return response()->json(['message' => 'Erreur lors du traitement du fichier.'], 500);
    }

    return response()->json(['message' => 'Fichier importé et analysé avec succès ✅']);
});



Route::get('/verifier-fichier/{fichier_id}', function ($fichier_id) {
    $fichier = FichierElectoral::findOrFail($fichier_id);

    // Vérifier l'empreinte SHA256
    $checksum_bdd = DB::selectOne("SELECT HEX(Checksum) AS checksum FROM FichierElectoral WHERE id = ?", [$fichier_id])->Checksum;

    if ($checksum_bdd !== hash_file('sha256', storage_path('app/uploads/' . $fichier->NomFichier))) {
        return response()->json(['message' => 'Checksum invalide.'], 400);
    }

    return response()->json(['message' => 'Le fichier est valide.']);
});

Route::get('/electeurs/temp', function () {
    return response()->json(ElecteurTemps::all());
});

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
            'BureauVote' => $electeurTemps->BureauVote,
            'Email' => $electeurTemps->Email,
            'Telephone' => $electeurTemps->Telephone,
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