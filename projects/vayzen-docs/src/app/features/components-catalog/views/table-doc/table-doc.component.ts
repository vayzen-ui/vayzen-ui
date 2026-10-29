import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  VZ_TABLE_IMPORTS,
  VzColumn,
  VzRowActionEvent,
  VzServerPage,
  VzTableConfig,
  VzTableDensity,
  VzTableFilter,
  VzTableQuery,
} from 'vayzen-ui';
import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';
import { EMPLOYEES, Employee, fakeEmployeesApi } from './table-doc.mock';

type ViewState = 'normal' | 'loading' | 'empty' | 'error';

@Component({
  selector: 'app-table-doc',
  standalone: true,
  imports: [...VZ_TABLE_IMPORTS, CodeBlockComponent],
  templateUrl: './table-doc.component.html',
  styleUrls: ['../../../../shared/styles/doc-page.css', './table-doc.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableDocComponent {
  // ── Playground ──
  protected readonly mode = signal<'client' | 'server'>('client');
  protected readonly density = signal<VzTableDensity>('comfortable');
  protected readonly striped = signal(false);
  protected readonly hoverable = signal(true);
  protected readonly bordered = signal(false);
  protected readonly selectable = signal(false);
  protected readonly viewState = signal<ViewState>('normal');

  protected readonly lastEvent = signal('Interactúa con la tabla para ver los eventos.');
  protected readonly lastQuery = signal<VzTableQuery | null>(null);

  // Estado de la "API" cuando el modo es servidor
  protected readonly serverRows = signal<Employee[]>([]);
  protected readonly serverTotal = signal(0);
  protected readonly serverLoading = signal(false);
  private requestId = 0;

  /** Cambiar de modo recrea la tabla (emite la consulta inicial en modo servidor). */
  protected readonly modeKey = computed(() => [this.mode()]);

  protected readonly columns: VzColumn<Employee>[] = [
    { key: 'name', header: 'Nombre', minWidth: '12rem' },
    { key: 'email', header: 'Correo', minWidth: '14rem' },
    { key: 'department', header: 'Departamento' },
    {
      key: 'status',
      header: 'Estatus',
      type: 'badge',
      badgeVariant: { Activo: 'success', Pendiente: 'warning', Inactivo: 'danger' },
    },
    { key: 'salary', header: 'Salario', type: 'currency' },
    { key: 'hiredAt', header: 'Ingreso', type: 'date' },
    {
      key: 'actions',
      header: '',
      type: 'actions',
      actions: [
        { name: 'view', label: 'Ver' },
        { name: 'delete', label: 'Eliminar', variant: 'danger', disabled: (row) => row.status === 'Inactivo' },
      ],
    },
  ];

  protected readonly filters: VzTableFilter<Employee>[] = [
    {
      key: 'department',
      label: 'Departamento',
      options: ['Ventas', 'Ingeniería', 'Soporte', 'Finanzas', 'Marketing'].map((d) => ({ value: d, label: d })),
    },
    {
      key: 'status',
      label: 'Estatus',
      options: ['Activo', 'Pendiente', 'Inactivo'].map((s) => ({ value: s, label: s })),
    },
  ];

  protected readonly config = computed<VzTableConfig>(() => ({
    mode: this.mode(),
    rowKey: 'id',
    density: this.density(),
    striped: this.striped(),
    hoverable: this.hoverable(),
    bordered: this.bordered(),
    selectable: this.selectable(),
    pagination: { pageSizes: [5, 10, 25, 50], defaultPageSize: 10 },
  }));

  protected readonly tableData = computed<Employee[]>(() => {
    if (this.viewState() === 'empty') return [];
    return this.mode() === 'client' ? EMPLOYEES : this.serverRows();
  });

  protected readonly tableLoading = computed(
    () => this.viewState() === 'loading' || (this.mode() === 'server' && this.serverLoading()),
  );

  protected readonly tableError = computed(() => (this.viewState() === 'error' ? 'El servidor respondió con un error 500.' : null));

  protected readonly serverPage = computed<VzServerPage | null>(() =>
    this.mode() === 'server' ? { total: this.serverTotal() } : null,
  );

  // ── Demo de filtro personalizado + celda personalizada ──
  protected readonly customStatus = signal<string | null>(null);
  protected readonly customColumns: VzColumn<Employee>[] = [
    { key: 'name', header: 'Nombre' },
    { key: 'department', header: 'Departamento' },
    { key: 'status', header: 'Estatus' },
  ];
  protected readonly customFilters: VzTableFilter<Employee>[] = [
    {
      key: 'status',
      label: 'Estatus',
      options: ['Activo', 'Pendiente', 'Inactivo'].map((s) => ({ value: s, label: s })),
    },
  ];
  protected readonly customData = EMPLOYEES.slice(0, 14);
  protected readonly smallConfig: VzTableConfig = {
    rowKey: 'id',
    pagination: { pageSizes: [5, 10], defaultPageSize: 5 },
    search: { enabled: false },
    showCount: false,
  };

  protected statusColor(status: unknown): string {
    return status === 'Activo' ? '#10b981' : status === 'Pendiente' ? '#f59e0b' : '#ef4444';
  }

  // ── Handlers ──
  protected async onQuery(query: VzTableQuery): Promise<void> {
    this.lastQuery.set(query);
    if (this.mode() !== 'server') return;
    const id = ++this.requestId;
    this.serverLoading.set(true);
    const res = await fakeEmployeesApi(query);
    if (id !== this.requestId) return; // descarta respuestas obsoletas
    this.serverRows.set(res.rows);
    this.serverTotal.set(res.total);
    this.serverLoading.set(false);
  }

  protected onRowAction(event: VzRowActionEvent<Employee>): void {
    this.lastEvent.set(`rowAction → ${event.action} · ${event.row.name}`);
  }

  protected onSelection(rows: Employee[]): void {
    this.lastEvent.set(`selectionChange → ${rows.length} fila(s)`);
  }

  protected onRetry(): void {
    this.viewState.set('normal');
  }

  protected asJson(value: unknown): string {
    return JSON.stringify(value, null, 2);
  }

  // ── Snippets ──
  protected readonly installSnippet = `import { Component } from '@angular/core';
import { VZ_TABLE_IMPORTS, VzColumn, VzTableConfig } from 'vayzen-ui';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [...VZ_TABLE_IMPORTS],
  templateUrl: './empleados.component.html',
})
export class EmpleadosComponent {
  columns: VzColumn<Empleado>[] = [
    { key: 'name', header: 'Nombre' },
    { key: 'department', header: 'Departamento' },
    { key: 'status', header: 'Estatus', type: 'badge',
      badgeVariant: { Activo: 'success', Inactivo: 'danger' } },
    { key: 'salary', header: 'Salario', type: 'currency' },
    { key: 'hiredAt', header: 'Ingreso', type: 'date' },
  ];

  config: VzTableConfig = { rowKey: 'id' };   // mode: 'client' por defecto
  empleados: Empleado[] = [];                 // TODOS los datos en un solo arreglo
}`;

  protected readonly clientHtmlSnippet = `<vz-table
  heading="Empleados"
  [columns]="columns"
  [data]="empleados"
  [config]="config"
/>`;

  protected readonly serverTsSnippet = `export class EmpleadosComponent {
  config: VzTableConfig = {
    mode: 'server',                 // búsqueda, orden, filtros y paginación en el backend
    rowKey: 'id',
    search: { debounce: 400, minChars: 2 },
  };

  rows = signal<Empleado[]>([]);
  loading = signal(false);
  serverPage = signal<VzServerPage>({ total: 0 });

  private http = inject(HttpClient);
  private request = 0;

  async load(q: VzTableQuery) {
    const id = ++this.request;
    this.loading.set(true);
    // q = { page, pageSize, search, sort: [{ key, direction }], filters: { status: 'Activo' } }
    const res = await firstValueFrom(
      this.http.get<{ items: Empleado[]; total: number }>('/api/empleados', {
        params: {
          page: q.page,
          size: q.pageSize,
          q: q.search,
          sort: q.sort.map(s => s.key + ':' + s.direction).join(','),
          ...q.filters,
        },
      }),
    );
    if (id !== this.request) return;         // ignora respuestas obsoletas
    this.rows.set(res.items);
    this.serverPage.set({ total: res.total });
    this.loading.set(false);
  }
}`;

  protected readonly serverHtmlSnippet = `<vz-table
  heading="Empleados"
  [columns]="columns"
  [data]="rows()"
  [config]="config"
  [loading]="loading()"
  [serverPage]="serverPage()"
  (queryChange)="load($event)"
/>`;

  protected readonly mixedSnippet = `// Cada capacidad puede elegir su modo de forma independiente:
config: VzTableConfig = {
  mode: 'client',                          // valor por defecto
  pagination: { mode: 'server' },          // el backend pagina...
  search: { mode: 'server', debounce: 400 }, // ...y busca con su propio método
  sort: { mode: 'client' },                // ordena solo la página cargada
};
// queryChange solo se emite cuando cambia algo que se resuelve en 'server'.
// Si necesitas llamar a un método distinto del backend para buscar, escucha (searchChange).`;

  protected readonly customFilterHtml = `<vz-table [columns]="columns" [data]="rows" [filters]="filters" [config]="config">

  <!-- Reemplaza el <select> nativo del filtro "status" con tu propio control -->
  <ng-template vzFilterControl="status" let-filter let-value="value" let-options="options" let-change="change">
    <div class="chips">
      <button type="button" [class.active]="!value" (click)="change(null)">Todos</button>
      @for (opt of options; track opt.value) {
        <button type="button" [class.active]="value === opt.value" (click)="change(opt.value)">
          {{ opt.label }}
        </button>
      }
    </div>
    <!-- ...o usa tu combobox/select de preferencia: <mi-combobox [value]="value" (changed)="change($event)" /> -->
  </ng-template>

  <!-- Reemplaza el contenido de una celda -->
  <ng-template vzCell="status" let-row let-value="value">
    <span class="dot" [style.background]="colorDe(value)"></span> {{ value }}
  </ng-template>

</vz-table>`;

  protected readonly slotsSnippet = `<vz-table [columns]="columns" [data]="rows" [config]="config">
  <h3 vzTableTitle>Mi título personalizado</h3>

  <!-- Botones o controles en la barra superior -->
  <div vzTableActions>
    <vz-button size="sm" (clicked)="exportar()">Exportar</vz-button>
    <vz-button size="sm" variant="outline" (clicked)="nuevo()">Nuevo</vz-button>
  </div>

  <!-- Estado vacío personalizado -->
  <div vzTableEmpty>Aún no hay empleados. <a routerLink="/nuevo">Crear el primero</a></div>
</vz-table>`;

  protected readonly themingGlobalSnippet = `/* styles.scss (global): afecta todas las tablas de la app */
:root {
  --vz-primary: #6d28d9;              /* acento: orden múltiple, selección, paginación */
  --vz-table-radius: 12px;
  --vz-table-header-bg: #f5f3ff;
  --vz-table-header-color: #5b21b6;
  --vz-table-row-hover-bg: #faf5ff;
  --vz-table-cell-padding-y: 0.9rem;
}`;

  protected readonly themingClassSnippet = `/* mi-vista.component.css: una sola tabla */
.tabla-oscura {
  --vz-table-bg: #0f172a;
  --vz-table-color: #e2e8f0;
  --vz-table-muted-color: #94a3b8;
  --vz-table-border-color: #1e293b;
  --vz-table-header-bg: #1e293b;
  --vz-table-header-color: #cbd5e1;
  --vz-table-row-hover-bg: #172554;
  --vz-table-accent: #38bdf8;
}`;

  protected readonly themingHtmlSnippet = `<vz-table class="tabla-oscura" [columns]="columns" [data]="rows" />`;

  protected readonly labelsSnippet = `<!-- Textos traducibles / personalizables -->
<vz-table [columns]="columns" [data]="rows"
  [labels]="{
    searchPlaceholder: 'Search...',
    records: 'records',
    emptyTitle: 'No data found',
    pagination: { showing: 'Showing', of: 'of', perPage: 'Rows per page' }
  }" />`;

  protected readonly inputRows: [string, string, string, string][] = [
    ['columns', 'VzColumn<T>[]', '[]', 'Definición de columnas.'],
    ['data', 'T[]', '[]', 'Filas. En modo cliente, el conjunto completo; en servidor, solo la página actual.'],
    ['config', 'VzTableConfig', '{}', 'Modos (cliente/servidor), paginación, orden, búsqueda, selección y estilos.'],
    ['filters', 'VzTableFilter<T>[]', '[]', 'Filtros tipo selector (nativos o personalizados con *vzFilterControl).'],
    ['heading', 'string', "''", 'Título de la barra superior.'],
    ['loading', 'boolean', 'false', 'Muestra filas skeleton.'],
    ['error', 'string | null', 'null', 'Muestra el estado de error con botón de reintento.'],
    ['serverPage', 'VzServerPage | null', 'null', 'Total y metadatos del backend cuando la paginación es server.'],
    ['labels', 'Partial<VzTableLabels>', '{}', 'Textos de la interfaz (i18n).'],
  ];

  protected readonly outputRows: [string, string, string][] = [
    ['queryChange', 'VzTableQuery', 'Estado completo ({ page, pageSize, search, sort, filters }) cuando cambia algo resuelto en server. En modo server también se emite al iniciar.'],
    ['searchChange', 'string', 'Término de búsqueda aplicado (tras el debounce).'],
    ['sortChange', 'VzSortState[]', 'Lista de ordenamientos activos (soporta varios).'],
    ['pageChange', 'number', 'Nueva página.'],
    ['pageSizeChange', 'number', 'Nuevo tamaño de página.'],
    ['filterChange', '{ key, value }', 'Cambio en un filtro.'],
    ['selectionChange', 'T[]', 'Filas seleccionadas (se conservan entre páginas si hay rowKey).'],
    ['rowAction', '{ action, row }', 'Clic en una acción de la columna actions.'],
    ['rowClick', 'T', 'Clic en una fila (requiere clickableRows).'],
    ['retry', 'void', 'Clic en Reintentar en el estado de error.'],
  ];

  protected readonly configRows: [string, string, string][] = [
    ['mode', "'client' | 'server'", "Modo por defecto para búsqueda, orden, filtros y paginación. Default: 'client'."],
    ['search', '{ enabled, mode, debounce, minChars }', 'Debounce (ms) solo aplica en modo server. Default: 300 / 0.'],
    ['sort', '{ enabled, mode, multi }', 'multi: orden múltiple con Shift+clic. Default: true.'],
    ['pagination', '{ enabled, mode, pageSizes, defaultPageSize }', 'Default: [10, 25, 50, 100] / 10.'],
    ['filters', '{ mode }', 'Dónde se aplican los filtros.'],
    ['selectable', 'boolean', 'Checkbox por fila y "seleccionar todo".'],
    ['rowKey', 'string | (row) => unknown', 'Identifica cada fila (selección y rendimiento).'],
    ['density', "'compact' | 'comfortable' | 'spacious'", 'Espaciado de celdas.'],
    ['striped / hoverable / bordered', 'boolean', 'Estilos visuales. hoverable: true por defecto.'],
    ['stickyHeader / maxHeight', 'boolean / string', 'Encabezado fijo con scroll interno (ej. "480px").'],
    ['clickableRows', 'boolean', 'Emite rowClick y muestra cursor pointer.'],
    ['showCount', 'boolean', 'Chip con el total de registros.'],
    ['emitInitialQuery', 'boolean', 'Emitir queryChange al iniciar en modo server. Default: true.'],
  ];

  protected readonly columnRows: [string, string, string][] = [
    ['key', 'string', 'Propiedad (admite "a.b.c"). Identifica la columna.'],
    ['header', 'string', 'Encabezado.'],
    ['type', "'text' | 'number' | 'currency' | 'date' | 'badge' | 'actions'", 'Formato y comportamiento por defecto.'],
    ['sortable / searchable', 'boolean', 'Default: true (false en actions).'],
    ['valueGetter / formatter', 'function', 'Valor calculado y texto mostrado (también usado en búsqueda).'],
    ['badgeVariant', 'variant | map | function', "'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'."],
    ['align / width / minWidth', 'string', 'Alineación y dimensiones.'],
    ['sticky', "'start' | 'end'", 'Fija la columna al hacer scroll horizontal.'],
    ['currency / locale / dateOptions', 'string / Intl options', "Default: 'MXN' y 'es-MX'."],
    ['actions', 'VzRowAction<T>[]', 'Acciones por fila: name, label, iconClass, variant, visible(row), disabled(row).'],
  ];

  protected readonly cssVarRows: [string, string][] = [
    ['--vz-table-bg', 'Fondo de la tabla'],
    ['--vz-table-color / --vz-table-muted-color', 'Texto principal y secundario'],
    ['--vz-table-border-color', 'Bordes y divisores'],
    ['--vz-table-radius', 'Radio del contenedor'],
    ['--vz-table-header-bg / --vz-table-header-color', 'Encabezado'],
    ['--vz-table-row-hover-bg', 'Fila al pasar el cursor'],
    ['--vz-table-row-stripe-bg', 'Filas alternas (striped)'],
    ['--vz-table-row-selected-bg', 'Fila seleccionada'],
    ['--vz-table-accent', 'Acento: checkbox, orden múltiple, selección'],
    ['--vz-table-font-size', 'Tamaño de fuente'],
    ['--vz-table-cell-padding-y / -x', 'Espaciado de celdas (sobrescribe la densidad)'],
    ['--vz-pagination-*', 'color, muted-color, border-color, radius, active-bg, active-color, hover-bg'],
  ];
}

