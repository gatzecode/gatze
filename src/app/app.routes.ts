import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
    title: 'Dashboard',
  },
  {
    path: 'products/list',
    loadComponent: () => import('./pages/product/product').then((m) => m.ProductComponent),
    title: 'Products',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
