import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface DocTocItem {
  id: string;
  label: string;
}

@Component({
  selector: 'app-doc-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styleUrls: ['../../styles/doc-page.css'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'doc-toc-sidebar',
    style: 'display: flex; flex-direction: column;',
  },
  template: `
    @if (studioComponent()) {
      <div class="studio-widget-card">
        <div class="widget-badge-row">
          <span class="widget-dot"></span>
          <span class="widget-badge">Vayzen Studio</span>
        </div>
        <h4 class="widget-title">{{ studioTitle() }}</h4>
        <p class="widget-desc">{{ studioDesc() }}</p>
        <a
          [routerLink]="['/studio']"
          [queryParams]="{ component: studioComponent() }"
          class="widget-action-btn"
        >
          <span>Abrir en Studio</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </div>
    }

    <div class="toc-container">
      <h5 class="toc-title">En esta página</h5>
      <nav class="toc-nav">
        @for (item of toc(); track item.id) {
          <a [href]="'#' + item.id" class="toc-link">{{ item.label }}</a>
        }
      </nav>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocSidebarComponent {
  readonly studioComponent = input<string | undefined>(undefined);
  readonly studioTitle = input<string>('Diseñador en Vivo');
  readonly studioDesc = input<string>(
    'Abre el laboratorio interactivo para probar modo oscuro, variantes, estados de carga y generar código Angular en vivo.'
  );
  readonly toc = input.required<DocTocItem[]>();
}

