import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportationElecteursService } from '../../services/voter-upload.service';
import { electeursProblematiques } from '../../models/voter';

@Component({
  selector: 'app-voter-problems',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Électeurs Problématiques</h2>

        <div class="bg-white shadow-lg rounded-lg overflow-hidden">
          <div class="p-6">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CIN</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Électeur</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type d'Erreur</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr *ngFor="let erreur of electeursProblematiques">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ erreur.CIN }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ erreur.NumeroCarteElecteur }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600">{{ erreur.NatureProbleme }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      <button 
                        class="text-blue-600 hover:text-blue-800 mr-3"
                        (click)="corrigerElecteur(erreur)">
                        Corriger
                      </button>
                      <button 
                        class="text-red-600 hover:text-red-800"
                        (click)="supprimerElecteur(erreur)">
                        Supprimer
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div *ngIf="electeursProblematiques.length === 0" class="text-center py-8 text-gray-600">
              Aucun électeur problématique trouvé.
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class VoterProblemsComponent implements OnInit {
    electeursProblematiques: electeursProblematiques[] = [];
  
    constructor(private importationService: ImportationElecteursService) {}
  
    ngOnInit() {
      // Note: You'll need to implement a way to get the current fileId
      const fileId = localStorage.getItem('currentFileId');
      if (fileId) {
        this.loadElecteursProblematiques(fileId);
      } else {
        // Si pas de fileId, on charge tous les électeurs problématiques
        this.loadAllElecteursProblematiques();
      }
    }
  
    loadElecteursProblematiques(fileId: string) {
      this.importationService.getElecteursProblematiques(fileId)
        .subscribe({
          next: (electeurs) => {
            this.electeursProblematiques = electeurs;
          },
          error: (error) => {
            console.error('Erreur lors de la récupération des électeurs problématiques:', error);
          }
        });
    }
  
    loadAllElecteursProblematiques() {
      this.importationService.getElecteursProblematiques()
        .subscribe({
          next: (electeurs) => {
            this.electeursProblematiques = electeurs;
          },
          error: (error) => {
            console.error('Erreur lors de la récupération des électeurs problématiques:', error);
          }
        });
    }
  
    corrigerElecteur(erreur: electeursProblematiques) {
      // TODO: Implement correction logic
      console.log('Corriger électeur:', erreur);
    }
  
    supprimerElecteur(erreur: electeursProblematiques) {
      // TODO: Implement deletion logic
      console.log('Supprimer électeur:', erreur);
    }
  }