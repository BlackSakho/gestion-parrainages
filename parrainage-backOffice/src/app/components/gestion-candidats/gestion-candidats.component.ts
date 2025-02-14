import { Component, OnInit } from '@angular/core';
import { GestionCandidatsService } from 'src/app/services/gestion-candidats.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-candidats',
  standalone: true,
  templateUrl: './gestion-candidats.component.html',
  styleUrls: ['./gestion-candidats.component.css'],
  imports: [CommonModule, FormsModule] // ✅ Ajouter CommonModule et FormsModule
})
export class GestionCandidatsComponent implements OnInit {
  candidats: any[] = [];
  nom = '';  // ✅ Déclarer les variables
  parti = '';

  constructor(private service: GestionCandidatsService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadCandidats();
  }

  loadCandidats() {
    this.service.getCandidats().subscribe(data => {
      this.candidats = data;
    });
  }

  ajouterCandidat() {  // ✅ Ajouter cette méthode
    const newCandidat = { nom: this.nom, parti_politique: this.parti };
    this.service.ajouterCandidat(newCandidat).subscribe(() => {
      this.snackBar.open('Candidat ajouté ✅', 'OK', { duration: 3000 });
      this.loadCandidats();
    });
  }

  supprimerCandidat(id: number) {
    this.service.supprimerCandidat(id).subscribe(() => {
      this.snackBar.open('Candidat supprimé ❌', 'OK', { duration: 3000 });
      this.loadCandidats();
    });
  }
}
