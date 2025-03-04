import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';


export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'register', 
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  
  { 
    path: 'voters', 
    loadComponent: () => import('./components/voter-management/voter-management.component').then(m => m.VoterManagementComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'voters/upload', 
    loadComponent: () => import('./components/voter-upload/voter-upload.component').then(m => m.VoterUploadComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'voters/validate', 
    loadComponent: () => import('./components/voter-validate/voter-validate.component').then(m => m.VoterValidateComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'voters/problems', 
    loadComponent: () => import('./components/voter-problems/voter-problems.component').then(m => m.VoterProblemsComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'candidates', 
    loadComponent: () => import('./components/candidate-list/candidate-list.component').then(m => m.CandidateListComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'candidates/new', 
    loadComponent: () => import('./components/candidate-registration/candidate-registration.component').then(m => m.CandidateRegistrationComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'schedule', 
    loadComponent: () => import('./components/schedule-management/schedule-management.component').then(m => m.ScheduleManagementComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'sponsorships', 
    loadComponent: () => import('./components/sponsorship-dashboard/sponsorship-dashboard.component').then(m => m.SponsorshipDashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'sponsorships/candidate/:id', 
    loadComponent: () => import('./components/sponsorship-detail/sponsorship-detail.component').then(m => m.SponsorshipDetailComponent),
    canActivate: [AuthGuard]
  }
];