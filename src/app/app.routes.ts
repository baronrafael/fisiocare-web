import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'app/patients'
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/pages/login-page.component').then((m) => m.LoginPageComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/pages/register-page.component').then((m) => m.RegisterPageComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/pages/forgot-password-page.component').then((m) => m.ForgotPasswordPageComponent)
      }
    ]
  },
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () => import('./core/layout/app-shell.component').then((m) => m.AppShellComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'patients'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/pages/dashboard-page.component').then((m) => m.DashboardPageComponent)
      },
      {
        path: 'patients',
        loadComponent: () => import('./features/patients/pages/patients-page.component').then((m) => m.PatientsPageComponent)
      },
      {
        path: 'patients/new',
        loadComponent: () => import('./features/patients/pages/patient-editor-page.component').then((m) => m.PatientEditorPageComponent)
      },
      {
        path: 'patients/:id',
        loadComponent: () => import('./features/patients/pages/patient-detail-page.component').then((m) => m.PatientDetailPageComponent)
      },
      {
        path: 'patients/:id/edit',
        loadComponent: () => import('./features/patients/pages/patient-editor-page.component').then((m) => m.PatientEditorPageComponent)
      },
      {
        path: 'patients/:id/sessions/new',
        loadComponent: () => import('./features/sessions/pages/session-editor-page.component').then((m) => m.SessionEditorPageComponent)
      },
      {
        path: 'patients/:id/sessions/:sessionId/edit',
        loadComponent: () => import('./features/sessions/pages/session-editor-page.component').then((m) => m.SessionEditorPageComponent)
      },
      {
        path: 'templates',
        loadComponent: () => import('./features/templates/pages/templates-page.component').then((m) => m.TemplatesPageComponent)
      },
      {
        path: 'exports/patients/:id/pdf-preview',
        loadComponent: () => import('./features/exports/pages/pdf-preview-page.component').then((m) => m.PdfPreviewPageComponent)
      },
      {
        path: 'account',
        loadComponent: () => import('./features/account/pages/account-page.component').then((m) => m.AccountPageComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'app/patients'
  }
];
