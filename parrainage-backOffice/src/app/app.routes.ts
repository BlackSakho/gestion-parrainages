import { Routes } from '@angular/router';
import { AccueilComponent } from './components/accueil/accueil.component';
import { PeriodeParrainageComponent } from './components/periode-parrainage/periode-parrainage.component';
import { ImportationElecteursComponent } from './components/importation-electeurs/importation-electeurs.component';
import { GestionCandidatsComponent } from './components/gestion-candidats/gestion-candidats.component';
import { SuiviParrainagesComponent } from './components/suivi-parrainages/suivi-parrainages.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfilComponent } from './components/profil/profil.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'accueil', component: AccueilComponent, canActivate: [AuthGuard] },
  { path: 'periode-parrainage', component: PeriodeParrainageComponent, canActivate: [AuthGuard] },
  { path: 'fichiers', component: ImportationElecteursComponent, canActivate: [AuthGuard] },
  { path: 'candidats', component: GestionCandidatsComponent, canActivate: [AuthGuard] },
  { path: 'parrainages', component: SuiviParrainagesComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }
];
