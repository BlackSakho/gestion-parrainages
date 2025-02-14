<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PeriodeParrainage extends Model
{
    use HasFactory;

    protected $table = 'periodes_parrainage';
    protected $fillable = ['etat'];

}