<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FichierElectoral extends Model
{
    use HasFactory;

    protected $fillable = ['utilisateur_id', 'nom_fichier', 'checksum', 'statut'];
}