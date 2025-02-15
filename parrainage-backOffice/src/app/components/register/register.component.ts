import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, FormsModule]
})
export class RegisterComponent {
  users = {
    name: '',
    prenom: '',
    email: '',
    password: ''
  };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    console.log('Données envoyées:', this.users); // ✅ Ajoute ce log pour voir les valeurs

    if (!this.users.name || !this.users.prenom || !this.users.email || !this.users.password) {
      this.errorMessage = 'Tous les champs sont obligatoires ❌';
      return;
    }

    this.authService.register(this.users).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        this.errorMessage = 'Inscription échouée ❌';
        console.error('Erreur:', err);
      }
    });
  }
}
