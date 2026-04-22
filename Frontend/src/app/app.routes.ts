import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
    {
        path: '', loadComponent: () => import('./client/layout/main/main').then(m => m.Main)
    },
    {
        path: 'admin',
        loadComponent: () => import('./admin/admin-main/admin-main').then(m => m.AdminMain),
        children: [
            {
                path: 'login',
                loadComponent: () => import('./shared/login/login.component').then(m => m.LoginComponent)   
            },
            {
                path: 'main',
                canActivateChild: [adminGuard],
                loadComponent: () => import('./admin/layout/admin-layout/admin-layout').then(m => m.AdminLayout),
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            }
        ]
    },
];
