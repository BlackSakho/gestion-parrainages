<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidat extends Model
{
    use HasFactory;
    protected $table = 'Candidats';

    protected $fillable = [
        'NumeroCarteElecteur',
        'Nom',
        'Prenom',
        'DateNaissance',
        'Email',
        'Telephone',
        'PartiPolitique',
        'Slogan',
        'Photo',
        'Couleurs',
        'URL',
        'CodeSecurite'
    ];
}