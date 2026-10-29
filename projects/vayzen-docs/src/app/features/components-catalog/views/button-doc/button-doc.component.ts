import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VzButtonComponent, VzButtonSize, VzButtonVariant } from 'vayzen-ui';
import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';

@Component({
  selector: 'app-button-doc',
  standalone: true,
  imports: [VzButtonComponent, CodeBlockComponent, FormsModule],
  templateUrl: './button-doc.component.html',
  styleUrl: './button-doc.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonDocComponent {
  // --- Estados del Playground Interactivo ---
  protected readonly selectedVariant = signal<VzButtonVariant>('primary');
  protected readonly selectedSize = signal<VzButtonSize>('md');
  protected readonly selectedRadius = signal<'default' | 'pill' | 'square'>('default');
  protected readonly isDisabled = signal<boolean>(false);
  protected readonly customBgColor = signal<string>('');
  protected readonly buttonLabel = signal<string>('Click me');

  // --- Propiedades CSS dinámicas para el host del botón ---
  protected readonly playgroundRadiusStyle = computed(() => {
    const radius = this.selectedRadius();
    if (radius === 'pill') return '9999px';
    if (radius === 'square') return '0px';
    return null;
  });

  protected readonly playgroundBgStyle = computed(() => {
    return this.customBgColor() || null;
  });

  // --- Snippet de código generado dinámicamente en tiempo real ---
  protected readonly playgroundHtmlCode = computed(() => {
    const variant = this.selectedVariant();
    const size = this.selectedSize();
    const disabled = this.isDisabled();
    const radius = this.selectedRadius();
    const bg = this.customBgColor();

    let styleParts: string[] = [];
    if (radius === 'pill') styleParts.push('--vz-btn-radius: 9999px');
    if (radius === 'square') styleParts.push('--vz-btn-radius: 0px');
    if (bg) styleParts.push(`--vz-btn-bg: ${bg}`);

    const styleAttr = styleParts.length > 0 ? ` style="${styleParts.join('; ')}"` : '';
    const disabledAttr = disabled ? ' [disabled]="true"' : '';

    return `<vz-button variant="${variant}" size="${size}"${disabledAttr}${styleAttr}>\n  ${this.buttonLabel()}\n</vz-button>`;
  });

  // --- Snippets Estáticos para la Documentación ---
  protected readonly basicImportTs = `import { Component } from '@angular/core';
import { VzButtonComponent } from 'vayzen-ui';

@Component({
  selector: 'app-mi-vista',
  standalone: true,
  imports: [VzButtonComponent],
  templateUrl: './mi-vista.component.html',
})
export class MiVistaComponent {}`;

  protected readonly basicHtmlSnippet = `<vz-button variant="primary">Submit</vz-button>`;

  protected readonly variantsSnippet = `<vz-button variant="primary">Primary</vz-button>
<vz-button variant="secondary">Secondary</vz-button>
<vz-button variant="outline">Outline</vz-button>
<vz-button variant="ghost">Ghost</vz-button>`;

  protected readonly sizesSnippet = `<vz-button size="sm">Small</vz-button>
<vz-button size="md">Medium</vz-button>
<vz-button size="lg">Large</vz-button>`;

  protected readonly globalOverrideSnippet = `/* ========================================================
   En tu archivo styles.scss global de tu aplicación:
   Sobrescribe los Tokens de Vayzen UI en :root
======================================================== */
:root {
  /* 1. Cambia la paleta de marca oficial a esmeralda */
  --vz-primary: #10b981;
  --vz-primary-hover: #059669;
  --vz-primary-active: #047857;

  /* 2. Todos los botones de la app ahora serán completamente redondeados */
  --vz-btn-radius: 9999px;
}`;

  protected readonly classOverrideSnippet = `/* ========================================================
   En el archivo .scss o .css de tu propio componente:
   Personalización por Clase CSS sin usar ::ng-deep
======================================================== */
.btn-marketing-hero {
  --vz-btn-bg: #8b5cf6;
  --vz-btn-hover-bg: #7c3aed;
  --vz-btn-active-bg: #6d28d9;
  --vz-btn-color: #ffffff;
  --vz-btn-radius: 9999px;
  --vz-btn-padding-x: 2rem;
  --vz-btn-font-size: 1.1rem;
}

.btn-emerald-pill {
  --vz-btn-bg: #10b981;
  --vz-btn-hover-bg: #059669;
  --vz-btn-active-bg: #047857;
  --vz-btn-color: #ffffff;
  --vz-btn-radius: 9999px;
}`;

  protected readonly classOverrideHtmlSnippet = `<!-- Uso en tu template HTML aplicando tu clase CSS personalizada -->
<vz-button class="btn-marketing-hero" size="lg">
  Comenzar prueba gratis &rarr;
</vz-button>

<vz-button class="btn-emerald-pill">
  Pill Esmeralda
</vz-button>`;

  protected readonly inlineOverrideSnippet = `<!-- Sobrescritura puntual con variables CSS en línea -->
<vz-button style="--vz-btn-bg: #ec4899; --vz-btn-hover-bg: #db2777; --vz-btn-radius: 4px;">
  Acento Rosa (4px Radius)
</vz-button>`;
}
