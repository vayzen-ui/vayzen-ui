import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  VzButtonComponent,
  VzCardActionsDirective,
  VzCardComponent,
  VzCardContentDirective,
  VzCardFooterDirective,
  VzCardHeaderDirective,
  VzCardImageDirective,
  VzCardSubtitleDirective,
  VzCardTitleDirective,
} from 'vayzen-ui';
import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';

@Component({
  selector: 'app-card-doc',
  standalone: true,
  imports: [
    RouterLink,
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
  // ── Snippet Inicial ──
  protected readonly starterSnippet = `<vz-card variant="elevated" hoverable>
  <img vzCardImage src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80" alt="Aula de estudio" />
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
    <p>Gestión integral de expedientes académicos, mallas curriculares y calificaciones para el ciclo en curso.</p>
  </div>
  <div vzCardFooter>
    <span class="text-muted">16 Alumnos inscritos</span>
    <vz-button size="sm" variant="primary">Ingresar</vz-button>
  </div>
</vz-card>`;

  protected readonly accentSnippet = `<div class="status-cards-grid">
  <!-- Tarjeta con estado Aprobado / Éxito -->
  <vz-card variant="accent" accent="success" accentPosition="top" hoverable>
    <div vzCardHeader>
      <div>
        <h4 vzCardTitle>Inscripción Confirmada</h4>
        <span vzCardSubtitle>Ciclo 2026-B · Fatima Nava</span>
      </div>
    </div>
    <div vzCardContent>
      <p>Expediente revisado y validado satisfactoriamente por Control Escolar.</p>
    </div>
  </vz-card>

  <!-- Tarjeta con estado Alerta / Pendiente -->
  <vz-card variant="accent" accent="warning" accentPosition="left" hoverable>
    <div vzCardHeader>
      <div>
        <h4 vzCardTitle>Documentación Pendiente</h4>
        <span vzCardSubtitle>Certificado de Secundaria</span>
      </div>
    </div>
    <div vzCardContent>
      <p>El aspirante cuenta con 5 días hábiles para adjuntar su certificado original.</p>
    </div>
  </vz-card>
</div>`;

  protected readonly horizontalSnippet = `<vz-card orientation="horizontal" variant="elevated" hoverable>
  <img vzCardImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80" alt="Fotografía del alumno" />
  <div vzCardHeader>
    <div>
      <h4 vzCardTitle>Fatima Nava Peralta</h4>
      <span vzCardSubtitle>Matrícula: 2926BG06P002</span>
    </div>
    <div vzCardActions>
      <span class="status-pill status-pill--success">Inscrita</span>
    </div>
  </div>
  <div vzCardContent>
    <p>CURP: KWIR040107HMNRHN92 · Bachillerato General · Semestre 4</p>
  </div>
  <div vzCardFooter>
    <span class="text-muted">Movimiento: Inscripción</span>
    <vz-button size="sm" variant="primary">Ver Expediente</vz-button>
  </div>
</vz-card>`;

  protected readonly metricSnippet = `<!-- Widget de Métrica para Dashboards -->
<vz-card variant="elevated" [borderedHeader]="false" [borderedFooter]="false" hoverable>
  <div vzCardHeader>
    <div>
      <span class="metric-label">Alumnos Activos</span>
      <h2 class="metric-value">1,284</h2>
    </div>
    <div class="metric-icon-box metric-icon-box--primary">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    </div>
  </div>
  <div vzCardContent>
    <div class="metric-trend">
      <span class="trend-badge trend-badge--up">+12.4%</span>
      <span class="trend-text">vs ciclo anterior</span>
    </div>
  </div>
</vz-card>`;

  protected readonly customThemingSnippet = `/* Sobrescribe tokens CSS de Vayzen Card para crear tu propio tema */
.card-dark-pro {
  --vz-card-bg: #0f172a;
  --vz-card-color: #f8fafc;
  --vz-card-border-color: #1e293b;
  --vz-card-border-radius: 1rem;
  --vz-card-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.4);
  --vz-card-title-color: #ffffff;
  --vz-card-subtitle-color: #94a3b8;
  --vz-card-footer-bg: #0b1120;
}`;

  // ── Tablas de Referencia ──
  protected readonly inputRows: [string, string, string, string][] = [
    ['variant', "'elevated' | 'outlined' | 'flat' | 'accent'", "'elevated'", 'Variante visual del contenedor.'],
    ['accent', "'primary' | 'success' | 'warning' | 'danger' | 'info' | string", "'primary'", 'Color de la franja en variante accent (soporta palabras clave o hex/rgb).'],
    ['accentPosition', "'top' | 'left'", "'top'", 'Posición de la franja de acento.'],
    ['orientation', "'vertical' | 'horizontal'", "'vertical'", 'Disposición de imagen y contenido.'],
    ['density', "'compact' | 'comfortable' | 'spacious'", "'comfortable'", 'Espaciado interno (padding) de la tarjeta.'],
    ['borderedHeader', 'boolean', 'true', 'Muestra u oculta el borde inferior de la cabecera.'],
    ['borderedFooter', 'boolean', 'true', 'Muestra u oculta el borde superior y fondo del pie.'],
    ['title', 'string', "''", 'Título declarativo de la tarjeta.'],
    ['subtitle', 'string', "''", 'Subtítulo declarativo de la tarjeta.'],
    ['imageUrl', 'string', "''", 'URL de imagen de cabecera declarativa.'],
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
    ['[vzCardImage]', 'Elemento <img>', 'Ajusta y recorta la imagen respetando los radios y orientación de la tarjeta.'],
  ];

  protected readonly cssVarRows: [string, string][] = [
    ['--vz-card-bg', 'Color de fondo de la tarjeta (default: #ffffff)'],
    ['--vz-card-color', 'Color del texto principal (default: #1e293b)'],
    ['--vz-card-border-color', 'Color de borde (default: #e2e8f0)'],
    ['--vz-card-border-width', 'Grosor del borde (default: 1px)'],
    ['--vz-card-border-radius', 'Radio de las esquinas (default: 0.75rem / 12px)'],
    ['--vz-card-shadow', 'Sombra base multicapa de la tarjeta'],
    ['--vz-card-shadow-hover', 'Sombra al pasar el cursor (cuando hoverable=true)'],
    ['--vz-card-padding', 'Espaciado interno de las secciones (header, content, footer)'],
    ['--vz-card-title-color', 'Color del título principal (default: #0f172a)'],
    ['--vz-card-title-size', 'Tamaño de fuente del título'],
    ['--vz-card-title-weight', 'Peso tipográfico del título (default: 600)'],
    ['--vz-card-subtitle-color', 'Color de los subtítulos (default: #64748b)'],
    ['--vz-card-header-bg / --vz-card-footer-bg', 'Fondos específicos para cabecera y pie'],
    ['--vz-card-accent-color', 'Color de la barra de acento (variante accent)'],
    ['--vz-card-accent-width', 'Grosor de la barra de acento (default: 4px)'],
  ];
}
