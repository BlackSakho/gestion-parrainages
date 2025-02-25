import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParrainageService } from '../../services/parrainage.service';

@Component({
  selector: 'app-schedule-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Gestion des Périodes de Parrainage</h2>

      <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="startDate">
            Date de Début
          </label>
          <input 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="startDate"
            type="date"
            [(ngModel)]="startDate">
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="endDate">
            Date de Fin
          </label>
          <input 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="endDate"
            type="date"
            [(ngModel)]="endDate">
        </div>

        <div class="flex items-center justify-between">
          <button 
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            (click)="saveSchedule()">
            Enregistrer les dates
          </button>
        </div>

        <div *ngIf="message" class="mt-4 p-4 rounded-lg" 
             [ngClass]="{'bg-green-100 text-green-700': success, 'bg-red-100 text-red-700': !success}">
          {{ message }}
        </div>
      </div>
    </div>
  `
})
export class ScheduleManagementComponent {
  startDate: string = '';
  endDate: string = '';
  message: string | null = null;
  success: boolean = false;

  constructor(private parrainageService: ParrainageService) {}

  saveSchedule() {
    if (!this.startDate || !this.endDate) {
      this.message = 'Veuillez sélectionner les dates de début et de fin';
      this.success = false;
      return;
    }

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

    if (start >= end) {
      this.message = 'La date de début doit être antérieure à la date de fin';
      this.success = false;
      return;
    }

    if (start < sixMonthsFromNow) {
      this.message = 'La date de début doit être supérieure à 6 mois par rapport à la date actuelle';
      this.success = false;
      return;
    }

    // 🔥 Appel API pour enregistrer la période
    this.parrainageService.enregistrerPeriode(this.startDate, this.endDate).subscribe({
      next: (response) => {
        this.message = response.message;
        this.success = true;
      },
      error: (error) => {
        this.message = error.error.message || 'Une erreur est survenue';
        this.success = false;
      }
    });
  }
}
