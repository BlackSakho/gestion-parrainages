import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImportationElecteursService } from '../../services/voter-upload.service';

@Component({
  selector: 'app-voter-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Chargement du Fichier Électoral</h2>
        
        <div class="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="checksum">
              Empreinte CHECKSUM (SHA256)
            </label>
            <input 
              class="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="checksum"
              type="text"
              [(ngModel)]="checksum"
              placeholder="Entrez l'empreinte CHECKSUM"
            >
          </div>

          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="file">
              Fichier CSV des électeurs
            </label>
            <div class="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors">
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
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              (click)="uploadFile()"
              [disabled]="!selectedFile || !checksum"
              [ngClass]="{'opacity-50 cursor-not-allowed': !selectedFile || !checksum}"
            >
              Charger le fichier
            </button>
          </div>

          <div *ngIf="uploadStatus" class="mt-4 p-4 rounded-lg" 
               [ngClass]="{'bg-green-100 text-green-700': uploadStatus.success, 'bg-red-100 text-red-700': !uploadStatus.success}">
            {{ uploadStatus.message }}
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

  constructor(private importationService: ImportationElecteursService) {}

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      this.selectedFile = file;
      this.uploadStatus = null;
      
      // ✅ Génération automatique du checksum SHA-256
      this.checksum = await this.generateChecksum(file);
      console.log('Checksum généré (Angular) :', this.checksum);
      
    } else {
      this.uploadStatus = {
        success: false,
        message: 'Veuillez sélectionner un fichier CSV valide'
      };
    }
  }

  async generateChecksum(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hash = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  uploadFile() {
    if (!this.selectedFile || !this.checksum) {
      this.uploadStatus = {
        success: false,
        message: 'Veuillez sélectionner un fichier et attendre le calcul du checksum.'
      };
      return;
    }

    // Réinitialiser l'état avant le téléchargement
    this.uploadStatus = null;

    this.importationService.uploadFichier(this.selectedFile, this.checksum)
      .subscribe({
        next: (response) => {
          this.uploadStatus = {
            success: true,
            message: 'Fichier chargé avec succès. Validation en cours...'
          };
          // Réinitialiser le formulaire
          this.selectedFile = null;
          this.checksum = '';
        },
        error: (error) => {
          this.uploadStatus = {
            success: false,
            message: error.error.message || 'Une erreur est survenue lors du chargement du fichier'
          };
        }
      });
  }
}
