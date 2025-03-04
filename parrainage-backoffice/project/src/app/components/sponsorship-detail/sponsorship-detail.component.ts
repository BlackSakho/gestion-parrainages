import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SponsorshipService } from '../../services/sponsorship.service';
import { Sponsorship, SponsorshipStats } from '../../models/sponsorship';

@Component({
  selector: 'app-sponsorship-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mx-auto p-4">
      <div *ngIf="candidateStats" class="mb-8">
        <h2 class="text-2xl font-bold mb-6">Parrainages de {{ candidateStats.candidateName }}</h2>
        
        <!-- Statistiques du candidat -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Total Parrainages</h3>
            <p class="text-3xl font-bold text-blue-600">{{ candidateStats.totalSponsors }}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Validés</h3>
            <p class="text-3xl font-bold text-green-600">{{ candidateStats.validatedSponsors }}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">En attente</h3>
            <p class="text-3xl font-bold text-yellow-600">{{ candidateStats.pendingSponsors }}</p>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-700 mb-2">Rejetés</h3>
            <p class="text-3xl font-bold text-red-600">{{ candidateStats.rejectedSponsors }}</p>
          </div>
        </div>

        <!-- Progression -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Progression</h3>
          <div class="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div class="bg-blue-600 h-4 rounded-full" 
                 [style.width]="getProgressPercentage() + '%'"></div>
          </div>
          <div class="flex justify-between text-sm text-gray-600">
            <span>{{ candidateStats.validatedSponsors }} validés</span>
            <span>Objectif: 10,000</span>
          </div>
        </div>

        <!-- Répartition géographique -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-4 bg-gray-50 border-b">
              <h3 class="text-lg font-semibold">Répartition par Région</h3>
            </div>
            <div class="p-4">
              <div *ngFor="let region of getRegions()" class="mb-4">
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-gray-700">{{ region.name }}</span>
                  <span class="text-sm font-medium text-gray-700">{{ region.count }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div class="bg-blue-600 h-2.5 rounded-full" 
                       [style.width]="(region.count / getMaxRegionCount()) * 100 + '%'"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-4 bg-gray-50 border-b">
              <h3 class="text-lg font-semibold">Répartition par Département</h3>
            </div>
            <div class="p-4">
              <div *ngFor="let dept of getDepartments()" class="mb-4">
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-gray-700">{{ dept.name }}</span>
                  <span class="text-sm font-medium text-gray-700">{{ dept.count }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div class="bg-blue-600 h-2.5 rounded-full" 
                       [style.width]="(dept.count / getMaxDepartmentCount()) * 100 + '%'"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Évolution temporelle -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div class="p-4 bg-gray-50 border-b">
            <h3 class="text-lg font-semibold">Évolution des Parrainages</h3>
          </div>
          <div class="p-4">
            <div class="h-64 flex items-end space-x-2">
              <div *ngFor="let day of candidateStats.dailyProgress" 
                   class="bg-blue-500 hover:bg-blue-600 transition-colors"
                   [style.height]="(day.count / getMaxDailyCount()) * 100 + '%'"
                   [style.width]="'calc(100% / ' + candidateStats.dailyProgress.length + ' - 4px)'">
                <div class="h-full flex flex-col justify-end p-1">
                  <span class="text-xs text-white font-bold">{{ day.count }}</span>
                </div>
              </div>
            </div>
            <div class="flex justify-between mt-2">
              <span class="text-xs text-gray-500">{{ getFirstDate() }}</span>
              <span class="text-xs text-gray-500">{{ getLastDate() }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Liste des parrainages -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-4 bg-gray-50 border-b flex justify-between items-center">
          <h3 class="text-lg font-semibold">Liste des Parrainages</h3>
          <div class="flex space-x-2">
            <select 
              class="border border-gray-300 rounded-md text-sm p-2"
              [(ngModel)]="statusFilter"
              (change)="applyFilters()">
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="validated">Validés</option>
              <option value="rejected">Rejetés</option>
            </select>
            <select 
              class="border border-gray-300 rounded-md text-sm p-2"
              [(ngModel)]="regionFilter"
              (change)="applyFilters()">
              <option value="all">Toutes les régions</option>
              <option *ngFor="let region of getRegions()" [value]="region.name">{{ region.name }}</option>
            </select>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Électeur</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Région</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Département</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let sponsorship of filteredSponsorships">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ sponsorship.voterElectorNumber }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ sponsorship.voterLastName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ sponsorship.voterFirstName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ sponsorship.region }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ sponsorship.department }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(sponsorship.date) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        [ngClass]="{
                          'bg-yellow-100 text-yellow-800': sponsorship.status === 'pending',
                          'bg-green-100 text-green-800': sponsorship.status === 'validated',
                          'bg-red-100 text-red-800': sponsorship.status === 'rejected'
                        }">
                    {{ getStatusLabel(sponsorship.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex space-x-2">
                    <button *ngIf="sponsorship.status === 'pending'"
                            (click)="validateSponsorship(sponsorship)"
                            class="text-green-600 hover:text-green-900">
                      Valider
                    </button>
                    <button *ngIf="sponsorship.status === 'pending'"
                            (click)="rejectSponsorship(sponsorship)"
                            class="text-red-600 hover:text-red-900">
                      Rejeter
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div *ngIf="filteredSponsorships.length === 0" class="p-6 text-center text-gray-500">
          Aucun parrainage trouvé avec les filtres sélectionnés.
        </div>
      </div>
    </div>
  `
})
export class SponsorshipDetailComponent implements OnInit {
  candidateId: string = '';
  candidateStats: SponsorshipStats | null = null;
  sponsorships: Sponsorship[] = [];
  filteredSponsorships: Sponsorship[] = [];
  statusFilter: string = 'all';
  regionFilter: string = 'all';
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private sponsorshipService: SponsorshipService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.candidateId = id;
        this.loadCandidateData();
      }
    });
  }

  loadCandidateData() {
    this.isLoading = true;
    
    // Charger les statistiques
    this.sponsorshipService.getSponsorshipStats(this.candidateId).subscribe({
      next: (stats) => {
        if (stats.length > 0) {
          this.candidateStats = stats[0];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
        this.isLoading = false;
        // Données de test
        this.candidateStats = this.getMockStats();
      }
    });
    
    // Charger les parrainages
    this.sponsorshipService.getSponsorships(this.candidateId).subscribe({
      next: (sponsorships) => {
        this.sponsorships = sponsorships;
        this.filteredSponsorships = [...sponsorships];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des parrainages:', error);
        this.isLoading = false;
        // Données de test
        this.sponsorships = this.getMockSponsorships();
        this.filteredSponsorships = [...this.sponsorships];
      }
    });
  }

  getProgressPercentage(): number {
    if (!this.candidateStats) return 0;
    
    // Objectif de 10,000 parrainages
    const percentage = (this.candidateStats.validatedSponsors / 10000) * 100;
    return Math.min(Math.round(percentage * 10) / 10, 100);
  }

  getRegions(): {name: string, count: number}[] {
    if (!this.candidateStats) return [];
    
    return Object.entries(this.candidateStats.byRegion)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  getDepartments(): {name: string, count: number}[] {
    if (!this.candidateStats) return [];
    
    return Object.entries(this.candidateStats.byDepartment)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  getMaxRegionCount(): number {
    const regions = this.getRegions();
    return regions.length > 0 ? regions[0].count : 1;
  }

  getMaxDepartmentCount(): number {
    const departments = this.getDepartments();
    return departments.length > 0 ? departments[0].count : 1;
  }

  getMaxDailyCount(): number {
    if (!this.candidateStats || this.candidateStats.dailyProgress.length === 0) return 1;
    
    return Math.max(...this.candidateStats.dailyProgress.map(day => day.count));
  }

  getFirstDate(): string {
    if (!this.candidateStats || this.candidateStats.dailyProgress.length === 0) return '';
    
    return this.formatDate(this.candidateStats.dailyProgress[0].date);
  }

  getLastDate(): string {
    if (!this.candidateStats || this.candidateStats.dailyProgress.length === 0) return '';
    
    const lastIndex = this.candidateStats.dailyProgress.length - 1;
    return this.formatDate(this.candidateStats.dailyProgress[lastIndex].date);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'En attente';
      case 'validated': return 'Validé';
      case 'rejected': return 'Rejeté';
      default: return status;
    }
  }

  applyFilters() {
    this.filteredSponsorships = this.sponsorships.filter(s => {
      // Filtre par statut
      const statusMatch = this.statusFilter === 'all' || s.status === this.statusFilter;
      
      // Filtre par région
      const regionMatch = this.regionFilter === 'all' || s.region === this.regionFilter;
      
      return statusMatch && regionMatch;
    });
  }

  validateSponsorship(sponsorship: Sponsorship) {
    this.sponsorshipService.validateSponsorship(sponsorship.id).subscribe({
      next: () => {
        // Mettre à jour le statut localement
        sponsorship.status = 'validated';
        
        // Mettre à jour les statistiques
        if (this.candidateStats) {
          this.candidateStats.validatedSponsors++;
          this.candidateStats.pendingSponsors--;
        }
        
        // Réappliquer les filtres
        this.applyFilters();
      },
      error: (error) => {
        console.error('Erreur lors de la validation du parrainage:', error);
        // Pour le développement, on simule quand même la validation
        sponsorship.status = 'validated';
        if (this.candidateStats) {
          this.candidateStats.validatedSponsors++;
          this.candidateStats.pendingSponsors--;
        }
        this.applyFilters();
      }
    });
  }

  rejectSponsorship(sponsorship: Sponsorship) {
    const reason = prompt('Motif du rejet:');
    if (reason === null) return; // L'utilisateur a annulé
    
    this.sponsorshipService.rejectSponsorship(sponsorship.id, reason).subscribe({
      next: () => {
        // Mettre à jour le statut localement
        sponsorship.status = 'rejected';
        
        // Mettre à jour les statistiques
        if (this.candidateStats) {
          this.candidateStats.rejectedSponsors++;
          this.candidateStats.pendingSponsors--;
        }
        
        // Réappliquer les filtres
        this.applyFilters();
      },
      error: (error) => {
        console.error('Erreur lors du rejet du parrainage:', error);
        // Pour le développement, on simule quand même le rejet
        sponsorship.status = 'rejected';
        if (this.candidateStats) {
          this.candidateStats.rejectedSponsors++;
          this.candidateStats.pendingSponsors--;
        }
        this.applyFilters();
      }
    });
  }

  // Données de test pour le développement
  private getMockStats(): SponsorshipStats {
    return {
      candidateId: this.candidateId,
      candidateName: 'Bassirou Diomaye Faye',
      totalSponsors: 8750,
      validatedSponsors: 7500,
      pendingSponsors: 1000,
      rejectedSponsors: 250,
      byRegion: {
        'Dakar': 3000,
        'Thiès': 1500,
        'Saint-Louis': 1200,
        'Ziguinchor': 800,
        'Kaolack': 750,
        'Diourbel': 500
      },
      byDepartment: {
        'Dakar': 2000,
        'Rufisque': 1000,
        'Thiès': 800,
        'Saint-Louis': 700,
        'Ziguinchor': 500,
        'Kaolack': 450
      },
      dailyProgress: [
        { date: '2025-01-01', count: 120 },
        { date: '2025-01-02', count: 150 },
        { date: '2025-01-03', count: 180 },
        { date: '2025-01-04', count: 200 },
        { date: '2025-01-05', count: 220 },
        { date: '2025-01-06', count: 250 },
        { date: '2025-01-07', count: 280 },
        { date: '2025-01-08', count: 300 },
        { date: '2025-01-09', count: 320 },
        { date: '2025-01-10', count: 350 },
        { date: '2025-01-11', count: 380 },
        { date: '2025-01-12', count: 400 },
        { date: '2025-01-13', count: 420 },
        { date: '2025-01-14', count: 450 }
      ]
    };
  }

  private getMockSponsorships(): Sponsorship[] {
    const regions = ['Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor', 'Kaolack', 'Diourbel'];
    const departments = ['Dakar', 'Rufisque', 'Thiès', 'Saint-Louis', 'Ziguinchor', 'Kaolack'];
    const statuses: ('pending' | 'validated' | 'rejected')[] = ['pending', 'validated', 'rejected'];
    
    const sponsorships: Sponsorship[] = [];
    
    for (let i = 1; i <= 50; i++) {
      const regionIndex = Math.floor(Math.random() * regions.length);
      const deptIndex = Math.floor(Math.random() * departments.length);
      const statusIndex = Math.floor(Math.random() * statuses.length);
      
      sponsorships.push({
        id: i.toString(),
        candidateId: this.candidateId,
        voterElectorNumber: `EL${100000 + i}`,
        voterFirstName: `Prénom${i}`,
        voterLastName: `Nom${i}`,
        region: regions[regionIndex],
        department: departments[deptIndex],
        date: new Date(2025, 0, Math.floor(Math.random() * 14) + 1).toISOString().split('T')[0],
        status: statuses[statusIndex]
      });
    }
    
    return sponsorships;
  }
}