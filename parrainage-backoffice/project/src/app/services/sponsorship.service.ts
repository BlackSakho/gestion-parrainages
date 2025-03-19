import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Sponsorship, SponsorshipStats } from '../models/sponsorship';


@Injectable({
  providedIn: 'root'
})
export class SponsorshipService {
  private apiUrl = 'https://parrainage.beinnetcorporate.com/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getSponsorships(candidateId?: string): Observable<Sponsorship[]> {
    const headers = this.authService.getAuthHeaders();
    const url = candidateId 
      ? `${this.apiUrl}/parrainages/candidat/${candidateId}`
      : `${this.apiUrl}/parrainages`;
    return this.http.get<Sponsorship[]>(url, { headers });
  }

  getSponsorshipStats(candidateId?: string): Observable<SponsorshipStats[]> {
    const headers = this.authService.getAuthHeaders();
    const url = candidateId 
      ? `${this.apiUrl}/parrainages/stats/${candidateId}`
      : `${this.apiUrl}/parrainages/stats`;
    return this.http.get<SponsorshipStats[]>(url, { headers });
  }

  validateSponsorship(sponsorshipId: string): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/parrainages/valider/${sponsorshipId}`, {}, { headers });
  }

  rejectSponsorship(sponsorshipId: string, reason: string): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/parrainages/rejeter/${sponsorshipId}`, { reason }, { headers });
  }
}