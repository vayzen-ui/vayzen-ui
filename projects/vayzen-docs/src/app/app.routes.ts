import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'installation',
        loadComponent: () =>
          import('./features/installation/installation.component').then(
            (m) => m.InstallationComponent,
          ),
      },
      {
        path: 'studio',
        loadComponent: () =>
          import('./features/studio/studio.component').then((m) => m.StudioComponent),
      },
      {
        path: 'components',
        loadChildren: () =>
          import('./features/components-catalog/components-catalog.routes').then(
            (m) => m.COMPONENTS_CATALOG_ROUTES,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
