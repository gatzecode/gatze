import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./views/dashboard/dashboard').then((m) => m.Dashboard),
    title: 'Dashboard',
  },
  {
    path: 'products/list',
    loadComponent: () => import('./views/product/product').then((m) => m.ProductComponent),
    title: 'Products',
  },
  {
    path: 'users',
    loadComponent: () => import('./views/user/user').then((m) => m.DashUser),
    title: 'Users',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
