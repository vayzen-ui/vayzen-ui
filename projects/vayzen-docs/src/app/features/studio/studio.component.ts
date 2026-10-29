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
  VzButtonComponent,
  VzButtonSize,
  VzButtonVariant,
  VzCardAccent,
  VzCardAccentPosition,
  VzCardActionsDirective,
  VzCardComponent,
  VzCardContentDirective,
  VzCardDensity,
  VzCardFooterDirective,
  VzCardHeaderDirective,
  VzCardImageDirective,
  VzCardOrientation,
  VzCardSubtitleDirective,
  VzCardTitleDirective,
  VzCardVariant,
  VzColumn,
  VzTableComponent,
  VzTableDensity,
} from 'vayzen-ui';
import { WorkbenchComponent } from '../../shared/components/workbench/workbench.component';

export type StudioComponentType = 'card' | 'button' | 'table';

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
    WorkbenchComponent,
    VzCardComponent,
    VzCardHeaderDirective,
    VzCardTitleDirective,
    VzCardSubtitleDirective,
    VzCardActionsDirective,
    VzCardContentDirective,
    VzCardFooterDirective,
    VzCardImageDirective,
    VzButtonComponent,
    VzTableComponent,
  ],
  templateUrl: './studio.component.html',
  styleUrl: './studio.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudioComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  // ── Component Switcher ──
  readonly activeComponent = signal<StudioComponentType>('card');

  readonly componentCatalog = [
    {
      id: 'card' as StudioComponentType,
      name: 'Card',
      icon: '🃏',
      summary: 'Contenedor adaptable con variantes de acento, orientación y densidades.',
      docLink: '/components/cards',
    },
    {
      id: 'button' as StudioComponentType,
      name: 'Button',
      icon: '🔘',
      summary: 'Botón nativo accesible con variantes visuales y tamaños escalables.',
      docLink: '/components/buttons',
    },
    {
      id: 'table' as StudioComponentType,
      name: 'Table',
      icon: '📊',
      summary: 'Tabla interactiva reactiva con ordenamiento, búsqueda y selección.',
      docLink: '/components/tables',
    },
  ];

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const comp = params['component'] as StudioComponentType;
      if (comp && ['card', 'button', 'table'].includes(comp)) {
        this.activeComponent.set(comp);
      }
    });
  }

  // ══════════════════════════════════════════
  // CARD STUDIO STATE
  // ══════════════════════════════════════════
  protected readonly cardVariant = signal<VzCardVariant>('elevated');
  protected readonly cardAccent = signal<VzCardAccent>('primary');
  protected readonly cardAccentPosition = signal<VzCardAccentPosition>('top');
  protected readonly cardOrientation = signal<VzCardOrientation>('vertical');
  protected readonly cardDensity = signal<VzCardDensity>('comfortable');
  protected readonly cardBorderedHeader = signal(true);
  protected readonly cardBorderedFooter = signal(true);
  protected readonly cardHoverable = signal(true);
  protected readonly cardClickable = signal(false);
  protected readonly cardLoading = signal(false);
  protected readonly cardDisabled = signal(false);
  protected readonly cardShowImage = signal(true);
  protected readonly cardLastEvent = signal('');

  protected onCardClick(): void {
    this.cardLastEvent.set(`clicked → ${new Date().toLocaleTimeString()}`);
  }

  protected readonly cardCode = computed(() => {
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

