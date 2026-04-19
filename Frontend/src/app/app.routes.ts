import { Routes } from '@angular/router';

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
                loadComponent: () => import('./admin/layout/admin-layout/admin-layout').then(m => m.AdminLayout)   
            }
        ]
    },
];
