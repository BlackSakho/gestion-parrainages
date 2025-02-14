<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FichierElectoral extends Model
{
    use HasFactory;

    protected $table = 'FichierElectoral';
    protected $fillable = [ 'NomFichier', 'Checksum', 'Statut', 'DateImportation', 'EtatUploadElecteurs'];
}