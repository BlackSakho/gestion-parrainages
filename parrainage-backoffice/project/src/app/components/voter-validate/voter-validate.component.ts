import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportationElecteursService } from '../../services/voter-upload.service';
import { electeursProblematiques, ElecteursTemp } from '../../models/voter';

@Component({
  selector: 'app-voter-validate',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Validation des Électeurs</h2>

        <!-- Liste des électeurs en attente de validation -->
        <div class="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h3 class="text-lg font-semibold mb-4 text-blue-600">Électeurs en attente de validation</h3>
          
          <div *ngIf="electeursTemps.length === 0" class="text-gray-500">
            Aucun électeur à valider.
          </div>

          <div *ngIf="electeursTemps.length > 0" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CIN</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Électeur</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de Naissance</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commune</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bureau de Vote</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lieu de Naissance</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sexe</th>
                  
                  

                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let electeur of electeursTemps">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ electeur.CIN }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ electeur.NumeroCarteElecteur }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ electeur.Nom }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ electeur.Prenom }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ electeur.DateNaissance }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ electeur.Commune }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ electeur.BureauVote }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ electeur.lieuDeNaissance }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ electeur.Sexe }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Bouton pour contrôler les électeurs -->
        <div class="flex space-x-4">
         
          
          <button 
           
            (click)="validerImportation()"
            [disabled]="isProcessing"
            class="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            Valider l'importation
          </button>
        </div>

        <!-- Status Messages -->
        <div *ngIf="statusMessage" class="mt-4 p-4 rounded-lg" 
             [ngClass]="{'bg-green-100 text-green-700': !hasErrors, 'bg-red-100 text-red-700': hasErrors}">
          {{ statusMessage }}
        </div>

      </div>
    </div>
  `
})
export class VoterValidateComponent implements OnInit {
  isProcessing: boolean = false;
  validationComplete: boolean = false;
  hasErrors: boolean = false;
  statusMessage: string | null = null;
  electeursTemps: ElecteursTemp[] = [];

  constructor(private importationService: ImportationElecteursService) {}

  ngOnInit() {
    this.loadElecteursTemps();
  }

  loadElecteursTemps() {
    this.importationService.getElecteursEnAttente()
      .subscribe({
        next: (electeurs) => {
          this.electeursTemps = electeurs;
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des électeurs en attente:', error);
        }
      });
  }

  controlerElecteurs() {
    this.isProcessing = true;
    this.statusMessage = 'Vérification des électeurs en cours...';
  
    this.importationService.validerElecteurs()
      .subscribe({
        next: (response: { hasErrors?: boolean, message?: string }) => {
          console.log("Réponse API:", response);
          this.validationComplete = true;
  
          if (response.hasErrors === true) {  // ✅ Vérification explicite
            this.hasErrors = true;
            this.statusMessage = response.message || 'Des erreurs ont été détectées. Veuillez corriger les problèmes.';
          } else {
            this.hasErrors = false;
            this.statusMessage = response.message || 'Validation réussie. Vous pouvez procéder à l\'importation finale.';
          }
  
          this.isProcessing = false;
          this.loadElecteursTemps(); // ✅ Recharger les électeurs en attente
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.statusMessage = error.error?.message || 'Une erreur est survenue lors de la validation';
          this.isProcessing = false;
        }
      });
  }
  

  validerImportation() {          
    this.isProcessing = true;
    this.statusMessage = 'Validation finale en cours...';

    this.importationService.validerImportation()
      .subscribe({
        next: () => {
          this.statusMessage = '✅ Importation validée avec succès';
          this.isProcessing = false;
          this.validationComplete = false;
          this.loadElecteursTemps();
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.statusMessage = error.error.message || '❌ Erreur lors de la validation finale';
          this.isProcessing = false;
        }
      });
  }
}
