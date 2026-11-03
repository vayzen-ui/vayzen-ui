import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  VZ_CARD_IMPORTS,
  VzButtonComponent,
  type VzCardComment,
} from 'vayzen-ui';
import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';

@Component({
  selector: 'app-card-doc',
  standalone: true,
  imports: [
    FormsModule,
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
  protected readonly basicCardSnippet = `<!-- 1. Simple Card (Todo en Cuerpo · Sin divisiones internas) -->
<vz-card variant="elevated" hoverable>
  <div vzCardContent>
    <span vzCardBadge variant="primary">DESTACADO</span>
    <h3 vzCardTitle>Actualización de Plataforma v2.4</h3>
    <p>
      Se optimizaron las consultas en tiempo real y se habilitó la descarga masiva de reportes ejecutivos en un clic.
    </p>
    <vz-button size="sm" variant="primary">Explorar mejoras →</vz-button>
  </div>
</vz-card>

<!-- 2. Card Básica con Header y Footer -->
<vz-card variant="elevated" hoverable>
  <div vzCardHeader>
    <span class="basic-header-label">📄 Servicios Escolares</span>
    <span vzCardBadge variant="success">● En línea</span>
  </div>
  <div vzCardContent>
    <h3 vzCardTitle>Constancia de Estudios Oficial</h3>
    <span vzCardSubtitle>Emisión digital con firma electrónica</span>
    <p>
      Descarga tu documento oficial con sello digital y código QR de validación institucional al instante.
    </p>
  </div>
  <div vzCardFooter>
    <span class="basic-footer-meta">🕒 Tiempo estimado: 1 min</span>
    <vz-button size="sm" variant="primary">Solicitar →</vz-button>
  </div>
</vz-card>

<!-- 3. Card Declarativa Ultra Ligera (Con inputs title y subtitle) -->
<vz-card
  variant="outlined"
  title="Aviso de Mantenimiento"
  subtitle="Actualización programada · Viernes 22:00 hrs"
>
  <p>
    El portal de servicios permanecerá en mantenimiento preventivo programado durante 45 minutos.
  </p>
  <div vzCardFooter>
    <span class="basic-footer-meta">● Ventana programada</span>
    <a vzCardLink href="javascript:void(0)">Ver estado →</a>
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
    <a vzCardLink href="javascript:void(0)">🔗 nexus.store/@nexus-hardware</a>
    <vz-button size="sm" variant="primary" class="btn-pill-cta">Ver Catálogo →</vz-button>
  </div>
</vz-card>`;

  // ── 3. Snippet: Card Social & Marketplace (Modo Automático por Defecto) ──
  protected readonly socialCardSnippet = `<!-- VzCard construye todo el panel lateral de comentarios automáticamente
     solo pasándole [(drawerOpen)], [comments] y (commentAdded) -->
<vz-card
  variant="elevated"
  [borderedHeader]="false"
  [borderedFooter]="false"
  [(drawerOpen)]="mostrarComentarios"
  [comments]="listaComentarios()"
  drawerTitle="Comentarios"
  drawerBadge="Comunidad Verificada"
  commentPlaceholder="Pregunta sobre este producto..."
  (commentAdded)="agregarComentario($event)"
  [hoverable]="true"
>
  <!-- 1. Encabezado de la Publicación -->
  <div vzCardHeader>
    <div class="feed-store-info">
      <img vzCardAvatar src="avatar.jpg" alt="Nexus Hardware Lab" />
      <div>
        <div class="feed-store-row">
          <h4 vzCardTitle>Nexus Hardware Lab</h4>
          <span class="badge-verified">✓</span>
        </div>
        <span vzCardSubtitle>Hace 35 minutos • @nexus-hardware</span>
      </div>
    </div>
    <div vzCardActions>
      <button type="button" class="btn-store-link">Tienda ↗</button>
    </div>
  </div>

  <!-- 2. Contenido, Multimedia Edge-to-Edge y Barra Logística -->
  <div vzCardContent class="feed-card-content">
    <div class="feed-text-zone">
      <p>
        ¡Acaban de ingresar 8 unidades del Teclado Mecánico Custom 65% con switches lubricados!
        Disponibles para entrega hoy mismo en Punto Seguro o envío programado con pago protegido.
      </p>
      <div class="feed-hashtags">
        <span>#Hardware</span>
        <span>#CustomKeyboard</span>
        <span>#EntregaHoy</span>
      </div>
    </div>

    <!-- Contenedor Multimedia con Píldora Glassmorphism -->
    <div vzCardMedia>
      <img src="teclado-mecanico-custom.jpg" alt="Teclado Mecánico Custom 65% RGB" />
      <div vzCardProductOverlay>
        <div class="product-overlay-info">
          <span vzCardBadge variant="primary">STOCK LIMITADO</span>
          <strong>Teclado Mecánico Pro 65% RGB</strong>
        </div>
        <div class="product-overlay-price-box">
          <span class="price-main">$1850 MXN</span>
          <span class="price-strikethrough">$2199</span>
        </div>
      </div>
    </div>

    <!-- Barra de Logística / Punto de Encuentro -->
    <div vzCardLogistics>
      <span>📅 Punto de Encuentro: <strong>Entrega programada hoy de 16:00 a 19:00 hrs</strong></span>
    </div>
  </div>

  <!-- 3. Barra de Acciones Sociales y CTA -->
  <div vzCardFooter>
    <div class="feed-social-buttons">
      <button type="button" vzCardSocialAction [liked]="leGusta()" (click)="alDarMeGusta()">
        {{ leGusta() ? '❤️' : '🤍' }} {{ totalMeGusta() }}
      </button>
      <button type="button" vzCardSocialAction [active]="mostrarComentarios()" (click)="alternarComentarios()">
        💬 {{ listaComentarios().length }}
      </button>
      <button type="button" vzCardSocialAction>✉️ Mensaje</button>
      <button type="button" vzCardSocialAction>🔗 4</button>
    </div>

    <button type="button" vzCardCta>📅 Agendar Pedido</button>
  </div>
</vz-card>`;

  // ── 3A. Snippet TypeScript: Configuración por Defecto del Panel Automático ──
  protected readonly socialCardTsSnippet = `import { Component, signal } from '@angular/core';
import { VZ_CARD_IMPORTS, type VzCardComment } from 'vayzen-ui';

@Component({
  selector: 'app-publicacion-card',
  standalone: true,
  imports: [...VZ_CARD_IMPORTS],
  templateUrl: './publicacion-card.component.html',
})
export class PublicacionCardComponent {
  readonly mostrarComentarios = signal(false);

  // VzCard recibe este arreglo y construye todo el menú lateral por su cuenta
  readonly listaComentarios = signal<VzCardComment[]>([
    {
      id: 'c1',
      author: 'Carlos Mendoza',
      text: '¿Hacen entregas hoy mismo en Metro Insurgentes después de las 5pm?',
      time: 'Hace 20 min',
      verifiedBuyer: false,
    },
    {
      id: 'c2',
      author: 'Sofía Romero',
      text: 'Excelente ensamble, los switches lubricados suenan perfecto y el tacto es 10/10 🚀',
      time: 'Hace 10 min',
      verifiedBuyer: true,
    },
  ]);

  agregarComentario(texto: string): void {
    this.listaComentarios.update((items) => [
      ...items,
      {
        id: \`c-\${Date.now()}\`,
        author: 'Tú (Usuario Verificado)',
        text: texto,
        time: 'Justo ahora',
        verifiedBuyer: true,
      },
    ]);
  }
}`;

  // ── 3B. Snippet: Panel Lateral Personalizado con <aside vzCardDrawer> ──
  protected readonly socialCustomDrawerSnippet = `<!-- Si requieres un desarrollo a la medida en el panel lateral
     (ej. ficha técnica, rastreo de envío o filtros personalizados),
     proyecta <aside vzCardDrawer> y VzCard reemplazará el panel por defecto -->
<vz-card
  variant="elevated"
  [borderedHeader]="false"
  [borderedFooter]="false"
  [(drawerOpen)]="mostrarPanelCustom"
  [hoverable]="true"
>
  @if (mostrarPanelCustom()) {
    <aside vzCardDrawer class="custom-tech-drawer">
      <div class="custom-drawer-header">
        <h5>⚙️ Ficha Técnica & Garantía</h5>
        <button type="button" (click)="mostrarPanelCustom.set(false)">✕</button>
      </div>

      <div class="custom-drawer-body">
        <div class="spec-item">
          <span>Switches</span>
          <strong>Gateron Oil King (Lubricados Krytox 205g0)</strong>
        </div>
        <div class="spec-item">
          <span>Estructura</span>
          <strong>Gasket Mount con placa de Policarbonato</strong>
        </div>
        <div class="spec-item">
          <span>Conectividad</span>
          <strong>Tri-Modo (USB-C, 2.4GHz, Bluetooth 5.1)</strong>
        </div>
        <div class="spec-item">
          <span>Garantía Directa</span>
          <strong>12 Meses con cambio inmediato</strong>
        </div>
      </div>
    </aside>
  }

  <div vzCardHeader>
    <div class="feed-store-info">
      <img vzCardAvatar src="avatar.jpg" alt="Nexus Hardware Lab" />
      <div>
        <h4 vzCardTitle>Nexus Hardware Lab</h4>
        <span vzCardSubtitle>Edición Especial · Serie Custom</span>
      </div>
    </div>
  </div>

  <div vzCardContent>
    <p>Configuración personalizada donde el desarrollador diseña libremente el contenido del menú lateral izquierdo.</p>
  </div>

  <div vzCardFooter>
    <button type="button" vzCardSocialAction [active]="mostrarPanelCustom()" (click)="alternarPanelCustom()">
      ⚙️ {{ mostrarPanelCustom() ? 'Ocultar Ficha Técnica' : 'Ver Ficha Técnica (Drawer a Medida)' }}
    </button>
    <button type="button" vzCardCta>Solicitar Ensamble</button>
  </div>
</vz-card>`;

  // ── 4. Snippet: Card Muy Completa (Académica / Enterprise) ──
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
      <span vzCardTag tone="neutral">Plantel Central</span>
    </div>
  </div>
  <div vzCardFooter>
    <a vzCardLink href="javascript:void(0)">🔗 Expediente #2926-BG</a>
    <vz-button size="sm" variant="primary" class="btn-pill-cta">Expediente Completo →</vz-button>
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

  protected readonly customThemingSnippet = `<!-- 1. Modo Oscuro Nativo (Integrado por defecto en <vz-card>, cero CSS manual) -->
<vz-card theme="dark" variant="elevated" hoverable>
  <div vzCardHeader>
    <div>
      <h4 vzCardTitle>Modo Oscuro Nativo</h4>
      <span vzCardSubtitle>Incluido de fábrica con theme="dark" o el atributo dark</span>
    </div>
    <span vzCardBadge variant="info">Built-in Dark</span>
  </div>
  <div vzCardContent>
    <p>
      Todos los subcomponentes (badges, chips, meta-items, barra logística y el panel de comentarios)
      adaptan su paleta automáticamente sin escribir una sola línea de CSS.
    </p>
  </div>
  <div vzCardFooter>
    <span>🌙 Soporta theme="dark" | "light" | "auto"</span>
    <vz-button size="sm" variant="primary">Explorar →</vz-button>
  </div>
</vz-card>

<!-- También se activa automáticamente si el contenedor padre o <html> tiene data-theme="dark" -->
<div data-theme="dark">
  <vz-card title="Detección Automática" subtitle="Hereda el modo oscuro del sistema o contenedor">
    <p>No necesitas pasar inputs individuales cuando tu aplicación usa data-theme="dark" o .dark.</p>
  </vz-card>
</div>

<!-- 2. Opcional: Sobrescritura de Tokens CSS para colores de marca personalizados -->
<style>
  .card-brand-indigo {
    --vz-card-bg: #1e1b4b;
    --vz-card-border-color: #312e81;
    --vz-card-title-color: #ffffff;
    --vz-card-subtitle-color: #a5b4fc;
    --vz-card-color: #e0e7ff;
    --vz-card-footer-bg: #151336;
  }
</style>`;

  // ── ESTADO REACTIVO: Tema Global de Previsualización y Card Social ──
  protected readonly previewTheme = signal<'light' | 'dark'>('dark');
  protected readonly mostrarComentarios = signal(false);
  protected readonly mostrarPanelCustom = signal(true);
  protected readonly listaComentarios = signal<VzCardComment[]>([
    {
      id: 'c1',
      author: 'Carlos Mendoza',
      text: '¿Hacen entregas hoy mismo en Metro Insurgentes después de las 5pm?',
      time: 'Hace 20 min',
      verifiedBuyer: false,
    },
    {
      id: 'c2',
      author: 'Sofía Romero',
      text: 'Excelente ensamble, los switches lubricados suenan perfecto y el tacto es 10/10 🚀',
      time: 'Hace 10 min',
      verifiedBuyer: true,
    },
  ]);
  protected readonly leGusta = signal(false);
  protected readonly totalMeGusta = signal(28);

  protected alternarTemaPreview(): void {
    this.previewTheme.update((t) => (t === 'light' ? 'dark' : 'light'));
  }

  protected alternarComentarios(): void {
    this.mostrarComentarios.update((v) => !v);
  }

  protected alternarPanelCustom(): void {
    this.mostrarPanelCustom.update((v) => !v);
  }

  protected alDarMeGusta(): void {
    if (this.leGusta()) {
      this.leGusta.set(false);
      this.totalMeGusta.update((n) => n - 1);
    } else {
      this.leGusta.set(true);
      this.totalMeGusta.update((n) => n + 1);
    }
  }

  protected agregarComentario(textoEmitido: string): void {
    const text = textoEmitido.trim();
    if (!text) return;

    const nuevo: VzCardComment = {
      id: `c-${Date.now()}`,
      author: 'Tú (Usuario Verificado)',
      text,
      time: 'Justo ahora',
      verifiedBuyer: true,
    };

    this.listaComentarios.update((items) => [...items, nuevo]);
  }

  // ── Tablas de Referencia ──
  protected readonly inputRows: [string, string, string, string][] = [
    ['variant', "'elevated' | 'outlined' | 'flat' | 'accent'", "'elevated'", 'Variante visual del contenedor.'],
    ['theme', "'light' | 'dark' | 'auto'", "'light'", 'Tema visual integrado de la tarjeta (soporta modo oscuro nativo o automático según el sistema).'],
    ['dark', 'boolean', 'false', 'Atajo booleano para activar el modo oscuro nativo (ej. <vz-card dark> o [dark]="true").'],
    ['accent', "'primary' | 'success' | 'warning' | 'danger' | 'info' | string", "'primary'", 'Color de la franja en variante accent (soporta palabras clave o hex/rgb).'],
    ['accentPosition', "'top' | 'left'", "'top'", 'Posición de la franja de acento.'],
    ['orientation', "'vertical' | 'horizontal'", "'vertical'", 'Disposición de imagen y contenido.'],
    ['density', "'compact' | 'comfortable' | 'spacious'", "'comfortable'", 'Espaciado interno (padding) de la tarjeta.'],
    ['drawerOpen', 'boolean (model)', 'false', 'Abre o cierra el panel lateral (soporta two-way binding [(drawerOpen)]).'],
    ['comments', 'VzCardComment[]', 'undefined', 'Lista de comentarios para que VzCard arme el panel lateral automáticamente.'],
    ['drawerTitle', 'string', "'Comentarios'", 'Título de la cabecera del panel lateral automático.'],
    ['drawerBadge', 'string', "'Comunidad Verificada'", 'Insignia de confianza mostrada bajo el título del panel.'],
    ['drawerEmptyText', 'string', "'Aún no hay comentarios...'", 'Mensaje mostrado cuando la lista de comentarios está vacía.'],
    ['commentPlaceholder', 'string', "'Pregunta sobre este producto...'", 'Placeholder del formulario integrado para publicar comentarios.'],
    ['buyerBadgeLabel', 'string', "'Comprador'", 'Etiqueta mostrada en comentarios con verifiedBuyer = true.'],
    ['showCommentForm', 'boolean', 'true', 'Muestra u oculta el formulario inferior para escribir comentarios.'],
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
    ['commentAdded', 'string', 'Se emite con el texto del nuevo comentario cuando el usuario envía el formulario del panel.'],
    ['drawerClosed', 'void', 'Se emite cuando el usuario cierra el panel lateral desde el botón (✕) de la cabecera.'],
  ];

  protected readonly directiveRows: [string, string, string][] = [
    ['[vzCardHeader]', 'Contenedor', 'Agrupa título, subtítulo y acciones en la parte superior.'],
    ['[vzCardTitle]', 'Texto', 'Aplica estilos y jerarquía tipográfica al título principal.'],
    ['[vzCardSubtitle]', 'Texto', 'Aplica color secundario y tamaño adecuado al subtítulo.'],
    ['[vzCardActions]', 'Contenedor', 'Espacio para botones o iconos alineados al final del header.'],
    ['[vzCardContent]', 'Contenedor', 'Área para el contenido o cuerpo principal de la tarjeta.'],
    ['[vzCardFooter]', 'Contenedor', 'Área de pie con borde divisor para enlaces y botones CTA.'],
    ['[vzCardImage]', 'Elemento <img>', 'Ajusta y recorta la imagen respetando los radios y orientación de la tarjeta.'],
    ['[vzCardDrawer]', 'Panel Personalizado', 'Opcional: Proyecta un panel lateral propio a medida en lugar del panel de comentarios automático.'],
    ['[vzCardProductOverlay]', 'Píldora Flotante', 'Caja flotante con efecto blur glassmorphism sobre imágenes (nombre, badge y precio destacado).'],
    ['[vzCardAvatar]', 'Elemento <img>', 'Avatar cuadrado redondeado (44x44px) para tiendas o autores en la cabecera.'],
    ['[vzCardMedia]', 'Contenedor', 'Contenedor multimedia edge-to-edge con soporte integrado para [vzCardProductOverlay].'],
    ['[vzCardLogistics]', 'Barra de Aviso', 'Barra horizontal edge-to-edge para avisos de entrega, horario o punto de encuentro.'],
    ['[vzCardSocialAction]', 'Botón <button>', 'Botón píldora interactivo para acciones sociales (soporta inputs [liked] y [active]).'],
    ['[vzCardCta]', 'Botón / Enlace', 'Botón CTA principal en forma de píldora con sombra destacada (ej. Agendar Pedido).'],
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
    ['--vz-card-drawer-bg', 'Color de fondo del panel lateral / drawer (default: #f8fafc)'],
    ['--vz-card-title-color', 'Color del título principal (default: #0f172a)'],
    ['--vz-card-title-size', 'Tamaño de fuente del título'],
    ['--vz-card-title-weight', 'Peso tipográfico del título (default: 700)'],
    ['--vz-card-subtitle-color', 'Color de los subtítulos (default: #64748b)'],
    ['--vz-card-header-bg / --vz-card-footer-bg', 'Fondos específicos para cabecera y pie'],
    ['--vz-card-accent-color', 'Color de la barra de acento (variante accent)'],
    ['--vz-card-accent-width', 'Grosor de la barra de acento (default: 4px)'],
  ];
}
