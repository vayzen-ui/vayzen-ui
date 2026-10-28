import { Routes } from '@angular/router';

export const COMPONENTS_CATALOG_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'buttons',
    pathMatch: 'full',
  },
  {
    path: 'buttons',
    loadComponent: () =>
      import('./views/button-doc/button-doc.component').then((m) => m.ButtonDocComponent),
  },
  {
    path: 'inputs',
    loadComponent: () =>
      import('./views/input-doc/input-doc.component').then((m) => m.InputDocComponent),
  },
];

