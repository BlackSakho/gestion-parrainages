import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profil',
  standalone: true,
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ProfilComponent implements OnInit {
  user = { name: '', prenom: '', email: '', password: '' };
  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    const headers = this.authService.getAuthHeaders();
    this.http.get<any>('http://127.0.0.1:8000/api/me', { headers }).subscribe({
      next: (data) => {
        this.user.name = data.name;
        this.user.prenom = data.prenom;
        this.user.email = data.email;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des informations ❌';
      }
    });
  }

  updateProfile() {
    const headers = this.authService.getAuthHeaders();
    this.http.put('http://127.0.0.1:8000/api/profil/update', this.user, { headers }).subscribe({
      next: () => {
        this.successMessage = 'Profil mis à jour avec succès ✅';
      },
      error: () => {
        this.errorMessage = 'Échec de la mise à jour ❌';
      }
    });
  }
}
