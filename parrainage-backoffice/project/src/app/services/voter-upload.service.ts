import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { electeursProblematiques, ElecteursTemp } from '../models/voter';

@Injectable({
    providedIn: 'root'
  })
  export class ImportationElecteursService {
    private apiUrl = 'https://parrainage.beinnetcorporate.com/api';
  
    constructor(
      private http: HttpClient,
      private authService: AuthService
    ) {}
  
    uploadFichier(file: File, checksum: string): Observable<any> {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('checksum', checksum);
  
      const headers = this.authService.getAuthHeaders();
  
      console.log('Envoi du fichier avec checksum:', checksum);
      return this.http.post(`${this.apiUrl}/electeurs/upload`, formData, { headers });
    }
    
    getElecteursEnAttente() {
      const headers = this.authService.getAuthHeaders(); // Ajoute les en-têtes d'authentification
      return this.http.get<ElecteursTemp[]>(`${this.apiUrl}/electeurs/en-attente`, { headers });
    }
    
    validerElecteurs() {
      const headers = this.authService.getAuthHeaders();
      return this.http.post(`${this.apiUrl}/electeurs/valider`, {}, {headers});
    }
    
    validerImportation() {
      const headers = this.authService.getAuthHeaders();
      return this.http.post(`${this.apiUrl}/electeurs/valider-importation`, {}, {headers});
    }
    getElecteursProblematiques(idFichier?: string): Observable<electeursProblematiques[]> {
        const headers = this.authService.getAuthHeaders();
        const url = idFichier 
          ? `${this.apiUrl}/electeurs/problematiques/${idFichier}`
          : `${this.apiUrl}/electeurs/problematiques`;
        return this.http.get<electeursProblematiques[]>(url, { headers });
      }
  }