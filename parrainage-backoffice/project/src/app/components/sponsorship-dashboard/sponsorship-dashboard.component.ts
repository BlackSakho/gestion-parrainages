import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SponsorshipService } from '../../services/sponsorship.service';
import { SponsorshipStats } from '../../models/sponsorship';

@Component({
  selector: 'app-sponsorship-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-6">Tableau de Bord des Parrainages</h2>

      <!-- Statistiques globales -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Total Parrainages</h3>
          <p class="text-3xl font-bold text-blue-600">{{ getTotalSponsors() }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Validés</h3>
          <p class="text-3xl font-bold text-green-600">{{ getTotalValidatedSponsors() }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">En attente</h3>
          <p class="text-3xl font-bold text-yellow-600">{{ getTotalPendingSponsors() }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Rejetés</h3>
          <p class="text-3xl font-bold text-red-600">{{ getTotalRejectedSponsors() }}</p>
        </div>
      </div>

      <!-- Tableau des candidats -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div class="p-4 bg-gray-50 border-b">
          <h3 class="text-lg font-semibold">Statistiques par Candidat</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidat</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validés</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">En attente</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rejetés</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progression</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let stat of sponsorshipStats">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-medium text-gray-900">{{ stat.candidateName }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-gray-900">{{ stat.totalSponsors }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-green-600">{{ stat.validatedSponsors }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-yellow-600">{{ stat.pendingSponsors }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-red-600">{{ stat.rejectedSponsors }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div class="bg-blue-600 h-2.5 rounded-full" 
                         [style.width]="getProgressPercentage(stat) + '%'"></div>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">{{ getProgressPercentage(stat) }}% (Objectif: 10,000)</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <a [routerLink]="['/sponsorships/candidate', stat.candidateId]" 
                     class="text-blue-600 hover:text-blue-900">Détails</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Répartition géographique -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-4 bg-gray-50 border-b">
            <h3 class="text-lg font-semibold">Répartition par Région</h3>
          </div>
          <div class="p-4">
            <div *ngFor="let region of getTopRegions()" class="mb-4">
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
            <div *ngFor="let dept of getTopDepartments()" class="mb-4">
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
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-4 bg-gray-50 border-b">
          <h3 class="text-lg font-semibold">Évolution des Parrainages</h3>
        </div>
        <div class="p-4">
          <div class="h-64 flex items-end space-x-2">
            <div *ngFor="let day of getDailyProgress()" 
                 class="bg-blue-500 hover:bg-blue-600 transition-colors"
                 [style.height]="(day.count / getMaxDailyCount()) * 100 + '%'"
                 [style.width]="'calc(100% / ' + getDailyProgress().length + ' - 4px)'">
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
  `
})
export class SponsorshipDashboardComponent implements OnInit {
  sponsorshipStats: SponsorshipStats[] = [];
  isLoading = true;

  constructor(private sponsorshipService: SponsorshipService) {}

  ngOnInit() {
    this.loadSponsorshipStats();
  }

  loadSponsorshipStats() {
    this.isLoading = true;
    this.sponsorshipService.getSponsorshipStats().subscribe({
      next: (stats) => {
        this.sponsorshipStats = stats;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
        this.isLoading = false;
        
        // Données de test en cas d'erreur
        this.sponsorshipStats = this.getMockData();
      }
    });
  }

  getTotalSponsors(): number {
    return this.sponsorshipStats.reduce((sum, stat) => sum + stat.totalSponsors, 0);
  }

  getTotalValidatedSponsors(): number {
    return this.sponsorshipStats.reduce((sum, stat) => sum + stat.validatedSponsors, 0);
  }

  getTotalPendingSponsors(): number {
    return this.sponsorshipStats.reduce((sum, stat) => sum + stat.pendingSponsors, 0);
  }

  getTotalRejectedSponsors(): number {
    return this.sponsorshipStats.reduce((sum, stat) => sum + stat.rejectedSponsors, 0);
  }

  getProgressPercentage(stat: SponsorshipStats): number {
    // Objectif de 10,000 parrainages
    const percentage = (stat.validatedSponsors / 10000) * 100;
    return Math.min(Math.round(percentage * 10) / 10, 100);
  }

  getTopRegions(): {name: string, count: number}[] {
    const regions: {[key: string]: number} = {};
    
    this.sponsorshipStats.forEach(stat => {
      Object.entries(stat.byRegion).forEach(([region, count]) => {
        regions[region] = (regions[region] || 0) + count;
      });
    });
    
    return Object.entries(regions)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  getTopDepartments(): {name: string, count: number}[] {
    const departments: {[key: string]: number} = {};
    
    this.sponsorshipStats.forEach(stat => {
      Object.entries(stat.byDepartment).forEach(([dept, count]) => {
        departments[dept] = (departments[dept] || 0) + count;
      });
    });
    
    return Object.entries(departments)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  getMaxRegionCount(): number {
    const regions = this.getTopRegions();
    return regions.length > 0 ? regions[0].count : 1;
  }

  getMaxDepartmentCount(): number {
    const departments = this.getTopDepartments();
    return departments.length > 0 ? departments[0].count : 1;
  }

  getDailyProgress(): {date: string, count: number}[] {
    // Fusionner les données quotidiennes de tous les candidats
    const dailyData: {[date: string]: number} = {};
    
    this.sponsorshipStats.forEach(stat => {
      stat.dailyProgress.forEach(day => {
        dailyData[day.date] = (dailyData[day.date] || 0) + day.count;
      });
    });
    
    return Object.entries(dailyData)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-14); // Derniers 14 jours
  }

  getMaxDailyCount(): number {
    const dailyProgress = this.getDailyProgress();
    if (dailyProgress.length === 0) return 1;
    
    return Math.max(...dailyProgress.map(day => day.count));
  }

  getFirstDate(): string {
    const dailyProgress = this.getDailyProgress();
    if (dailyProgress.length === 0) return '';
    
    return this.formatDate(dailyProgress[0].date);
  }

  getLastDate(): string {
    const dailyProgress = this.getDailyProgress();
    if (dailyProgress.length === 0) return '';
    
    return this.formatDate(dailyProgress[dailyProgress.length - 1].date);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  }

  // Données de test pour le développement
  private getMockData(): SponsorshipStats[] {
    return [
      {
        candidateId: '1',
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
      },
      {
        candidateId: '2',
        candidateName: 'Marie Diop',
        totalSponsors: 6200,
        validatedSponsors: 5000,
        pendingSponsors: 1000,
        rejectedSponsors: 200,
        byRegion: {
          'Dakar': 2000,
          'Thiès': 1200,
          'Saint-Louis': 900,
          'Ziguinchor': 600,
          'Kaolack': 500,
          'Diourbel': 400
        },
        byDepartment: {
          'Dakar': 1500,
          'Rufisque': 500,
          'Thiès': 700,
          'Saint-Louis': 500,
          'Ziguinchor': 400,
          'Kaolack': 300
        },
        dailyProgress: [
          { date: '2025-01-01', count: 80 },
          { date: '2025-01-02', count: 100 },
          { date: '2025-01-03', count: 120 },
          { date: '2025-01-04', count: 140 },
          { date: '2025-01-05', count: 160 },
          { date: '2025-01-06', count: 180 },
          { date: '2025-01-07', count: 200 },
          { date: '2025-01-08', count: 220 },
          { date: '2025-01-09', count: 240 },
          { date: '2025-01-10', count: 260 },
          { date: '2025-01-11', count: 280 },
          { date: '2025-01-12', count: 300 },
          { date: '2025-01-13', count: 320 },
          { date: '2025-01-14', count: 340 }
        ]
      },
      {
        candidateId: '3',
        candidateName: 'Amadou Sow',
        totalSponsors: 4500,
        validatedSponsors: 3500,
        pendingSponsors: 800,
        rejectedSponsors: 200,
        byRegion: {
          'Dakar': 1500,
          'Thiès': 900,
          'Saint-Louis': 700,
          'Ziguinchor': 500,
          'Kaolack': 400,
          'Diourbel': 300
        },
        byDepartment: {
          'Dakar': 1000,
          'Rufisque': 500,
          'Thiès': 600,
          'Saint-Louis': 400,
          'Ziguinchor': 300,
          'Kaolack': 200
        },
        dailyProgress: [
          { date: '2025-01-01', count: 60 },
          { date: '2025-01-02', count: 80 },
          { date: '2025-01-03', count: 100 },
          { date: '2025-01-04', count: 120 },
          { date: '2025-01-05', count: 140 },
          { date: '2025-01-06', count: 160 },
          { date: '2025-01-07', count: 180 },
          { date: '2025-01-08', count: 200 },
          { date: '2025-01-09', count: 220 },
          { date: '2025-01-10', count: 240 },
          { date: '2025-01-11', count: 260 },
          { date: '2025-01-12', count: 280 },
          { date: '2025-01-13', count: 300 },
          { date: '2025-01-14', count: 320 }
        ]
      }
    ];
  }
}