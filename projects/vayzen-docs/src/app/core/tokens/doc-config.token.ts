import { InjectionToken } from '@angular/core';

export interface DocConfig {
  title: string;
  version: string;
}

export const DOC_CONFIG = new InjectionToken<DocConfig>('DOC_CONFIG', {
  providedIn: 'root',
  factory: () => ({
    title: 'Vayzen UI Documentation',
    version: '0.0.1',
  }),
});

