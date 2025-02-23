<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ElecteursProblematiques;

class ElecteursProblematiqueController extends Controller
{
    public function getElecteursProblematique($idFichier = null)
    {
        // 🔍 Si un IDFichier est fourni, on filtre les résultats
        if ($idFichier) {
            $problemes = ElecteursProblematiques::where('IDFichier', $idFichier)->get();
        } else {
            $problemes = ElecteursProblematiques::all();
        }

        // ✅ Retourner la liste des électeurs problématiques
        return response()->json($problemes);
    }
}
