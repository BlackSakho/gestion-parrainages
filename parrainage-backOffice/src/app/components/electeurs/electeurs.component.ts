import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ElecteursService } from 'src/app/services/electeurs.service';
import { Electeur } from '../../models/electeur.model';

@Component({
  standalone: true,
  selector: 'app-electeurs',
  imports: [CommonModule],
  templateUrl: './electeurs.component.html',
  styleUrls: ['./electeurs.component.css']
})
export class ElecteursComponent implements OnInit {
  electeurs: Electeur[] = [];  // Typé avec le modèle Electeur

  constructor(
    private electeursService: ElecteursService,
    private snackBar: MatSnackBar  // Injection de MatSnackBar pour les notifications
  ) {}

  ngOnInit(): void {
    this.loadElecteurs();
  }

  // Méthode pour charger les électeurs
  loadElecteurs(): void {
    this.electeursService.getElecteursTemp().subscribe(
      (data: Electeur[]) => {
        this.electeurs = data;
      },
      error => {
        console.error('Erreur lors du chargement des électeurs', error);
        this.snackBar.open('Erreur lors du chargement des électeurs', 'Fermer', {
          duration: 3000
        });
      }
    );
  }

  // Méthode pour valider un électeur
  valider(id: number): void {
    this.electeursService.validerElecteur(id).subscribe(
      () => {
        this.loadElecteurs();
        this.snackBar.open('Électeur validé avec succès', 'Fermer', {
          duration: 3000
        });
      },
      error => {
        console.error('Erreur lors de la validation de l\'électeur', error);
        this.snackBar.open('Erreur lors de la validation de l\'électeur', 'Fermer', {
          duration: 3000
        });
      }
    );
  }

  // Méthode pour rejeter un électeur
  rejeter(id: number): void {
    const raison = prompt('Raison du rejet :');
    if (raison) {
      this.electeursService.rejeterElecteur(id, raison).subscribe(
        () => {
          this.loadElecteurs();
          this.snackBar.open('Électeur rejeté avec succès', 'Fermer', {
            duration: 3000
          });
        },
        error => {
          console.error('Erreur lors du rejet de l\'électeur', error);
          this.snackBar.open('Erreur lors du rejet de l\'électeur', 'Fermer', {
            duration: 3000
          });
        }
      );
    }
  }
}
