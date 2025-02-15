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

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'accueil', loadComponent: () => import('./components/accueil/accueil.component').then(m =>m.AccueilComponent), canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' },
  { path: 'accueil', component: AccueilComponent },
  { path: 'periode-parrainage', component: PeriodeParrainageComponent },
  { path: 'fichiers', component: ImportationElecteursComponent },
  { path: 'candidats', component: GestionCandidatsComponent },
  { path: 'parrainages', component: SuiviParrainagesComponent },
  { path: 'dashboard', component: DashboardComponent }


];
