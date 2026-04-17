import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', loadComponent: () => import('./client/layout/main/main').then(m => m.Main)
    }
];
