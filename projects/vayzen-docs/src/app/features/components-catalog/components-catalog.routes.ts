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
    path: 'cards',
    loadComponent: () =>
      import('./views/card-doc/card-doc.component').then((m) => m.CardDocComponent),
  },
  {
    path: 'tables',
    loadComponent: () =>
      import('./views/table-doc/table-doc.component').then((m) => m.TableDocComponent),
  },
];

