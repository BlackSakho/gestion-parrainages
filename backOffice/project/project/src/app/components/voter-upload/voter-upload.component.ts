

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImportationElecteursService } from '../../services/voter-upload.service';
import { electeursProblematiques } from '../../models/voter';



@Component({
  selector: 'app-voter-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Gestion des Électeurs</h2>
        
        <!-- Upload Section -->
        <div class="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-6">
          <h3 class="text-xl font-semibold mb-4">Chargement du Fichier</h3>
          
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="checksum">
              Empreinte CHECKSUM (SHA256)
            </label>
            <input 
              class="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
              id="checksum"
              type="text"
              [value]="checksum"
              readonly
              placeholder="Le checksum sera généré automatiquement"
            >
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="file">
              Fichier CSV des électeurs
            </label>
            <div 
              class="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors"
              [class.border-blue-500]="isDragging"
              [class.border-gray-300]="!isDragging"
              [class.hover:border-blue-500]="!isDragging"
              (dragover)="onDragOver($event)"
              (dragleave)="onDragLeave($event)"
              (drop)="onDrop($event)"
            >
              <div class="space-y-1 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div class="flex text-sm text-gray-600">
                  <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    <span>Sélectionner un fichier</span>
                    <input 
                      id="file-upload"
                      type="file"
                      accept=".csv"
                      class="sr-only"
                      (change)="onFileSelected($event)"
                    >
                  </label>
                  <p class="pl-1">ou glisser-déposer</p>
                </div>
                <p class="text-xs text-gray-500">
                  CSV uniquement
                </p>
              </div>
            </div>
            <div *ngIf="selectedFile" class="mt-2 text-sm text-gray-600">
              Fichier sélectionné: {{ selectedFile.name }}
            </div>
          </div>

          <div class="flex items-center justify-between">
            <button 
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              (click)="uploadFile()"
              [disabled]="!selectedFile || !checksum || isProcessing"
            >
              {{ isProcessing ? 'Traitement en cours...' : 'Charger le fichier' }}
            </button>
          </div>

          <div *ngIf="uploadStatus" class="mt-4 p-4 rounded-lg" 
               [ngClass]="{'bg-green-100 text-green-700': uploadStatus.success, 'bg-red-100 text-red-700': !uploadStatus.success}">
            {{ uploadStatus.message }}
          </div>
        </div>

        <!-- Validation Section -->
        <div *ngIf="currentFileId" class="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-6">
          <h3 class="text-xl font-semibold mb-4">Validation des Électeurs</h3>
          
          <div class="space-y-4">
            <button 
              class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              (click)="validerElecteurs()"
              [disabled]="isValidating"
            >
              Vérifier les données
            </button>

            <button 
              *ngIf="validationComplete && !hasErrors"
              class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              (click)="validerImportation()"
              [disabled]="isValidating"
            >
              Valider l'importation
            </button>
          </div>
        </div>

        <!-- Problematic Voters Section -->
        <div *ngIf="electeursProblematiques.length > 0" class="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8">
          <h3 class="text-xl font-semibold mb-4 text-red-600">Électeurs Problématiques</h3>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CIN</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Électeur</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problème</th>
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
    </div>
  `
})
export class VoterUploadComponent {
  checksum: string = '';
  selectedFile: File | null = null;
  uploadStatus: { success: boolean; message: string } | null = null;
  currentFileId: string | null = null;
  isProcessing: boolean = false;
  isValidating: boolean = false;
  validationComplete: boolean = false;
  hasErrors: boolean = false;
  electeursProblematiques: electeursProblematiques[] = [];
  isDragging: boolean = false;

  constructor(private importationService: ImportationElecteursService) {}

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      this.selectedFile = file;
      this.uploadStatus = null;
      this.currentFileId = null;
      this.validationComplete = false;
      this.electeursProblematiques = [];
      
      // Générer le checksum
      this.checksum = await this.generateChecksum(file);
    } else {
      this.uploadStatus = {
        success: false,
        message: 'Veuillez sélectionner un fichier CSV valide'
      };
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  async onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'text/csv') {
        this.selectedFile = file;
        this.uploadStatus = null;
        this.currentFileId = null;
        this.validationComplete = false;
        this.electeursProblematiques = [];
        
        // Générer le checksum
        this.checksum = await this.generateChecksum(file);
      } else {
        this.uploadStatus = {
          success: false,
          message: 'Veuillez sélectionner un fichier CSV valide'
        };
      }
    }
  }

  async generateChecksum(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  uploadFile() {
    if (!this.selectedFile || !this.checksum) {
      this.uploadStatus = {
        success: false,
        message: 'Veuillez sélectionner un fichier et attendre la génération du checksum'
      };
      return;
    }

    this.isProcessing = true;
    this.importationService.uploadFichier(this.selectedFile, this.checksum)
      .subscribe({
        next: (response) => {
          this.uploadStatus = {
            success: true,
            message: 'Fichier chargé avec succès. Vous pouvez maintenant procéder à la validation.'
          };
          this.currentFileId = response.fileId;
          this.isProcessing = false;
        },
        error: (error) => {
          this.uploadStatus = {
            success: false,
            message: error.error.message || 'Une erreur est survenue lors du chargement du fichier'
          };
          this.isProcessing = false;
        }
      });
  }

  validerElecteurs() {
    if (!this.currentFileId) return;

    this.isValidating = true;
    this.importationService.validerElecteurs(this.currentFileId)
      .subscribe({
        next: (response) => {
          this.validationComplete = true;
          if (response.hasErrors) {
            this.hasErrors = true;
            this.getElecteursProblematiques();
          } else {
            this.hasErrors = false;
            this.uploadStatus = {
              success: true,
              message: 'Validation réussie. Vous pouvez maintenant procéder à l\'importation finale.'
            };
          }
          this.isValidating = false;
        },
        error: (error) => {
          this.uploadStatus = {
            success: false,
            message: error.error.message || 'Erreur lors de la validation des électeurs'
          };
          this.isValidating = false;
        }
      });
  }

  validerImportation() {
    if (!this.currentFileId) return;

    this.isValidating = true;
    this.importationService.validerImportation(this.currentFileId)
      .subscribe({
        next: (response) => {
          this.uploadStatus = {
            success: true,
            message: 'Importation validée avec succès'
          };
          // Réinitialiser le formulaire
          this.selectedFile = null;
          this.checksum = '';
          this.currentFileId = null;
          this.validationComplete = false;
          this.electeursProblematiques = [];
          this.isValidating = false;
        },
        error: (error) => {
          this.uploadStatus = {
            success: false,
            message: error.error.message || 'Erreur lors de la validation finale'
          };
          this.isValidating = false;
        }
      });
  }

  private getElecteursProblematiques() {
    if (!this.currentFileId) return;

    this.importationService.getElecteursProblematiques(this.currentFileId)
      .subscribe({
        next: (electeurs) => {
          this.electeursProblematiques = electeurs;
          this.uploadStatus = {
            success: false,
            message: 'Des erreurs ont été détectées dans le fichier. Veuillez corriger les problèmes listés ci-dessous.'
          };
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des électeurs problématiques:', error);
        }
      });
  }
}