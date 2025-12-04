import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  // Auth routes with empty layout
  {
    path: 'auth',
    loadComponent: () => import('./shared/layouts/empty/layout-empty').then((m) => m.LayoutEmpty),
    children: [
      {
        path: 'signin',
        loadComponent: () => import('./views/auth/signin/signin').then((m) => m.SignIn),
        title: 'signin',
      },
    ],
  },
  // Main routes with Main layout (classic/dense)
  {
    path: '',
    loadComponent: () => import('./shared/layouts/main/main').then((m) => m.Main),
    children: [
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
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
