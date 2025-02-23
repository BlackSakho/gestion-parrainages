<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ElecteurTemps extends Model
{
    use HasFactory;

    protected $table = 'electeurtemps';

    protected $fillable = [
        'NumeroCarteElecteur', 'CIN', 'Nom', 'Prenom',
        'DateNaissance','Commune', 'BureauVote', 'IDFichier', 'LieuDeNaissance', 'Sexe'
    ];
}