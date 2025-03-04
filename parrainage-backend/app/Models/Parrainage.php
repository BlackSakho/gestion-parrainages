<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Parrainage extends Model
{
    use HasFactory;
    protected $table = 'Parrainages';

    protected $fillable = [
        'ElecteurID',
        'CandidatID',
        'CodeValidation'
    ];
    public function parrainages()
    {
        return $this->hasMany(Parrainage::class);
    }
}