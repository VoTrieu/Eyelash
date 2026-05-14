import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./client/layout/main/main').then((m) => m.Main),
    children: [
      { path: '', loadComponent: () => import('./client/features/home/home').then((m) => m.Home) },
      {
        path: 'not-found',
        loadComponent: () => import('./shared/not-found/not-found').then((m) => m.NotFoundComponent),
      },
      {
        path: 'server-error',
        loadComponent: () =>
          import('./shared/server-error/server-error').then((m) => m.ServerErrorComponent),
      },
      {
        path: 'book-appointment',
        loadComponent: () =>
          import('./client/features/book-appointment/book-appointment').then((m) => m.BookAppointment),
      },
      {
        path: 'appointment-requested/:id',
        loadComponent: () =>
          import('./client/features/appointment-requested/appointment-requested').then((m) => m.AppointmentRequested),
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./client/features/services/client-services').then((m) => m.ClientServices),
      },
      {
        path: 'reviews',
        loadComponent: () =>
          import('./client/features/reviews/client-reviews').then((m) => m.ClientReviews),
      },
    ],
  },
  {
    path: 'login',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/register/register').then((m) => m.RegisterComponent),
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin-main/admin-main').then((m) => m.AdminMain),
    children: [
      {
        path: '',
        canActivateChild: [adminGuard],
        loadComponent: () =>
          import('./admin/layout/admin-layout/admin-layout').then((m) => m.AdminLayout),
        children: [
          {
            path: 'dashboard',
            loadComponent: () =>
              import('./admin/features/dashboard/admin-dashboard').then((m) => m.AdminDashboard),
          },
          {
            path: 'services',
            loadComponent: () =>
              import('./admin/features/services/admin-services').then((m) => m.AdminServices),
          },
          {
            path: 'appointments',
            loadComponent: () =>
              import('./admin/features/appointments/admin-appointments').then((m) => m.AdminAppointments),
          },
          {
            path: 'availability',
            loadComponent: () =>
              import('./admin/features/availability/availability').then((m) => m.Availability),
          },
          {
            path: 'reviews',
            loadComponent: () =>
              import('./admin/features/reviews/admin-reviews').then((m) => m.AdminReviews),
          },
          {
            path: 'users',
            loadComponent: () =>
              import('./admin/features/users/admin-users').then((m) => m.AdminUsers),
          },
          {
            path: 'settings',
            loadComponent: () =>
              import('./admin/features/settings/admin-home-settings').then((m) => m.AdminHomeSettings),
          },
          {
            path: 'profile',
            loadComponent: () =>
              import('./admin/features/profile/admin-profile').then((m) => m.AdminProfile),
          },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: '**', redirectTo: 'dashboard' },
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
