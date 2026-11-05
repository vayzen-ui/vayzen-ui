import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  VZ_CARD_IMPORTS,
  VZ_MODAL_IMPORTS,
  VzButtonComponent,
  VzButtonSize,
  VzButtonVariant,
  VzCardAccent,
  VzCardAccentPosition,
  VzCardDensity,
  VzCardOrientation,
  VzCardVariant,
  VzColumn,
  VzComboboxComponent,
  VzComboboxOption,
  VzComboboxSize,
  VzComboboxVariant,
  VzModalPosition,
  VzModalSize,
  VzTableComponent,
  VzTableDensity,
  VzTableVariant,
} from 'vayzen-ui';
import { CodeBlockComponent } from '../../shared/components/code-block/code-block.component';

export type StudioComponentType = 'card' | 'button' | 'table' | 'combobox' | 'modal';
export type StudioStageTab = 'preview' | 'code' | 'tokens';
export type StudioCanvasBg = 'dots' | 'white' | 'slate';
export type StudioCardComplexity = 'complete' | 'basic';

export interface StudioComponentDefinition {
  id: StudioComponentType;
  name: string;
  icon: string;
  badge: string;
  description: string;
  docLink: string;
}

interface EmployeeItem {
  id: number;
  folio: string;
  nombre: string;
  correo: string;
  avatar?: string;
  puesto: string;
  departamento: string;
  kpi: number;
  salario: number;
  estatus: 'Activo' | 'Inactivo' | 'Pendiente';
}

@Component({
  selector: 'app-studio',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    CodeBlockComponent,
    ...VZ_CARD_IMPORTS,
    ...VZ_MODAL_IMPORTS,
    VzButtonComponent,
    VzTableComponent,
    VzComboboxComponent,
  ],
  templateUrl: './studio.component.html',
  styleUrls: ['../../shared/styles/doc-page.css', './studio.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudioComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  // ── Navigation & Studio State ──
  readonly activeComponent = signal<StudioComponentType>('card');
  readonly stageTab = signal<StudioStageTab>('preview');
  readonly canvasBg = signal<StudioCanvasBg>('dots');
  readonly isPickerOpen = signal(false);
  readonly pickerSearch = signal('');

  // ── Componentes Disponibles (100% interactivos y reales) ──
  readonly availableComponents: StudioComponentDefinition[] = [
    {
      id: 'card',
      name: 'Card',
      icon: '🃏',
      badge: 'Contenedor',
      description: 'Contenedor modular para cards básicas y cards completas Pro.',
      docLink: '/components/card',
    },
    {
      id: 'button',
      name: 'Button',
      icon: '🔘',
      badge: 'Acción',
      description: 'Botón táctil nativo con variantes visuales y tamaños escalables.',
      docLink: '/components/button',
    },
    {
      id: 'table',
      name: 'Table',
      icon: '📊',
      badge: 'Datos',
      description: 'Tabla de datos reactiva con ordenamiento, badges y selección.',
      docLink: '/components/table',
    },
    {
      id: 'combobox',
      name: 'Combobox',
      icon: '🔍',
      badge: 'Formularios',
      description: 'Selector inteligente con búsqueda en vivo, portal anti-colisión y modo oscuro.',
      docLink: '/components/combobox',
    },
    {
      id: 'modal',
      name: 'Modal & Diálogos',
      icon: '🪟',
      badge: 'Feedback',
      description: 'Ventanas modales, diálogos de confirmación y paneles laterales (drawers).',
      docLink: '/components/modals',
    },
  ];

  // Componente activo actual
  readonly currentComponentInfo = computed(() => {
    const current = this.activeComponent();
    return this.availableComponents.find((c) => c.id === current) || this.availableComponents[0];
  });

  // Filtro de búsqueda dentro del selector
  readonly filteredComponents = computed(() => {
    const q = this.pickerSearch().trim().toLowerCase();
    if (!q) return this.availableComponents;
    return this.availableComponents.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.badge.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    );
  });

  // Agrupación automática por categoría para escala infinita
  readonly groupedComponents = computed(() => {
    const items = this.filteredComponents();
    const groups: { [key: string]: StudioComponentDefinition[] } = {};
    for (const item of items) {
      if (!groups[item.badge]) {
        groups[item.badge] = [];
      }
      groups[item.badge].push(item);
    }
    return Object.keys(groups).map((badge) => ({
      badge,
      items: groups[badge],
    }));
  });

  togglePicker(): void {
    this.isPickerOpen.update((open) => !open);
    if (!this.isPickerOpen()) {
      this.pickerSearch.set('');
    }
  }

  closePicker(): void {
    this.isPickerOpen.set(false);
    this.pickerSearch.set('');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const comp = params['component'] as StudioComponentType;
      if (comp && ['card', 'button', 'table', 'combobox'].includes(comp)) {
        this.activeComponent.set(comp);
      }
    });
  }

  selectComponent(id: string): void {
    if (['card', 'button', 'table', 'combobox'].includes(id)) {
      this.activeComponent.set(id as StudioComponentType);
      this.closePicker();
    }
  }

  // ══════════════════════════════════════════
  // CARD STUDIO STATE & COMPUTEDS
  // ══════════════════════════════════════════
  protected readonly cardComplexity = signal<StudioCardComplexity>('complete');
  protected readonly cardTheme = signal<'light' | 'dark'>('light');
  protected readonly cardVariant = signal<VzCardVariant>('elevated');
  protected readonly cardAccent = signal<VzCardAccent>('primary');
  protected readonly cardAccentPosition = signal<VzCardAccentPosition>('top');
  protected readonly cardOrientation = signal<VzCardOrientation>('vertical');
  protected readonly cardDensity = signal<VzCardDensity>('comfortable');
  protected readonly cardBorderedHeader = signal(false);
  protected readonly cardBorderedFooter = signal(true);
  protected readonly cardHoverable = signal(true);
  protected readonly cardClickable = signal(false);
  protected readonly cardLoading = signal(false);
  protected readonly cardDisabled = signal(false);
  protected readonly cardShowImage = signal(true);

  // Toggles de bloques ricos para Card Completa
  protected readonly cardShowEyebrow = signal(true);
  protected readonly cardShowMeta = signal(true);
  protected readonly cardShowTags = signal(true);
  protected readonly cardShowInfoRow = signal(true);

  protected readonly cardLastEvent = signal('');

  protected readonly accentOptions = [
    { id: 'primary', label: 'Blue', color: '#2563eb' },
    { id: 'success', label: 'Green', color: '#10b981' },
    { id: 'warning', label: 'Amber', color: '#f59e0b' },
    { id: 'danger', label: 'Red', color: '#ef4444' },
    { id: 'info', label: 'Purple', color: '#8b5cf6' },
  ];

  protected onCardClick(): void {
    this.cardLastEvent.set(`clicked → ${new Date().toLocaleTimeString()}`);
  }

  protected resetCardDefaults(): void {
    this.cardComplexity.set('complete');
    this.cardTheme.set('light');
    this.cardVariant.set('elevated');
    this.cardAccent.set('primary');
    this.cardAccentPosition.set('top');
    this.cardOrientation.set('vertical');
    this.cardDensity.set('comfortable');
    this.cardBorderedHeader.set(false);
    this.cardBorderedFooter.set(true);
    this.cardHoverable.set(true);
    this.cardClickable.set(false);
    this.cardLoading.set(false);
    this.cardDisabled.set(false);
    this.cardShowImage.set(true);
    this.cardShowEyebrow.set(true);
    this.cardShowMeta.set(true);
    this.cardShowTags.set(true);
    this.cardShowInfoRow.set(true);
    this.cardLastEvent.set('Valores restablecidos');
  }

  protected readonly cardCode = computed(() => {
    const mode = this.cardComplexity();
    const th = this.cardTheme();
    const v = this.cardVariant();
    const a = this.cardAccent();
    const ap = this.cardAccentPosition();
    const o = this.cardOrientation();
    const d = this.cardDensity();
    const bh = this.cardBorderedHeader();
    const bf = this.cardBorderedFooter();
    const h = this.cardHoverable();
    const c = this.cardClickable();
    const l = this.cardLoading();
    const dis = this.cardDisabled();
    const img = this.cardShowImage();

    const attrs = [
      th === 'dark' ? 'theme="dark"' : '',
      v !== 'elevated' ? `variant="${v}"` : '',
      v === 'accent' && a !== 'primary' ? `accent="${a}"` : '',
      v === 'accent' && ap !== 'top' ? `accentPosition="${ap}"` : '',
      o !== 'vertical' ? `orientation="${o}"` : '',
      d !== 'comfortable' ? `density="${d}"` : '',
      !bh ? '[borderedHeader]="false"' : '',
      !bf ? '[borderedFooter]="false"' : '',
      h ? 'hoverable' : '',
      c ? 'clickable (clicked)="onCardClick($event)"' : '',
      l ? '[loading]="true"' : '',
      dis ? '[disabled]="true"' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const attrStr = attrs ? ` ${attrs}` : '';

    if (mode === 'basic') {
      if (!img) {
        return `<vz-card${attrStr} title="Aviso de Mantenimiento" subtitle="Viernes 22:00 hrs">
  <p>El portal de servicios escolares permanecerá en mantenimiento preventivo durante 45 minutos.</p>
</vz-card>`;
      }
      return `<vz-card${attrStr}>
  <img vzCardImage src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80" alt="Aula" />
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
    <span class="text-muted">Tiempo: 1 min</span>
    <vz-button size="sm" variant="primary">Solicitar</vz-button>
  </div>
</vz-card>`;
    }

    // Complete Mode
    const lines: string[] = [`<vz-card${attrStr}>`];
    if (img) {
      lines.push(
        `  <img vzCardImage src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=700&q=80" alt="Nexus Hardware Lab" />`
      );
    }
    lines.push(`  <div vzCardContent>`);
    if (this.cardShowEyebrow()) {
      lines.push(`    <div vzCardEyebrow>`);
      lines.push(`      <span vzCardBadge variant="primary">TECNOLOGÍA</span>`);
      lines.push(`      <span vzCardRating>★ 4.95</span>`);
      lines.push(`    </div>`);
    }
    lines.push(`    <h3 vzCardTitle>Nexus Hardware Lab</h3>`);
    lines.push(`    <span vzCardSubtitle>Periféricos, hardware custom y componentes de precisión</span>`);
    if (this.cardShowMeta()) {
      lines.push(`    <div vzCardMeta>`);
      lines.push(`      <span vzCardMetaItem tone="success">✓ Verificado</span>`);
      lines.push(`      <span vzCardMetaItem>🛡️ 99% Seriedad</span>`);
      lines.push(`      <span vzCardMetaItem>🕒 98% Puntualidad</span>`);
      lines.push(`    </div>`);
    }
    if (this.cardShowTags()) {
      lines.push(`    <hr vzCardDivider />`);
      lines.push(`    <div vzCardTags>`);
      lines.push(`      <span vzCardTag tone="success">💵 Efectivo</span>`);
      lines.push(`      <span vzCardTag tone="primary">💳 Digital</span>`);
      lines.push(`      <span vzCardTag tone="warning">🪙 Coin Points</span>`);
      lines.push(`    </div>`);
    }
    if (this.cardShowInfoRow()) {
      lines.push(`    <div vzCardInfoRow>`);
      lines.push(`      <span>📍 CDMX · Entregas Zona Centro</span>`);
      lines.push(`      <vz-button size="sm" variant="outline">Ver QR</vz-button>`);
      lines.push(`    </div>`);
    }
    lines.push(`  </div>`);
    lines.push(`  <div vzCardFooter>`);
    lines.push(`    <a vzCardLink href="javascript:void(0)">🔗 nexus.store/@nexus-hardware</a>`);
    lines.push(`    <vz-button size="sm" variant="primary">Ver Catálogo →</vz-button>`);
    lines.push(`  </div>`);
    lines.push(`</vz-card>`);
    return lines.join('\n');
  });

  protected readonly cardTokensCode = computed(() => {
    const v = this.cardVariant();
    const a = this.cardAccent();
    const d = this.cardDensity();

    const radius = '1rem';
    const padding = d === 'compact' ? '0.875rem 1.125rem' : d === 'spacious' ? '1.625rem 1.875rem' : '1.25rem 1.375rem';
    const shadow = v === 'flat' ? 'none' : '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 1px 3px 0 rgba(15, 23, 42, 0.04)';

    return `/* Sobrescribe los Design Tokens de VzCard para tu proyecto */
.mi-tarjeta-personalizada {
  --vz-card-bg: #ffffff;
  --vz-card-color: #1e293b;
  --vz-card-border-color: #e2e8f0;
  --vz-card-border-radius: ${radius};
  --vz-card-shadow: ${shadow};
  --vz-card-padding: ${padding};
  --vz-card-accent-color: var(--vz-${a}, #2563eb);
  --vz-card-accent-width: 4px;
  --vz-card-title-color: #0f172a;
  --vz-card-subtitle-color: #64748b;
  --vz-card-footer-bg: #f8fafc;
}`;
  });

  // ══════════════════════════════════════════
  // BUTTON STUDIO STATE
  // ══════════════════════════════════════════
  protected readonly btnVariant = signal<VzButtonVariant>('primary');
  protected readonly btnSize = signal<VzButtonSize>('md');
  protected readonly btnDisabled = signal(false);
  protected readonly btnText = signal('Explorar Sistema');
  protected readonly btnLastEvent = signal('');

  protected onBtnClick(): void {
    this.btnLastEvent.set(`clicked → ${new Date().toLocaleTimeString()}`);
  }

  protected readonly btnCode = computed(() => {
    const v = this.btnVariant();
    const s = this.btnSize();
    const d = this.btnDisabled();
    const t = this.btnText();

    const attrs = [
      v !== 'primary' ? `variant="${v}"` : '',
      s !== 'md' ? `size="${s}"` : '',
      d ? '[disabled]="true"' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const attrStr = attrs ? ` ${attrs}` : '';
    return `<vz-button${attrStr} (clicked)="onAction()">
  ${t}
</vz-button>`;
  });

  // ══════════════════════════════════════════
  // TABLE STUDIO STATE
  // ══════════════════════════════════════════
  protected readonly tableComplexity = signal<'complete' | 'basic'>('complete');
  protected readonly tableTheme = signal<'light' | 'dark'>('light');
  protected readonly tableVariant = signal<VzTableVariant>('elevated');
  protected readonly tableDensity = signal<VzTableDensity>('comfortable');
  protected readonly tableStriped = signal(false);
  protected readonly tableHoverable = signal(true);
  protected readonly tableBordered = signal(false);
  protected readonly tableSelectable = signal(true);
  protected readonly tableExportable = signal(true);
  protected readonly tableLoading = signal(false);
  protected readonly tableLastEvent = signal('');

  protected readonly tableColumns: VzColumn<EmployeeItem>[] = [
    { key: 'folio', header: 'ID', type: 'code', width: '6.5rem' },
    {
      key: 'nombre',
      header: 'Colaborador',
      type: 'user',
      avatarKey: 'avatar',
      subtitleKey: 'correo',
      minWidth: '14.5rem',
    },
    { key: 'departamento', header: 'Área & Puesto', subtitleKey: 'puesto', minWidth: '12.5rem' },
    { key: 'kpi', header: 'KPI', type: 'progress', minWidth: '8.5rem' },
    { key: 'salario', header: 'Compensación', type: 'currency' },
    { key: 'estatus', header: 'Estatus', type: 'badge' },
    {
      key: 'actions',
      header: 'Acciones',
      type: 'actions',
      actions: [
        { name: 'view', label: 'Ver detalle', icon: 'view' },
        { name: 'edit', label: 'Editar', icon: 'edit' },
        { name: 'delete', label: 'Eliminar', icon: 'delete', variant: 'danger' },
      ],
    },
  ];

  protected readonly tableBasicColumns: VzColumn<EmployeeItem>[] = [
    { key: 'folio', header: 'Folio', type: 'code', width: '6.5rem' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'departamento', header: 'Departamento' },
    { key: 'estatus', header: 'Estatus', type: 'badge', badgeStyle: 'dot' },
  ];

  protected readonly tableData: EmployeeItem[] = [
    {
      id: 1,
      folio: '#EMP-1041',
      nombre: 'Fátima Nava Peralta',
      correo: 'fatima.nava@vayzen.dev',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80',
      puesto: 'Coordinadora Académica',
      departamento: 'Control Escolar',
      kpi: 96,
      salario: 38500,
      estatus: 'Activo',
    },
    {
      id: 2,
      folio: '#EMP-1042',
      nombre: 'Luis Hernández Vega',
      correo: 'luis.hernandez@vayzen.dev',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80',
      puesto: 'Principal Cloud Architect',
      departamento: 'Ingeniería & Cloud',
      kpi: 88,
      salario: 64200,
      estatus: 'Activo',
    },
    {
      id: 3,
      folio: '#EMP-1043',
      nombre: 'Sofía Torres Alarcón',
      correo: 'sofia.torres@vayzen.dev',
      puesto: 'Analista de Ciberseguridad',
      departamento: 'Seguridad TI',
      kpi: 64,
      salario: 42000,
      estatus: 'Pendiente',
    },
    {
      id: 4,
      folio: '#EMP-1044',
      nombre: 'Rogelio Valboa Buena',
      correo: 'rogelio.valboa@vayzen.dev',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80',
      puesto: 'Supervisor Administrativo',
      departamento: 'Finanzas Corporativas',
      kpi: 34,
      salario: 31800,
      estatus: 'Inactivo',
    },
  ];

  protected resetTableDefaults(): void {
    this.tableComplexity.set('complete');
    this.tableTheme.set('light');
    this.tableVariant.set('elevated');
    this.tableDensity.set('comfortable');
    this.tableStriped.set(false);
    this.tableHoverable.set(true);
    this.tableBordered.set(false);
    this.tableSelectable.set(true);
    this.tableExportable.set(true);
    this.tableLoading.set(false);
    this.tableLastEvent.set('Valores restablecidos');
  }

  protected onTableRowAction(event: any): void {
    this.tableLastEvent.set(`rowAction → [${event.action}] ${event.row.nombre}`);
  }

  protected readonly tableCode = computed(() => {
    const comp = this.tableComplexity();
    const th = this.tableTheme();
    const v = this.tableVariant();
    const d = this.tableDensity();
    const s = this.tableStriped();
    const h = this.tableHoverable();
    const b = this.tableBordered();
    const sel = this.tableSelectable();
    const exp = this.tableExportable();
    const l = this.tableLoading();

    const attrs = [
      th === 'dark' ? 'theme="dark"' : '',
      v !== 'elevated' ? `variant="${v}"` : '',
      comp === 'complete' ? 'heading="Directorio de Talento & Ingeniería"' : '',
      comp === 'complete' ? 'subtitle="Gestión integral de colaboradores y KPI"' : '',
      '[columns]="columns"',
      '[data]="rows"',
      d !== 'comfortable' ? `density="${d}"` : '',
      s ? 'striped' : '',
      !h ? '[hoverable]="false"' : '',
      b ? 'bordered' : '',
      comp === 'complete' && sel ? 'selectable rowKey="id"' : '',
      comp === 'complete' && exp ? 'exportable' : '',
      comp === 'basic' ? '[searchable]="false" [pagination]="false" [showCount]="false"' : '',
      l ? '[loading]="true"' : '',
    ]
      .filter(Boolean)
      .join('\n  ');

    return `<vz-table\n  ${attrs}\n/>`;
  });

  protected readonly tableTokensCode = computed(() => {
    const th = this.tableTheme();
    const d = this.tableDensity();
    const py = d === 'compact' ? '0.5rem' : d === 'spacious' ? '1.125rem' : '0.85rem';
    const px = d === 'compact' ? '0.85rem' : d === 'spacious' ? '1.375rem' : '1.125rem';

    if (th === 'dark') {
      return `/* Tokens activos en Modo Oscuro de VzTable */
.mi-tabla-personalizada {
  --vz-table-bg: #0f172a;
  --vz-table-title-color: #f8fafc;
  --vz-table-color: #e2e8f0;
  --vz-table-muted-color: #94a3b8;
  --vz-table-border-color: #1e293b;
  --vz-table-header-bg: #0b1120;
  --vz-table-header-color: #94a3b8;
  --vz-table-row-hover-bg: rgba(30, 41, 59, 0.7);
  --vz-table-accent: #3b82f6;
  --vz-table-cell-padding-y: ${py};
  --vz-table-cell-padding-x: ${px};
}`;
    }

    return `/* Sobrescribe los Design Tokens de VzTable para tu proyecto */
.mi-tabla-personalizada {
  --vz-table-bg: #ffffff;
  --vz-table-title-color: #0f172a;
  --vz-table-color: #1e293b;
  --vz-table-muted-color: #64748b;
  --vz-table-border-color: #e2e8f0;
  --vz-table-radius: 0.875rem;
  --vz-table-header-bg: #f8fafc;
  --vz-table-header-color: #475569;
  --vz-table-row-hover-bg: #f8fafc;
  --vz-table-accent: #2563eb;
  --vz-table-cell-padding-y: ${py};
  --vz-table-cell-padding-x: ${px};
}`;
  });

  // ══════════════════════════════════════════
  // COMBOBOX STUDIO STATE & COMPUTEDS
  // ══════════════════════════════════════════
  protected readonly comboboxComplexity = signal<'complete' | 'basic'>('complete');
  protected readonly comboboxTheme = signal<'light' | 'dark'>('light');
  protected readonly comboboxVariant = signal<VzComboboxVariant>('outline');
  protected readonly comboboxSize = signal<VzComboboxSize>('md');
  protected readonly comboboxClearable = signal(true);
  protected readonly comboboxLoading = signal(false);
  protected readonly comboboxDisabled = signal(false);
  protected readonly comboboxShowIcon = signal(true);
  protected readonly comboboxShowAll = signal(true);
  protected readonly comboboxSelected = signal<any>(101);
  protected readonly comboboxLastEvent = signal('');

  protected readonly comboboxProOptions: VzComboboxOption<number>[] = [
    {
      id: 101,
      descripcion: 'Vayzen Technologies Corp.',
      subtitle: 'Sede Central · CDMX, México',
      badge: 'Tier 1',
      badgeVariant: 'primary',
      icon: 'building',
    },
    {
      id: 102,
      descripcion: 'Global Logistics Latam',
      subtitle: 'Bogotá, Colombia · Logística & Carga',
      badge: 'Verificado',
      badgeVariant: 'success',
      icon: 'building',
    },
    {
      id: 103,
      descripcion: 'Iberia Cloud Services',
      subtitle: 'Madrid, España · Nube & DevOps',
      badge: 'En Revisión',
      badgeVariant: 'warning',
      icon: 'building',
    },
    {
      id: 104,
      descripcion: 'Austral CyberSec Group',
      subtitle: 'Buenos Aires, Argentina · SOC 24/7',
      badge: 'Crítico',
      badgeVariant: 'danger',
      icon: 'building',
    },
    {
      id: 105,
      descripcion: 'Andes FinTech SpA',
      subtitle: 'Santiago, Chile · Inactivo',
      badge: 'Inactivo',
      badgeVariant: 'neutral',
      activo: false,
      icon: 'building',
    },
  ];

  protected readonly comboboxBasicOptions: VzComboboxOption<string>[] = [
    { id: 'MX', descripcion: 'México' },
    { id: 'CO', descripcion: 'Colombia' },
    { id: 'ES', descripcion: 'España' },
    { id: 'AR', descripcion: 'Argentina' },
    { id: 'CL', descripcion: 'Chile' },
    { id: 'PE', descripcion: 'Perú' },
  ];

  protected readonly comboboxActiveOptions = computed<VzComboboxOption<any>[]>(() =>
    this.comboboxComplexity() === 'complete' ? this.comboboxProOptions : this.comboboxBasicOptions
  );

  protected resetComboboxDefaults(): void {
    this.comboboxComplexity.set('complete');
    this.comboboxTheme.set('light');
    this.comboboxVariant.set('outline');
    this.comboboxSize.set('md');
    this.comboboxClearable.set(true);
    this.comboboxLoading.set(false);
    this.comboboxDisabled.set(false);
    this.comboboxShowIcon.set(true);
    this.comboboxShowAll.set(true);
    this.comboboxSelected.set(101);
    this.comboboxLastEvent.set('Valores restablecidos');
  }

  protected onComboboxSelection(val: any): void {
    this.comboboxLastEvent.set(`selectionChange → ${val ?? 'null (limpiado)'}`);
  }

  protected readonly comboboxCode = computed(() => {
    const comp = this.comboboxComplexity();
    const th = this.comboboxTheme();
    const v = this.comboboxVariant();
    const s = this.comboboxSize();
    const clr = this.comboboxClearable();
    const l = this.comboboxLoading();
    const dis = this.comboboxDisabled();
    const icon = this.comboboxShowIcon();
    const showAll = this.comboboxShowAll();

    const attrs = [
      th === 'dark' ? 'theme="dark"' : '',
      v !== 'outline' ? `variant="${v}"` : '',
      s !== 'md' ? `size="${s}"` : '',
      comp === 'complete' && icon ? 'icon="building"' : '',
      comp === 'complete' ? 'placeholder="Seleccionar corporativo..."' : 'placeholder="Seleccionar país..."',
      comp === 'complete' ? 'searchPlaceholder="Buscar por nombre, ID o ciudad..."' : '',
      comp === 'complete' ? 'allOptionText="Todos los corporativos"' : '',
      !showAll ? '[showAllOption]="false"' : '',
      clr ? '[clearable]="true"' : '',
      l ? '[loading]="true"' : '',
      dis ? '[disabled]="true"' : '',
      comp === 'complete' ? '[options]="empresas"' : '[options]="paises"',
      '[(ngModel)]="selectedItem"',
      '(selectionChange)="onSelectionChange($event)"',
    ]
      .filter(Boolean)
      .join('\n  ');

    return `<vz-combobox\n  ${attrs}\n/>`;
  });

  protected readonly comboboxTokensCode = computed(() => {
    const th = this.comboboxTheme();
    if (th === 'dark') {
      return `/* Design Tokens en Modo Oscuro para VzCombobox */
.mi-combobox-personalizado {
  --vz-combobox-bg: #0f172a;
  --vz-combobox-border: #334155;
  --vz-combobox-color: #f8fafc;
  --vz-combobox-placeholder-color: #94a3b8;
  --vz-combobox-accent: #3b82f6;
  --vz-combobox-dropdown-bg: #0f172a;
  --vz-combobox-item-hover-bg: #1e293b;
  --vz-combobox-item-active-bg: rgba(59, 130, 246, 0.15);
  --vz-combobox-radius: 0.5rem;
}`;
    }

    return `/* Sobrescribe los Design Tokens de VzCombobox */
.mi-combobox-personalizado {
  --vz-combobox-bg: #ffffff;
  --vz-combobox-border: #e2e8f0;
  --vz-combobox-color: #0f172a;
  --vz-combobox-placeholder-color: #64748b;
  --vz-combobox-accent: #2563eb;
  --vz-combobox-dropdown-bg: #ffffff;
  --vz-combobox-item-hover-bg: #f8fafc;
  --vz-combobox-item-active-bg: rgba(37, 99, 235, 0.08);
  --vz-combobox-radius: 0.5rem;
}`;
  });

  // ══════════════════════════════════════════════════════════════════════════
  // MODAL STUDIO CONTROLS & STATE
  // ══════════════════════════════════════════════════════════════════════════
  protected readonly modalTheme = signal<'light' | 'dark'>('light');
  protected readonly modalSize = signal<VzModalSize>('md');
  protected readonly modalPosition = signal<VzModalPosition>('center');
  protected readonly modalTitle = signal<string>('Confirmar Operación');
  protected readonly modalSubtitle = signal<string>('Esta acción actualizará los registros del sistema');
  protected readonly modalIcon = signal<string>('alert');
  protected readonly modalAllowOverflow = signal<boolean>(true);
  protected readonly modalFullscreenToggle = signal<boolean>(true);
  protected readonly modalStaticBackdrop = signal<boolean>(false);
  protected readonly isStudioModalOpen = signal<boolean>(false);
  protected readonly modalLastEvent = signal<string>('');

  protected resetModalDefaults(): void {
    this.modalTheme.set('light');
    this.modalSize.set('md');
    this.modalPosition.set('center');
    this.modalTitle.set('Confirmar Operación');
    this.modalSubtitle.set('Esta acción actualizará los registros del sistema');
    this.modalIcon.set('alert');
    this.modalAllowOverflow.set(true);
    this.modalFullscreenToggle.set(true);
    this.modalStaticBackdrop.set(false);
    this.modalLastEvent.set('Valores restablecidos');
  }

  protected readonly modalCode = computed(() => {
    const th = this.modalTheme();
    const s = this.modalSize();
    const pos = this.modalPosition();
    const t = this.modalTitle();
    const sub = this.modalSubtitle();
    const icon = this.modalIcon();
    const ov = this.modalAllowOverflow();
    const fs = this.modalFullscreenToggle();
    const sb = this.modalStaticBackdrop();

    const attrs = [
      '[(open)]="isOpen"',
      th === 'dark' ? 'theme="dark"' : '',
      `title="${t}"`,
      sub ? `subtitle="${sub}"` : '',
      icon ? `icon="${icon}"` : '',
      s !== 'md' ? `size="${s}"` : '',
      pos !== 'center' ? `position="${pos}"` : '',
      ov ? '[allowDropdownOverflow]="true"' : '',
      fs ? '[fullscreenToggle]="true"' : '',
      sb ? '[staticBackdrop]="true"' : '',
    ]
      .filter(Boolean)
      .join('\n  ');

    return `<vz-modal\n  ${attrs}\n>\n  <div vzModalBody>\n    <p>Contenido del cuerpo del modal configurado en Vayzen Studio.</p>\n  </div>\n\n  <div vzModalActions>\n    <vz-button variant="outline" (clicked)="isOpen = false">Cancelar</vz-button>\n    <vz-button color="primary" (clicked)="isOpen = false">Aceptar</vz-button>\n  </div>\n</vz-modal>`;
  });

  protected readonly modalTokensCode = computed(() => {
    const th = this.modalTheme();
    if (th === 'dark') {
      return `/* Design Tokens en Modo Oscuro para VzModal */
.mi-modal-personalizado {
  --vz-modal-bg: #0f172a;
  --vz-modal-color: #f8fafc;
  --vz-modal-border: #1e293b;
  --vz-modal-shadow: 0 25px 60px -10px rgba(0, 0, 0, 0.7);
  --vz-modal-backdrop-bg: rgba(2, 6, 23, 0.75);
  --vz-modal-radius: 14px;
}`;
    }

    return `/* Sobrescribe los Design Tokens de VzModal */
.mi-modal-personalizado {
  --vz-modal-bg: #ffffff;
  --vz-modal-color: #0f172a;
  --vz-modal-border: #e2e8f0;
  --vz-modal-shadow: 0 20px 45px -10px rgba(15, 23, 42, 0.18);
  --vz-modal-backdrop-bg: rgba(15, 23, 42, 0.6);
  --vz-modal-radius: 14px;
}`;
  });
}
