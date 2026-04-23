import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '', loadComponent: () => import('./client/layout/main/main').then(m => m.Main)
    },
    {
        path: 'not-found',
        loadComponent: () => import('./shared/not-found/not-found').then(m => m.NotFoundComponent)
    },
     {
        path: 'admin',
        loadComponent: () => import('./admin/admin-main/admin-main').then(m => m.AdminMain),
        children: [
            {
                path: 'login',
                canActivate: [authGuard],
                loadComponent: () => import('./shared/login/login').then(m => m.LoginComponent)   
            },
            {
                path: 'main',
                canActivateChild: [adminGuard],
                loadComponent: () => import('./admin/layout/admin-layout/admin-layout').then(m => m.AdminLayout),
                children: [
                    { path: 'dashboard', loadComponent: () => import('./admin/features/dashboard/admin-dashboard').then(m => m.AdminDashboard) },
                    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                    { path: '**', redirectTo: 'dashboard' }
                ]
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: '**',
                redirectTo: 'login'
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'not-found'
    },
];
