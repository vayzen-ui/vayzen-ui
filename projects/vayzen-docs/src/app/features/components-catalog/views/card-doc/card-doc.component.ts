import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  VZ_CARD_IMPORTS,
  VzButtonComponent,
} from 'vayzen-ui';
import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';

@Component({
  selector: 'app-card-doc',
  standalone: true,
  imports: [
    RouterLink,
    ...VZ_CARD_IMPORTS,
    VzButtonComponent,
    CodeBlockComponent,
  ],
  templateUrl: './card-doc.component.html',
  styleUrls: ['../../../../shared/styles/doc-page.css', './card-doc.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDocComponent {
  // ── 1. Snippet: Cards Muy Básicas ──
  protected readonly basicCardSnippet = `<!-- 1. Card Ultra Básica (Declarativa sin slots) -->
<vz-card
  variant="outlined"
  title="Aviso de Mantenimiento"
  subtitle="Actualización programada · Viernes 22:00 hrs"
>
  <p>El portal de servicios escolares permanecerá en mantenimiento preventivo durante 45 minutos.</p>
</vz-card>

<!-- 2. Card Básica con Cabecera y Acción -->
<vz-card variant="elevated" hoverable>
  <div vzCardHeader>
    <div>
      <span vzCardBadge variant="neutral">TRÁMITE RÁPIDO</span>
      <h3 vzCardTitle>Constancia de Estudios</h3>
      <span vzCardSubtitle>Emisión digital inmediata</span>
    </div>
  </div>
  <div vzCardContent>
    <p>Descarga tu documento oficial con sello digital y código QR de validación institucional.</p>
  </div>
  <div vzCardFooter>
    <span class="text-muted">Tiempo estimado: 1 min</span>
    <vz-button size="sm" variant="primary">Solicitar</vz-button>
  </div>
</vz-card>`;

  // ── 2. Snippet: Card Muy Completa (Marketplace / Nexus Hardware Lab) ──
  protected readonly completeProSnippet = `<vz-card variant="elevated" [borderedHeader]="false" hoverable>
  <img
    vzCardImage
    src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=700&q=80"
    alt="Nexus Hardware Lab"
  />

  <div vzCardContent>
    <!-- Eyebrow: Categoría + Calificación -->
    <div vzCardEyebrow>
      <span vzCardBadge variant="primary">TECNOLOGÍA</span>
      <span vzCardRating>★ 4.95</span>
    </div>

    <!-- Título y Subtítulo -->
    <h3 vzCardTitle>Nexus Hardware Lab</h3>
    <span vzCardSubtitle>Periféricos, hardware custom y componentes de precisión</span>

    <!-- Indicadores de Confianza (separados automáticamente por ·) -->
    <div vzCardMeta>
      <span vzCardMetaItem tone="success">✓ Verificado</span>
      <span vzCardMetaItem>🛡️ 99% Seriedad</span>
      <span vzCardMetaItem>🕒 98% Puntualidad</span>
    </div>

    <!-- Divisor Punteado -->
    <hr vzCardDivider />

    <!-- Chips Semánticos de Atributos / Pagos -->
    <div vzCardTags>
      <span vzCardTag tone="success">💵 Efectivo</span>
      <span vzCardTag tone="primary">💳 Digital</span>
      <span vzCardTag tone="warning">🪙 Coin Points</span>
    </div>

    <!-- Fila de Ubicación + Acción Secundaria -->
    <div vzCardInfoRow>
      <span>📍 CDMX · Entregas Zona Centro</span>
      <vz-button size="sm" variant="outline">Ver QR</vz-button>
    </div>
  </div>

  <!-- Pie con Enlace Directo y CTA Principal -->
  <div vzCardFooter>
    <a vzCardLink href="javascript:void(0)">🔗 kintab.app/@nexus-hardw</a>
    <vz-button size="sm" variant="primary" class="btn-pill-cta">Ver Catálogo →</vz-button>
  </div>
</vz-card>`;

  // ── 3. Snippet: Card Muy Completa (Académica / Enterprise) ──
  protected readonly completeAcademicSnippet = `<vz-card variant="elevated" [borderedHeader]="false" hoverable>
  <img
    vzCardImage
    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=700&q=80"
    alt="Control Escolar 2026"
  />

  <div vzCardContent>
    <div vzCardEyebrow>
      <span vzCardBadge variant="info">INGENIERÍA & DATOS</span>
      <span vzCardRating>★ 4.98</span>
    </div>

    <h3 vzCardTitle>Control Escolar · Ciclo 2026-B</h3>
    <span vzCardSubtitle>Expedientes académicos, mallas curriculares y actas digitales</span>

    <div vzCardMeta>
      <span vzCardMetaItem tone="success">✓ RVOE Activo</span>
      <span vzCardMetaItem>🛡️ 96% Eficiencia</span>
      <span vzCardMetaItem>🕒 Matutino</span>
    </div>

    <hr vzCardDivider />

    <div vzCardTags>
      <span vzCardTag tone="success">🎓 Presencial</span>
      <span vzCardTag tone="primary">💻 Lab Cómputo</span>
      <span vzCardTag tone="warning">🏅 Beca Excelencia</span>
    </div>

    <div vzCardInfoRow>
      <span>📍 Plantel Central · Edificio A-402</span>
      <vz-button size="sm" variant="outline">Ver Kárdex</vz-button>
    </div>
  </div>

  <div vzCardFooter>
    <a vzCardLink href="javascript:void(0)">🔗 vayzen.edu/@control-escolar</a>
    <vz-button size="sm" variant="primary" class="btn-pill-cta">Abrir Expediente →</vz-button>
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
      <div vzCardActions>
        <span vzCardBadge variant="success">Activo</span>
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
      <div vzCardActions>
        <span vzCardBadge variant="warning">Pendiente</span>
      </div>
    </div>
    <div vzCardContent>
      <p>El aspirante cuenta con 5 días hábiles para adjuntar su certificado original.</p>
    </div>
  </vz-card>
</div>`;

  protected readonly horizontalSnippet = `<vz-card orientation="horizontal" variant="elevated" [borderedHeader]="false" hoverable>
  <img vzCardImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80" alt="Fotografía del alumno" />
  <div vzCardContent>
    <div vzCardEyebrow>
      <span vzCardBadge variant="success">ALUMNA REGULAR</span>
      <span vzCardRating>★ 9.4 Promedio</span>
    </div>
    <h4 vzCardTitle>Fatima Nava Peralta</h4>
    <span vzCardSubtitle>Matrícula: 2926BG06P002 · CURP: KWIR040107HMNRHN92</span>
    <div vzCardMeta>
      <span vzCardMetaItem tone="success">✓ Reinscrita</span>
      <span vzCardMetaItem>🛡️ 100% Asistencia</span>
      <span vzCardMetaItem>🕒 Semestre 4</span>
    </div>
    <div vzCardTags>
      <span vzCardTag tone="primary">Bachillerato General</span>
      <span vzCardTag tone="success">Beca Institucional</span>
    </div>
  </div>
  <div vzCardFooter>
    <a vzCardLink href="javascript:void(0)">🔗 Expediente #2926-BG</a>
    <vz-button size="sm" variant="primary">Expediente Completo →</vz-button>
  </div>
</vz-card>`;

  protected readonly metricSnippet = `<!-- Widget de Métrica para Dashboards -->
<vz-card variant="elevated" [borderedHeader]="false" [borderedFooter]="false" hoverable>
  <div vzCardHeader>
    <div>
      <span class="metric-label">Alumnos Activos</span>
      <h2 class="metric-value">1,482</h2>
    </div>
    <div class="metric-icon-box metric-icon-box--primary">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
      </svg>
    </div>
  </div>
  <div vzCardContent>
    <div class="metric-trend">
      <span class="trend-badge trend-badge--up">+12.5%</span>
      <span class="trend-text">vs semestre anterior</span>
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
    ['title', 'string', "''", 'Título declarativo de la tarjeta (para cards básicas rápidas).'],
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
    ['[vzCardFooter]', 'Contenedor', 'Área de pie con borde divisor para enlaces y botones CTA.'],
    ['[vzCardImage]', 'Elemento <img>', 'Ajusta y recorta la imagen respetando los radios y orientación de la tarjeta.'],
    ['[vzCardEyebrow]', 'Fila Superior', 'Alinea un badge de categoría a la izquierda y un rating/estado a la derecha.'],
    ['[vzCardBadge]', 'Pastilla (Pill)', 'Badge semántico (variant="primary" | "success" | "warning" | "danger" | "info" | "neutral").'],
    ['[vzCardRating]', 'Indicador', 'Muestra puntaje o calificación en tono ámbar destacado (ej. ★ 4.95).'],
    ['[vzCardMeta]', 'Fila de Confianza', 'Agrupa indicadores en línea separados automáticamente por puntos (·).'],
    ['[vzCardMetaItem]', 'Ítem de Meta', 'Elemento individual dentro de [vzCardMeta] con soporte de tone="success" | "primary" | "default".'],
    ['[vzCardDivider]', 'Separador <hr>', 'Línea divisoria horizontal punteada (dashed) o continua (solid).'],
    ['[vzCardTags]', 'Grupo de Chips', 'Contenedor flexible para chips de atributos o métodos de pago.'],
    ['[vzCardTag]', 'Chip Semántico', 'Etiqueta con borde y fondo suave (tone="success" | "primary" | "warning" | "neutral").'],
    ['[vzCardInfoRow]', 'Fila Inferior', 'Alinea ubicación o metadato secundario a la izquierda y un botón compacto (ej. Ver QR) a la derecha.'],
    ['[vzCardLink]', 'Enlace <a>', 'Enlace estilizado para el pie de la tarjeta con icono y hover limpio.'],
  ];

  protected readonly cssVarRows: [string, string][] = [
    ['--vz-card-bg', 'Color de fondo de la tarjeta (default: #ffffff)'],
    ['--vz-card-color', 'Color del texto principal (default: #1e293b)'],
    ['--vz-card-border-color', 'Color de borde (default: #e2e8f0)'],
    ['--vz-card-border-width', 'Grosor del borde (default: 1px)'],
    ['--vz-card-border-radius', 'Radio de las esquinas (default: 1rem / 16px)'],
    ['--vz-card-shadow', 'Sombra base multicapa de la tarjeta'],
    ['--vz-card-shadow-hover', 'Sombra al pasar el cursor (cuando hoverable=true)'],
    ['--vz-card-padding', 'Espaciado interno de las secciones (header, content, footer)'],
    ['--vz-card-image-height', 'Altura máxima de la imagen superior (default: 210px)'],
    ['--vz-card-title-color', 'Color del título principal (default: #0f172a)'],
    ['--vz-card-title-size', 'Tamaño de fuente del título'],
    ['--vz-card-title-weight', 'Peso tipográfico del título (default: 700)'],
    ['--vz-card-subtitle-color', 'Color de los subtítulos (default: #64748b)'],
    ['--vz-card-header-bg / --vz-card-footer-bg', 'Fondos específicos para cabecera y pie'],
    ['--vz-card-accent-color', 'Color de la barra de acento (variante accent)'],
    ['--vz-card-accent-width', 'Grosor de la barra de acento (default: 4px)'],
  ];
}
