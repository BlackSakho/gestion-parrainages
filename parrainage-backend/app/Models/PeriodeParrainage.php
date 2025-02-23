<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PeriodeParrainage extends Model
{
    use HasFactory;
    protected $table = 'PeriodeParrainage';

    protected $fillable = [
        'DateDebut',
        'DateFin',
        'Active'
    ];

    protected $casts = [
        'DateDebut' => 'date',
        'DateFin' => 'date',
        'Active' => 'boolean'
    ];
}