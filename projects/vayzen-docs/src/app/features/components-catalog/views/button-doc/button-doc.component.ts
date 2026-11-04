import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VzButtonComponent, VzButtonTheme } from 'vayzen-ui';
import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';

@Component({
  selector: 'app-button-doc',
  standalone: true,
  imports: [VzButtonComponent, CodeBlockComponent, RouterLink],
  templateUrl: './button-doc.component.html',
  styleUrls: ['../../../../shared/styles/doc-page.css', './button-doc.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonDocComponent {
  // ── Tema de Previsualización (Claro / Oscuro) ──
  protected readonly previewTheme = signal<VzButtonTheme>('light');

  togglePreviewTheme(): void {
    this.previewTheme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  // ── Estado Interactivo de Carga Asíncrona ──
  protected readonly isSimulatingLoad = signal(false);

  simularCarga(): void {
    this.isSimulatingLoad.set(true);
    setTimeout(() => {
      this.isSimulatingLoad.set(false);
    }, 1500);
  }

  // ── Contador de Clics de Prueba ──
  protected readonly clickCounter = signal(0);

  registrarClick(): void {
    this.clickCounter.update((c) => c + 1);
  }

  // ── Snippets de Código ──
  protected readonly variantsSnippet = `<!-- 5 Familias Visuales Integradas -->
<vz-button variant="solid" color="primary">Solid</vz-button>
<vz-button variant="soft" color="primary">Soft Pastel</vz-button>
<vz-button variant="outline" color="primary">Outline</vz-button>
<vz-button variant="ghost" color="primary">Ghost</vz-button>
<vz-button variant="link" color="primary">Enlace</vz-button>`;

  protected readonly colorsSnippet = `<!-- Paleta Semántica Completa -->
<vz-button color="primary">Primary</vz-button>
<vz-button color="success">Success</vz-button>
<vz-button color="warning">Warning</vz-button>
<vz-button color="danger">Danger</vz-button>
<vz-button color="info">Info</vz-button>
<vz-button color="dark">Dark</vz-button>
<vz-button color="secondary">Secondary</vz-button>`;

  protected readonly softPaletteSnippet = `<!-- Variante Soft Pastel (Inspirada en dashboards empresariales) -->
<vz-button variant="soft" color="primary">Primary Soft</vz-button>
<vz-button variant="soft" color="success">Aprobado</vz-button>
<vz-button variant="soft" color="warning">Pendiente</vz-button>
<vz-button variant="soft" color="danger">Rechazado</vz-button>
<vz-button variant="soft" color="info">Análisis</vz-button>
<vz-button variant="soft" color="dark">Neutro</vz-button>`;

  protected readonly statesSnippet = `<!-- Spinner de Carga Nativo y Disabled -->
<vz-button [loading]="isLoading" (clicked)="onGuardar()">
  Guardar Cambios
</vz-button>

<vz-button [loading]="true" iconOnly="true" />

<vz-button [disabled]="true" color="primary">
  Acción Deshabilitada
</vz-button>`;

  protected readonly sizesShapesSnippet = `<!-- Tamaños, Píldoras (Pill) e Iconos Cuadrados/Circulares -->
<vz-button size="sm">Pequeño</vz-button>
<vz-button size="md">Estándar</vz-button>
<vz-button size="lg">Grande</vz-button>

<!-- Píldora redondeada (border-radius: 9999px) -->
<vz-button [pill]="true" color="primary">Redondeado Pill</vz-button>

<!-- Botón cuadrado / circular para iconos de barra de herramientas -->
<vz-button icon="settings" [iconOnly]="true" [pill]="true" variant="soft" />
<vz-button icon="trash" [iconOnly]="true" variant="soft" color="danger" />`;

  protected readonly iconsBadgesSnippet = `<!-- Iconos Integrados y Badges Contador -->
<vz-button icon="plus" color="primary">Nuevo Registro</vz-button>
<vz-button icon="download" variant="outline" color="primary">Exportar CSV</vz-button>
<vz-button icon="arrow-right" iconPosition="right" color="success">Continuar</vz-button>

<!-- Botón con Badge Contador -->
<vz-button icon="mail" variant="soft" color="primary" [badge]="12" badgeVariant="primary">
  Bandeja de Entrada
</vz-button>`;

  protected readonly tokensSnippet = `/* Sobrescritura de Tokens CSS sin usar ::ng-deep */
.btn-marketing-hero {
  --vz-btn-bg: #8b5cf6;
  --vz-btn-hover-bg: #7c3aed;
  --vz-btn-radius: 9999px;
  --vz-btn-px: 2rem;
  --vz-btn-height: 3rem;
  --vz-btn-font-size: 1.05rem;
}`;

  // ── Tablas de Referencia de API ──
  protected readonly inputApi = [
    ['theme', "'light' | 'dark' | 'auto' | undefined", 'undefined', 'Fuerza el Modo Claro, Modo Oscuro nativo o automático según el sistema.'],
    ['dark', 'boolean', 'false', 'Atajo booleano para activar el Modo Oscuro nativo (<vz-button dark>).'],
    ['variant', "'solid' | 'soft' | 'outline' | 'ghost' | 'link'", "'solid'", 'Estilo visual de la superficie y contornos del botón.'],
    ['color', "'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'dark' | 'light'", "'primary'", 'Tono semántico de color del botón.'],
    ['size', "'sm' | 'md' | 'lg'", "'md'", 'Tamaño dimensional del botón (altura, padding y tipografía).'],
    ['type', "'button' | 'submit' | 'reset'", "'button'", 'Atributo HTML type nativo del elemento botón.'],
    ['disabled', 'boolean', 'false', 'Deshabilita visualmente la interacción e impide emitir eventos clicked.'],
    ['loading', 'boolean', 'false', 'Muestra spinner SVG animado y bloquea temporalmente los clics sin deformar el ancho.'],
    ['pill', 'boolean', 'false', 'Aplica radio de borde completamente redondeado (border-radius: 9999px).'],
    ['icon', 'string', 'undefined', 'Clave del icono SVG integrado (plus, check, download, trash, settings, search, refresh, etc.).'],
    ['iconPosition', "'left' | 'right'", "'left'", 'Ubicación del icono con respecto al texto proyectado.'],
    ['iconOnly', 'boolean', 'false', 'Adapta la forma a proporción cuadrada o circular para barras de acción.'],
    ['fullWidth', 'boolean', 'false', 'Expande el botón al 100% del ancho del contenedor padre.'],
    ['badge', 'string | number', 'undefined', 'Texto o número del badge contador flotante dentro del botón.'],
    ['badgeVariant', 'VzButtonColor', 'undefined', 'Color semántico del badge contador.'],
    ['ariaLabel', 'string', 'undefined', 'Etiqueta ARIA para accesibilidad y lectores de pantalla.'],
  ];

  protected readonly outputApi = [
    ['clicked', 'MouseEvent', 'Emite el evento nativo del cursor cuando el botón no está deshabilitado ni cargando.'],
  ];

  protected readonly cssVarApi = [
    ['--vz-btn-bg', '#2563eb', 'Color de fondo principal del botón.'],
    ['--vz-btn-color', '#ffffff', 'Color tipográfico y del icono principal.'],
    ['--vz-btn-border', 'transparent', 'Borde perimetral del botón.'],
    ['--vz-btn-hover-bg', 'color-mix(...)', 'Color de fondo al posar el cursor sobre el botón.'],
    ['--vz-btn-active-bg', 'color-mix(...)', 'Color de fondo al presionar el botón.'],
    ['--vz-btn-focus-ring', 'rgba(37, 99, 235, 0.35)', 'Anillo de foco accesible por teclado.'],
    ['--vz-btn-radius', '0.5rem', 'Radio de curvatura de esquinas del botón.'],
    ['--vz-btn-height', '2.5rem', 'Altura dimensional del botón.'],
    ['--vz-btn-px', '1rem', 'Espaciado horizontal interno (padding).'],
    ['--vz-btn-font-size', '0.875rem', 'Tamaño de la fuente tipográfica.'],
    ['--vz-btn-font-weight', '600', 'Grosor de la tipografía.'],
    ['--vz-btn-gap', '0.5rem', 'Espacio entre el icono, el texto y el badge.'],
  ];
}
