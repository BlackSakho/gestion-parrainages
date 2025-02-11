<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Electeur;
use App\Models\FichierElectoral;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\ElecteurTemp;
use League\Csv\Reader;
use App\Models\ElecteursProblematiques;

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

Route::get('/electeurs', function () {
    return response()->json(Electeur::all());
});
Route::post('/electeurs', function (Request $request) {
    $electeur = Electeur::create($request->all());
    return response()->json($electeur);
});

Route::post('/upload-electeurs', function (Request $request) {
    // Vérification de l’upload
    if (!$request->hasFile('file')) {
        return response()->json(['message' => 'Aucun fichier reçu.'], 400);
    }

    $file = $request->file('file');
    $filePath = $file->store('uploads');

    // Calcul du SHA256
    $checksum = hash_file('sha256', storage_path('app/' . $filePath));

    // Vérification si le fichier existe déjà
    if (FichierElectoral::whereRaw('checksum = UNHEX(?)', [$checksum])->exists()) {
        return response()->json(['message' => 'Fichier déjà importé.'], 400);
    }

    // Enregistrement du fichier
    $fichier = FichierElectoral::create([
        'utilisateur_id' => $request->user()->id,
        'nom_fichier' => $file->getClientOriginalName(),
        'checksum' => DB::raw("UNHEX('$checksum')"),
        'statut' => 'En attente'
    ]);

    return response()->json(['message' => 'Fichier importé avec succès !', 'fichier_id' => $fichier->id]);
});

Route::post('/process-electeurs/{fichier_id}', function ($fichier_id) {
    $fichier = FichierElectoral::findOrFail($fichier_id);

    // Lire le fichier CSV
    $filePath = storage_path('app/uploads/' . $fichier->nom_fichier);
    $csv = Reader::createFromPath($filePath, 'r');
    $csv->setHeaderOffset(0);

    $records = $csv->getRecords();

    // Insérer les électeurs dans la table temporaire
    foreach ($records as $record) {
        ElecteurTemp::create([
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

    // Mettre à jour le statut du fichier
    $fichier->update(['statut' => 'Validé']);

    return response()->json(['message' => 'Importation des électeurs réussie !']);
});

Route::get('/verifier-fichier/{fichier_id}', function ($fichier_id) {
    $fichier = FichierElectoral::findOrFail($fichier_id);

    // Vérifier l'empreinte SHA256
    $checksum_bdd = DB::selectOne("SELECT HEX(checksum) AS checksum FROM fichiers_electoraux WHERE id = ?", [$fichier_id])->checksum;

    if ($checksum_bdd !== hash_file('sha256', storage_path('app/uploads/' . $fichier->nom_fichier))) {
        return response()->json(['message' => 'Checksum invalide.'], 400);
    }

    return response()->json(['message' => 'Le fichier est valide.']);
});

Route::get('/electeurs/temp', function () {
    return response()->json(ElecteurTemp::all());
});

Route::post('/electeurs/valider/{id}', function ($id) {
    DB::transaction(function () use ($id) {
        // Récupérer l'électeur temporaire
        $electeurTemp = ElecteurTemp::findOrFail($id);

        // Insérer dans la table `electeurs`
        Electeur::create([
            'NumeroCarteElecteur' => $electeurTemp->NumeroCarteElecteur,
            'CIN' => $electeurTemp->CIN,
            'Nom' => $electeurTemp->Nom,
            'Prenom' => $electeurTemp->Prenom,
            'DateNaissance' => $electeurTemp->DateNaissance,
            'BureauVote' => $electeurTemp->BureauVote,
            'Email' => $electeurTemp->Email,
            'Telephone' => $electeurTemp->Telephone,
            'statut' => 'Validé'
        ]);

        // Supprimer de la table temporaire
        $electeurTemp->delete();
    });

    return response()->json(['message' => 'Électeur validé avec succès']);
});

Route::post('/electeurs/rejeter/{id}', function ($id, Request $request) {
    DB::transaction(function () use ($id, $request) {
        // Récupérer l'électeur temporaire
        $electeurTemp = ElecteurTemp::findOrFail($id);

        // Enregistrer dans la table `electeurs_problematiques`
        ElecteursProblematiques::create([
            'IDFichier' => $electeurTemp->IDFichier,
            'NumeroCarteElecteur' => $electeurTemp->NumeroCarteElecteur,
            'CIN' => $electeurTemp->cin,
            'NatureProbleme' => $request->input('raison')
        ]);

        // Supprimer de la table temporaire
        $electeurTemp->delete();
    });

    return response()->json(['message' => 'Électeur rejeté avec succès']);
});