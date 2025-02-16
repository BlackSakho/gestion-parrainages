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
  imports: [CommonModule, FormsModule] // ✅ Ajout de FormsModule pour ngModel
})
export class RegisterComponent {
  user = { name: '', prenom: '', email: '', password: '' };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    if (!this.user.name || !this.user.prenom || !this.user.email || !this.user.password) {
      this.errorMessage = 'Tous les champs sont obligatoires ❌';
      return;
    }

    this.authService.register(this.user).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => {
        this.errorMessage = 'Inscription échouée ❌';
      }
    });
  }
}
