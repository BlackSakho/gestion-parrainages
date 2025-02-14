import { Component, OnInit } from '@angular/core';
import { PeriodeParrainageService } from 'src/app/services/periode-parrainage.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-periode-parrainage',
  standalone: true,
  templateUrl: './periode-parrainage.component.html',
  styleUrls: ['./periode-parrainage.component.css']
})
export class PeriodeParrainageComponent implements OnInit {
  statut: string = '';

  constructor(private service: PeriodeParrainageService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadStatus();
  }

  // Récupérer l'état actuel de la période
  loadStatus(): void {
    this.service.getPeriodeStatus().subscribe(data => {
      this.statut = data.etat;
    });
  }

  // Ouvrir la période
  ouvrirPeriode(): void {
    this.service.ouvrirPeriode().subscribe(() => {
      this.statut = 'Ouvert';
      this.snackBar.open('Période ouverte ✅', 'OK', { duration: 3000 });
    });
  }

  // Fermer la période
  fermerPeriode(): void {
    this.service.fermerPeriode().subscribe(() => {
      this.statut = 'Fermé';
      this.snackBar.open('Période fermée ❌', 'OK', { duration: 3000 });
    });
  }
}
