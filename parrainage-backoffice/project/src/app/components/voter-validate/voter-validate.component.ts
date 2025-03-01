import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportationElecteursService } from '../../services/voter-upload.service';
import { electeursProblematiques } from '../../models/voter';

@Component({
  selector: 'app-voter-validate',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Validation des Électeurs</h2>

        <!-- Fichier en cours -->
        <div *ngIf="currentFileId" class="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h3 class="text-lg font-semibold mb-4">Fichier en cours de traitement</h3>
          <div class="flex space-x-4">
            <button 
              (click)="controlerElecteurs()"
              [disabled]="isProcessing"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {{ isProcessing ? 'Vérification en cours...' : 'Contrôler les électeurs' }}
            </button>
            
            <button 
              *ngIf="validationComplete && !hasErrors"
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

        <!-- Liste des erreurs -->
        <div *ngIf="electeursProblematiques.length > 0" class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-4 text-red-600">Électeurs Problématiques</h3>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CIN</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Électeur</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type d'Erreur</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr *ngFor="let erreur of electeursProblematiques">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ erreur.CIN }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ erreur.NumeroCarteElecteur }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600">{{ erreur.NatureProbleme }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- No File Message -->
        <div *ngIf="!currentFileId" class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">
                Aucun fichier en cours de traitement. Veuillez d'abord charger un fichier d'électeurs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VoterValidateComponent implements OnInit {
    currentFileId: string | null = null;
    isProcessing: boolean = false;
    validationComplete: boolean = false;
    hasErrors: boolean = false;
    statusMessage: string | null = null;
    electeursProblematiques: electeursProblematiques[] = [];
  
    constructor(private importationService: ImportationElecteursService) {}
  
    ngOnInit() {
      // Récupérer l'ID du fichier en cours depuis le localStorage
      this.currentFileId = localStorage.getItem('currentFileId');
      if (this.currentFileId) {
        this.loadElecteursProblematiques();
      }
    }
  
    controlerElecteurs() {
      if (!this.currentFileId) return;
  
      this.isProcessing = true;
      this.statusMessage = 'Vérification des électeurs en cours...';
  
      this.importationService.validerElecteurs(this.currentFileId)
        .subscribe({
          next: (response) => {
            this.validationComplete = true;
            if (response.hasErrors) {
              this.hasErrors = true;
              this.statusMessage = 'Des erreurs ont été détectées. Veuillez corriger les problèmes avant de continuer.';
              this.loadElecteursProblematiques();
            } else {
              this.hasErrors = false;
              this.statusMessage = 'Validation réussie. Vous pouvez maintenant procéder à l\'importation finale.';
              this.electeursProblematiques = [];
            }
            this.isProcessing = false;
          },
          error: (error) => {
            this.statusMessage = error.error.message || 'Une erreur est survenue lors de la validation';
            this.isProcessing = false;
          }
        });
    }
  
    validerImportation() {
      if (!this.currentFileId) return;
  
      this.isProcessing = true;
      this.statusMessage = 'Validation finale en cours...';
  
      this.importationService.validerImportation(this.currentFileId)
        .subscribe({
          next: () => {
            this.statusMessage = 'Importation validée avec succès';
            this.isProcessing = false;
            // Réinitialiser l'état
            localStorage.removeItem('currentFileId');
            this.currentFileId = null;
            this.validationComplete = false;
            this.electeursProblematiques = [];
          },
          error: (error) => {
            this.statusMessage = error.error.message || 'Une erreur est survenue lors de la validation finale';
            this.isProcessing = false;
          }
        });
    }
  
    private loadElecteursProblematiques() {
      if (!this.currentFileId) return;
  
      this.importationService.getElecteursProblematiques(this.currentFileId)
        .subscribe({
          next: (electeurs) => {
            this.electeursProblematiques = electeurs;
          },
          error: (error) => {
            console.error('Erreur lors de la récupération des électeurs problématiques:', error);
          }
        });
    }
  }