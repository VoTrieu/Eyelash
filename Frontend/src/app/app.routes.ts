import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', loadComponent: () => import('./client/layout/main/main').then(m => m.Main)
    },
    {
        path: 'admin',
        loadComponent: () => import('./admin/layout/admin-layout').then(m => m.AdminLayout)
    }
];
