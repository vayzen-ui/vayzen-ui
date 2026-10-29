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
  VzButtonComponent,
  VzButtonSize,
  VzButtonVariant,
  VzCardAccent,
  VzCardAccentPosition,
  VzCardDensity,
  VzCardOrientation,
  VzCardVariant,
  VzColumn,
  VzTableComponent,
  VzTableDensity,
} from 'vayzen-ui';
import { CodeBlockComponent } from '../../shared/components/code-block/code-block.component';

export type StudioComponentType = 'card' | 'button' | 'table';
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
  nombre: string;
  puesto: string;
  departamento: string;
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
    VzButtonComponent,
    VzTableComponent,
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
      if (comp && ['card', 'button', 'table'].includes(comp)) {
        this.activeComponent.set(comp);
      }
    });
  }

  selectComponent(id: string): void {
    if (['card', 'button', 'table'].includes(id)) {
      this.activeComponent.set(id as StudioComponentType);
      this.closePicker();
    }
  }

  // ══════════════════════════════════════════
  // CARD STUDIO STATE & COMPUTEDS
  // ══════════════════════════════════════════
  protected readonly cardComplexity = signal<StudioCardComplexity>('complete');
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
    lines.push(`    <a vzCardLink href="javascript:void(0)">🔗 kintab.app/@nexus-hardw</a>`);
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
  protected readonly tableDensity = signal<VzTableDensity>('comfortable');
  protected readonly tableStriped = signal(false);
  protected readonly tableHoverable = signal(true);
  protected readonly tableBordered = signal(false);
  protected readonly tableSelectable = signal(false);
  protected readonly tableLoading = signal(false);
  protected readonly tableLastEvent = signal('');

  protected readonly tableColumns: VzColumn<EmployeeItem>[] = [
    { key: 'nombre', header: 'Nombre del Empleado', sortable: true },
    { key: 'puesto', header: 'Puesto', sortable: true },
    { key: 'departamento', header: 'Departamento', sortable: true },
    { key: 'estatus', header: 'Estatus', type: 'badge' },
  ];

  protected readonly tableData: EmployeeItem[] = [
    { id: 1, nombre: 'Fatima Nava Peralta', puesto: 'Coordinadora Académica', departamento: 'Control Escolar', estatus: 'Activo' },
    { id: 2, nombre: 'Drake Bell Martinez', puesto: 'Docente Titular', departamento: 'Ciencias y Tecnología', estatus: 'Activo' },
    { id: 3, nombre: 'Roberto Gomez Bolañoz', puesto: 'Analista de Sistemas', departamento: 'Tecnologías de la Información', estatus: 'Pendiente' },
    { id: 4, nombre: 'Rogelio Valboa Buena', puesto: 'Supervisor Administrativo', departamento: 'Recursos Humanos', estatus: 'Inactivo' },
  ];

  protected onTableRowAction(event: any): void {
    this.tableLastEvent.set(`rowAction → ${JSON.stringify(event)}`);
  }

  protected readonly tableCode = computed(() => {
    const d = this.tableDensity();
    const s = this.tableStriped();
    const h = this.tableHoverable();
    const b = this.tableBordered();
    const sel = this.tableSelectable();
    const l = this.tableLoading();

    const attrs = [
      '[columns]="columns"',
      '[data]="rows"',
      d !== 'comfortable' ? `density="${d}"` : '',
      s ? '[striped]="true"' : '',
      !h ? '[hoverable]="false"' : '',
      b ? '[bordered]="true"' : '',
      sel ? '[selectable]="true"' : '',
      l ? '[loading]="true"' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return `<vz-table
  ${attrs}
/>`;
  });
}
