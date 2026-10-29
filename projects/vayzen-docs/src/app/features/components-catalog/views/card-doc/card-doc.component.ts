import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  VzButtonComponent,
  VzCardActionsDirective,
  VzCardComponent,
  VzCardContentDirective,
  VzCardDensity,
  VzCardFooterDirective,
  VzCardHeaderDirective,
  VzCardImageDirective,
  VzCardSubtitleDirective,
  VzCardTitleDirective,
  VzCardVariant,
} from 'vayzen-ui';
import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';

@Component({
  selector: 'app-card-doc',
  standalone: true,
  imports: [
    VzCardComponent,
    VzCardHeaderDirective,
    VzCardTitleDirective,
    VzCardSubtitleDirective,
    VzCardActionsDirective,
    VzCardContentDirective,
    VzCardFooterDirective,
    VzCardImageDirective,
    VzButtonComponent,
    CodeBlockComponent,
  ],
  templateUrl: './card-doc.component.html',
  styleUrls: ['../../../../shared/styles/doc-page.css', './card-doc.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDocComponent {
  // ── Playground States ──
  protected readonly variant = signal<VzCardVariant>('elevated');
  protected readonly density = signal<VzCardDensity>('comfortable');
  protected readonly hoverable = signal(true);
  protected readonly clickable = signal(false);
  protected readonly loading = signal(false);
  protected readonly disabled = signal(false);
  protected readonly showImage = signal(true);

  protected readonly lastEvent = signal('Haz clic en la tarjeta o usa los controles.');

  protected readonly playgroundCode = computed(() => {
    const v = this.variant();
    const d = this.density();
    const h = this.hoverable();
    const c = this.clickable();
    const l = this.loading();
    const dis = this.disabled();
    const img = this.showImage();

    const attrs = [
      v !== 'elevated' ? `variant="${v}"` : '',
      d !== 'comfortable' ? `density="${d}"` : '',
      h ? 'hoverable' : '',
      c ? 'clickable (clicked)="onCardClick($event)"' : '',
      l ? '[loading]="true"' : '',
      dis ? '[disabled]="true"' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const attrStr = attrs ? ` ${attrs}` : '';

    if (img) {
      return `<vz-card${attrStr}>
  <img vzCardImage src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80" alt="Aula" />
  <div vzCardHeader>
    <div>
      <h3 vzCardTitle>Control Escolar 2026</h3>
      <span vzCardSubtitle>Plantel Central · Grupo 402</span>
    </div>
    <div vzCardActions>
      <vz-button size="sm" variant="ghost">Ver</vz-button>
    </div>
  </div>
  <div vzCardContent>
    <p>Gestión integral de expedientes académicos, mallas curriculares y calificaciones.</p>
  </div>
  <div vzCardFooter>
    <span class="text-muted">16 Alumnos inscritos</span>
    <vz-button size="sm" variant="primary">Ingresar</vz-button>
  </div>
</vz-card>`;
    }

    return `<vz-card${attrStr} title="Control Escolar 2026" subtitle="Plantel Central">
  <p>Gestión integral de expedientes académicos, mallas curriculares y calificaciones.</p>
</vz-card>`;
  });

  protected onCardClick(): void {
    this.lastEvent.set(`clicked → Evento emitido a las ${new Date().toLocaleTimeString()}`);
  }

  // ── Snippets de Ejemplo ──
  protected readonly declarativeSnippet = `import { Component } from '@angular/core';
import { VzCardComponent } from 'vayzen-ui';

@Component({
  standalone: true,
  imports: [VzCardComponent],
  template: \`
    <vz-card
      title="Expediente de Alumno"
      subtitle="Matrícula: 2926BG06P002"
      variant="elevated"
      hoverable>
      <p>Estudiante regular inscrito en el 4to semestre.</p>
    </vz-card>
  \`,
})
export class MiComponente {}`;

  protected readonly composableSnippet = `import { Component } from '@angular/core';
import {
  VzCardComponent,
  VzCardHeaderDirective,
  VzCardTitleDirective,
  VzCardSubtitleDirective,
  VzCardActionsDirective,
  VzCardContentDirective,
  VzCardFooterDirective,
  VzCardImageDirective,
  VzButtonComponent,
} from 'vayzen-ui';

@Component({
  standalone: true,
  imports: [
    VzCardComponent,
    VzCardHeaderDirective,
    VzCardTitleDirective,
    VzCardSubtitleDirective,
    VzCardActionsDirective,
    VzCardContentDirective,
    VzCardFooterDirective,
    VzCardImageDirective,
    VzButtonComponent,
  ],
  templateUrl: './curso-card.component.html',
})
export class CursoCardComponent {}`;

  protected readonly composableHtmlSnippet = `<vz-card variant="outlined" [hoverable]="true">
  <!-- 1. Imagen superior con recorte automático de bordes -->
  <img vzCardImage src="/assets/curso-angular.jpg" alt="Portada de curso" />

  <!-- 2. Cabecera con título, subtítulo y botones de acción -->
  <div vzCardHeader>
    <div>
      <h3 vzCardTitle>Arquitectura de Software en Angular</h3>
      <span vzCardSubtitle>Nivel Avanzado · 40 horas</span>
    </div>
    <div vzCardActions>
      <vz-button size="sm" variant="ghost">Favorito</vz-button>
    </div>
  </div>

  <!-- 3. Contenido principal -->
  <div vzCardContent>
    <p>Aprende a diseñar librerías de componentes, monorepos y microfrontends escalables.</p>
  </div>

  <!-- 4. Pie con información secundaria y botón principal -->
  <div vzCardFooter>
    <span class="text-muted">Inicio: 15 de Noviembre</span>
    <vz-button size="sm" variant="primary">Inscribirme</vz-button>
  </div>
</vz-card>`;

  protected readonly themingSnippet = `/* Sobrescritura mediante Variables CSS sin romper la encapsulación */
.card-personalizada {
  --vz-card-bg: #0f172a;
  --vz-card-color: #f8fafc;
  --vz-card-border-color: #334155;
  --vz-card-radius: 1.25rem;
  --vz-card-shadow-hover: 0 20px 25px -5px rgb(0 0 0 / 0.5);
  --vz-card-subtitle-color: #94a3b8;
}`;

  // ── Tablas de Referencia ──
  protected readonly inputRows: [string, string, string, string][] = [
    ['variant', "'elevated' | 'outlined' | 'flat'", "'elevated'", 'Variante visual del contenedor.'],
    ['density', "'compact' | 'comfortable' | 'spacious'", "'comfortable'", 'Espaciado interno (padding) de la tarjeta.'],
    ['title', 'string', "''", 'Título declarativo de la tarjeta (si no usas [vzCardTitle]).'],
    ['subtitle', 'string', "''", 'Subtítulo declarativo de la tarjeta (si no usas [vzCardSubtitle]).'],
    ['imageUrl', 'string', "''", 'URL de imagen de cabecera declarativa (si no usas [vzCardImage]).'],
    ['imageAlt', 'string', "''", 'Texto alternativo para la imagen.'],
    ['hoverable', 'boolean', 'false', 'Efecto de elevación suave al pasar el cursor.'],
    ['clickable', 'boolean', 'false', 'Agrega rol de botón, navegación por teclado y cursor pointer.'],
    ['loading', 'boolean', 'false', 'Muestra el esqueleto (skeleton) animado de carga.'],
    ['disabled', 'boolean', 'false', 'Deshabilita la interactividad y reduce la opacidad.'],
  ];

  protected readonly outputRows: [string, string, string][] = [
    ['clicked', 'MouseEvent | KeyboardEvent', 'Se emite al hacer clic o presionar Enter/Espacio (requiere clickable=true).'],
  ];

  protected readonly directiveRows: [string, string, string][] = [
    ['[vzCardHeader]', 'Contenedor', 'Agrupa título, subtítulo y acciones en la parte superior.'],
    ['[vzCardTitle]', 'Texto', 'Aplica estilos y jerarquía tipográfica al título principal.'],
    ['[vzCardSubtitle]', 'Texto', 'Aplica color secundario y tamaño adecuado al subtítulo.'],
    ['[vzCardActions]', 'Contenedor', 'Espacio para botones o iconos alineados al final del header.'],
    ['[vzCardContent]', 'Contenedor', 'Área para el contenido o cuerpo principal de la tarjeta.'],
    ['[vzCardFooter]', 'Contenedor', 'Área de pie con borde divisor para acciones y metadatos.'],
    ['[vzCardImage]', 'Elemento <img>', 'Ajusta y recorta la imagen respetando los radios de la tarjeta.'],
  ];

  protected readonly cssVarRows: [string, string][] = [
    ['--vz-card-bg', 'Fondo de la tarjeta'],
    ['--vz-card-color', 'Color del texto principal'],
    ['--vz-card-border-color', 'Color de borde en variantes elevated y outlined'],
    ['--vz-card-border-width', 'Ancho del borde (default: 1px)'],
    ['--vz-card-radius', 'Radio de las esquinas (default: 0.75rem / 12px)'],
    ['--vz-card-shadow', 'Sombra base de la tarjeta (variante elevated)'],
    ['--vz-card-shadow-hover', 'Sombra al pasar el cursor (cuando hoverable=true)'],
    ['--vz-card-padding', 'Espaciado interno de las secciones'],
    ['--vz-card-subtitle-color', 'Color de los subtítulos'],
    ['--vz-card-header-bg / --vz-card-footer-bg', 'Fondo específico para cabecera o pie'],
  ];
}

