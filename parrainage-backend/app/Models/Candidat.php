<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Candidat extends Authenticatable
{
    use HasFactory,  HasApiTokens ;
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
    protected $hidden = [

       'CodeSecurite',
    ];

    public function parrainages()
    {
        return $this->hasMany(Parrainage::class);
    }

    public function isCandidat()
    {
        return true; // Vous pouvez ajouter une logique supplémentaire ici si nécessaire
    }
}
