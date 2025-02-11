<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ElecteursProblematiques extends Model
{
    use HasFactory;

    protected $fillable = [
        'NumeroCarteElecteur', 'CIN', 'Nom', 'Prenom',
        'DateNaissance', 'BureauVote', 'Email', 'Telephone', 'Statut'
    ];
}