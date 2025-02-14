<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoriqueUpload extends Model
{
    use HasFactory;
    protected $table = 'HistoriqueUpload';
    protected $fillable = ['UtilisateurID', 'AdresseIP', 'DateUpload', 'ClefUtilisee'];
}