import { ChangeDetectionStrategy, Component, ViewEncapsulation, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doc-header',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['../../styles/doc-page.css'],
  encapsulation: ViewEncapsulation.None,
  host: {
    style: 'display: block; width: 100%;',
  },
  template: `
    <header class="doc-header">
      <div class="doc-header-top">
        <span class="category-tag">{{ category() }}</span>
        <span class="version-tag">{{ version() }}</span>
      </div>

      <h1 class="doc-title">{{ title() }}</h1>
      <p class="doc-description">{{ description() }}</p>

      <div class="doc-meta-chips">
        @for (sel of selectors(); track sel) {
          <span class="doc-meta-chip">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            Selector: <code>{{ sel }}</code>
          </span>
        }

        @for (feat of features(); track feat) {
          <span class="doc-meta-chip">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 14 14" />
            </svg>
            {{ feat }}
          </span>
        }

        <button
          type="button"
          class="doc-theme-toggle-btn"
          [class.is-dark]="previewTheme() === 'dark'"
          (click)="toggleTheme()"
          [title]="previewTheme() === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'"
        >
          @if (previewTheme() === 'dark') {
            <span>🌙 Viendo {{ themeTarget() }} en Modo Oscuro · Cambiar a Claro ☀️</span>
          } @else {
            <span>☀️ Viendo {{ themeTarget() }} en Modo Claro · Probar Modo Oscuro 🌙</span>
          }
        </button>
      </div>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocHeaderComponent {
  readonly category = input<string>('Componentes');
  readonly version = input<string>('Signals · Standalone · Dark Mode Nativo');
  readonly title = input.required<string>();
  readonly description = input<string>('');
  readonly selectors = input<string[]>([]);
  readonly features = input<string[]>([]);
  readonly themeTarget = input<string>('Componentes');
  readonly previewTheme = model<'light' | 'dark'>('light');

  toggleTheme(): void {
    this.previewTheme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }
}

