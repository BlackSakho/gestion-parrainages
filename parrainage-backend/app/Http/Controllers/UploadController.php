<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Models\ElecteursProblematiques;
use Illuminate\Http\Request;
use App\Models\ElecteurTemps;
use App\Models\Electeurs;
use App\Models\FichierElectoral;
use App\Models\HistoriqueUpload;
use Illuminate\Support\Facades\Auth;
use League\Csv\Reader;

class UploadController extends Controller
{
    public function upload(Request $request)
    {
        DB::beginTransaction();
        try {
            if (!$request->hasFile('file') || !$request->has('checksum')) {
                throw new \Exception('Fichier ou checksum manquant.');
            }

            $file = $request->file('file');
            $checksum = $request->input('checksum');
            $user = Auth::user();

            // 1️⃣ Vérification du type et de la taille du fichier
            if ($file->getClientOriginalExtension() !== 'csv') {
                throw new \Exception('Format de fichier invalide. Seul le CSV est accepté.');
            }

            if ($file->getSize() > 2048000) { // 2 Mo max
                throw new \Exception('Le fichier est trop volumineux.');
            }

            // 2️⃣ Vérification du fichier (checksum + encodage)
            if (!$this->ControlerFichierElecteurs($file, $checksum, $user)) {
                throw new \Exception('Échec du contrôle du fichier.');
            }

            // 3️⃣ Stocker le fichier
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('public', $filename);
            $fullPath = storage_path("app/public/$filename");

            if (!file_exists($fullPath)) {
                throw new \Exception('Le fichier n’a pas été correctement enregistré.');
            }

            // 4️⃣ Enregistrer le fichier dans la base de données
            $computedChecksum = hash_file('sha256', $fullPath);
            $fichier = FichierElectoral::create([
                'NomFichier' => $filename,
                'Checksum' => $computedChecksum,
                'Statut' => 'En attente',
                'EtatUploadElecteurs' => true,

            ]);

            $idFichier = $fichier->id;
            Log::info('IDFichier enregistré:', ['IDFichier' => $fichier]);

            // 5️⃣ Lire et stocker les données du CSV
            $csv = Reader::createFromPath($fullPath, 'r');
            $csv->setHeaderOffset(0);

            foreach ($csv as $record) {
                ElecteurTemps::create([
                    'NumeroCarteElecteur' => $record['NumeroCarteElecteur'],
                    'CIN' => $record['CIN'],
                    'Nom' => $record['Nom'],
                    'Prenom' => $record['Prenom'],
                    'DateNaissance' => $record['DateNaissance'],
                    'Commune' => $record['Commune'],
                    'BureauVote' => $record['BureauVote'],
                    'IDFichier' =>  $fichier->id,
                    'LieuDeNaissance' => $record['LieuDeNaissance'],
                    'Sexe' => $record['Sexe']
                ]);
            }

            // 6️⃣ Exécuter `ControlerElecteurs` et `ValiderImportation`
            $this->ControlerElecteurs($idFichier);
            $problemes = ElecteursProblematiques::where('IDFichier', $idFichier)->count();

            if ($problemes === 0) {
                $this->ValiderImportation();
            } else {
                Log::info("Fichier $idFichier contient des erreurs ❌");
            }

            DB::commit();
            return response()->json(['message' => 'Importation terminée ✅']);

        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Erreur lors de l\'importation : ' . $e->getMessage());

            $this->EnregistrerEchecUpload($user, $checksum, $e->getMessage());

            return response()->json(['message' => 'Erreur ❌', 'error' => $e->getMessage()], 500);
        }
    }

    private function ControlerFichierElecteurs($file, $checksum, $user)
    {
        $computedChecksum = hash_file('sha256', $file->path());
        Log::info('Vérification du checksum', ['checksum_attendu' => $checksum, 'checksum_calculé' => $computedChecksum]);

        if ($computedChecksum !== strtolower($checksum)) {
            Log::error('Erreur de checksum', ['checksum_attendu' => $checksum, 'checksum_recu' => $computedChecksum]);
            $this->EnregistrerEchecUpload($user, $checksum, 'Checksum invalide');
            return false;
        }

        $content = file_get_contents($file->path());
        Log::info('Vérification de l\'encodage', ['fichier' => $file->getClientOriginalName(), 'encodage' => mb_detect_encoding($content)]);

        if (!mb_check_encoding($content, 'UTF-8')) {
            Log::error('Erreur d’encodage', ['fichier' => $file->getClientOriginalName()]);
            $this->EnregistrerEchecUpload($user, $checksum, 'Fichier non encodé en UTF-8');
            return false;
        }

        return true;
    }

    private function EnregistrerEchecUpload($user, $checksum, $message)
    {
        HistoriqueUpload::create([
            'UtilisateurID' => $user->id ?? null,
            'AdresseIP' => request()->ip(),
            'ClefUtilisee' => $checksum,
            'Message' => $message
        ]);
    }


    public function ControlerElecteurs($idFichier) {
        $electeurs = DB::table('ElecteurTemps')->where('IDFichier', $idFichier)->get();

        foreach ($electeurs as $electeur) {
            $problemes = [];

            // 1️⃣ Vérifier le format de la CIN (13 ou 14 chiffres)
            if (!preg_match('/^\d{13,14}$/', $electeur->CIN)) {
                $problemes[] = "CIN invalide (doit contenir 13 ou 14 chiffres)";
            }

            // 2️⃣ Vérifier le format du Numéro de Carte Électeur (9 ou 10 chiffres)
            if (!preg_match('/^\d{9,10}$/', $electeur->NumeroCarteElecteur)) {
                $problemes[] = "Numéro de carte électeur invalide (doit contenir 9 ou 10 chiffres)";
            }

            // 3️⃣ Vérifier la complétude des données
            if (empty($electeur->Nom) || empty($electeur->Prenom) || empty($electeur->DateNaissance)) {
                $problemes[] = "Données incomplètes (Nom, Prénom et Date de naissance requis)";
            }

            // 4️⃣ Vérifier que les noms et prénoms ne contiennent pas d’accents
            if ($this->contientAccents($electeur->Nom) || $this->contientAccents($electeur->Prenom)) {
                $problemes[] = "Nom ou prénom contient des accents";
            }

            // 5️⃣ Vérifier l’encodage UTF-8
            if (!mb_check_encoding($electeur->Nom, 'UTF-8') || !mb_check_encoding($electeur->Prenom, 'UTF-8')) {
                $problemes[] = "Encodage invalide (doit être en UTF-8)";
            }

            // 🔥 Enregistrer les erreurs dans `ElecteursProblematique`
            if (!empty($problemes)) {
                ElecteursProblematiques::create([
                    'IDFichier' => $idFichier,
                    'NumeroCarteElecteur' => $electeur->NumeroCarteElecteur,
                    'CIN' => $electeur->CIN,
                    'NatureProbleme' => implode("; ", $problemes)
                ]);
            }
        }
    }

    // ✅ Fonction pour vérifier la présence d’accents
    private function contientAccents($texte) {
        return preg_match('/[ÀÁÂÃÄÅàáâãäåÈÉÊËèéêëÌÍÎÏìíîïÒÓÔÕÖØòóôõöøÙÚÛÜùúûüÝŸýÿÇç]/', $texte);
    }

    public function ValiderImportation()
    {
        DB::beginTransaction();
        try {
            // Vérifier s’il y a encore des électeurs problématiques
            $problemes = DB::table('ElecteursProblematiques')->count();
            if ($problemes > 0) {
                return response()->json(['message' => '❌ Des erreurs existent encore. Corrigez-les avant validation.'], 400);
            }

            // Vérifier s’il y a des électeurs à valider
            $electeursCount = DB::table('ElecteurTemps')->count();
            if ($electeursCount == 0) {
                return response()->json(['message' => '⚠️ Aucun électeur valide à importer.'], 400);
            }

            // Transférer les électeurs valides de `ElecteurTemps` vers `Electeurs`
            DB::table('Electeurs')->insertUsing([
                'NumeroCarteElecteur', 'CIN', 'Nom', 'Prenom', 'DateNaissance',
                'Commune', 'BureauVote', 'LieuDeNaissance', 'Sexe'
            ], DB::table('ElecteurTemps')->select([
                'NumeroCarteElecteur', 'CIN', 'Nom', 'Prenom', 'DateNaissance',
                'Commune', 'BureauVote', 'LieuDeNaissance', 'Sexe'
            ]));

            // Supprimer les électeurs validés de `ElecteurTemps`
            DB::table('ElecteurTemps')->delete();

            DB::commit();
            return response()->json(['message' => '✅ Importation validée avec succès !']);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => '❌ Erreur lors de la validation', 'error' => $e->getMessage()], 500);
        }
    }


}