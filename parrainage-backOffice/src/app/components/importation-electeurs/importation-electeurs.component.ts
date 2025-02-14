import { Component } from '@angular/core';
import { ImportationElecteursService } from 'src/app/services/importation-electeurs.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-importation-electeurs',
  standalone: true,
  templateUrl: './importation-electeurs.component.html',
  styleUrls: ['./importation-electeurs.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ImportationElecteursComponent {
  fichier!: File;
  checksum = '';

  constructor(private service: ImportationElecteursService, private snackBar: MatSnackBar) {}

  async onFileSelected(event: any) {
    this.fichier = event.target.files[0];

    if (this.fichier) {
      this.checksum = await this.calculateSHA256(this.fichier);
      console.log('Checksum généré:', this.checksum);
    }
  }

  async calculateSHA256(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  uploadFichier() {
    if (this.fichier && this.checksum) {
      this.service.uploadFichier(this.fichier, this.checksum).subscribe({
        next: () => {
          this.snackBar.open('Fichier importé et validé ✅', 'OK', { duration: 3000 });
        },
        error: (err) => {
          console.error('Erreur:', err);
          this.snackBar.open('Échec de l’importation ❌', 'OK', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Veuillez sélectionner un fichier et saisir le checksum.', 'OK', { duration: 3000 });
    }
  }
}
