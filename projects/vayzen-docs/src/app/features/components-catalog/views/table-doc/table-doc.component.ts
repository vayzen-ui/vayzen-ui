import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  VZ_TABLE_IMPORTS,
  VzButtonComponent,
  VzColumn,
  VzRowActionEvent,
  VzTableConfig,
  VzTableDensity,
  VzTableFilter,
  VzTableQuery,
} from 'vayzen-ui';
import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';
import { BASIC_ORDERS, BasicOrder, EMPLOYEES, Employee, fakeEmployeesApi } from './table-doc.mock';

type ViewState = 'normal' | 'loading' | 'empty' | 'error';

@Component({
  selector: 'app-table-doc',
  standalone: true,
  imports: [
    ...VZ_TABLE_IMPORTS,
    VzButtonComponent,
    CodeBlockComponent,
    RouterLink,
  ],
  templateUrl: './table-doc.component.html',
  styleUrls: ['../../../../shared/styles/doc-page.css', './table-doc.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableDocComponent {
  // ── Tema interactivo global de la página de documentación ──
  protected readonly previewTheme = signal<'light' | 'dark'>('light');

  protected togglePreviewTheme(): void {
    this.previewTheme.update((t) => (t === 'light' ? 'dark' : 'light'));
  }

  // ── 1. Tablas Básicas (Estilotables-basic) ──
  protected readonly basicOrders = BASIC_ORDERS;

  protected readonly simpleColumns: VzColumn<BasicOrder>[] = [
    { key: 'orderId', header: 'Orden', type: 'code', width: '7.5rem' },
    { key: 'customer', header: 'Cliente' },
    { key: 'product', header: 'Equipo / Servicio' },
    { key: 'office', header: 'Sede' },
    { key: 'amount', header: 'Importe', type: 'currency' },
  ];

  protected readonly compactBasicColumns: VzColumn<BasicOrder>[] = [
    { key: 'orderId', header: 'Folio', type: 'code', width: '7rem' },
    { key: 'customer', header: 'Titular', subtitleKey: 'office' },
    { key: 'amount', header: 'Total', type: 'currency' },
    { key: 'status', header: 'Estado', type: 'badge', badgeStyle: 'dot' },
  ];

  // ── 2. Tabla Completa / Pro (Enterprise DataGrid) ──
  protected readonly previewEmployees = EMPLOYEES;
  protected readonly proViewState = signal<ViewState>('normal');
  protected readonly lastEvent = signal('Interactúa con las filas, filtros o acciones para inspeccionar eventos.');
  protected readonly lastQuery = signal<VzTableQuery | null>(null);

  protected readonly columns: VzColumn<Employee>[] = [
    { key: 'folio', header: 'ID', type: 'code', width: '6.75rem' },
    {
      key: 'name',
      header: 'Colaborador',
      type: 'user',
      avatarKey: 'avatar',
      subtitleKey: 'email',
      minWidth: '15.5rem',
    },
    {
      key: 'department',
      header: 'Área & Rol',
      subtitleKey: 'role',
      minWidth: '13rem',
    },
    {
      key: 'status',
      header: 'Estatus',
      type: 'badge',
      badgeVariant: { Activo: 'success', Pendiente: 'warning', Inactivo: 'danger' },
    },
    {
      key: 'performance',
      header: 'Cumplimiento KPI',
      type: 'progress',
      minWidth: '10rem',
    },
    { key: 'salary', header: 'Compensación', type: 'currency' },
    { key: 'hiredAt', header: 'Ingreso', type: 'date' },
    {
      key: 'actions',
      header: 'Acciones',
      type: 'actions',
      minWidth: '7.5rem',
      actions: [
        { name: 'view', label: 'Ver expediente', icon: 'view' },
        { name: 'edit', label: 'Editar registro', icon: 'edit' },
        {
          name: 'delete',
          label: 'Dar de baja',
          icon: 'delete',
          variant: 'danger',
          disabled: (row) => row.status === 'Inactivo',
        },
      ],
    },
  ];

  protected readonly filters: VzTableFilter<Employee>[] = [
    {
      key: 'department',
      label: 'Todas las áreas',
      options: ['Ingeniería', 'Diseño & UX', 'Finanzas', 'Ventas Enterprise', 'Ciberseguridad'].map((d) => ({
        value: d,
        label: d,
      })),
    },
    {
      key: 'status',
      label: 'Todos los estatus',
      options: ['Activo', 'Pendiente', 'Inactivo'].map((s) => ({ value: s, label: s })),
    },
  ];

  protected readonly proTableData = computed<Employee[]>(() =>
    this.proViewState() === 'empty' ? [] : EMPLOYEES,
  );
  protected readonly proTableLoading = computed(() => this.proViewState() === 'loading');
  protected readonly proTableError = computed(() =>
    this.proViewState() === 'error'
      ? 'Error 503: El nodo de base de datos no respondió en el tiempo esperado.'
      : null,
  );

  // ── 3. Demo de filtro personalizado + celda personalizada (Opción B) ──
  protected readonly customColumns: VzColumn<Employee>[] = [
    { key: 'folio', header: 'Folio', type: 'code', width: '7rem' },
    { key: 'name', header: 'Colaborador', type: 'user', avatarKey: 'avatar', subtitleKey: 'role' },
    { key: 'department', header: 'Departamento' },
    { key: 'status', header: 'Estatus Personalizado' },
    { key: 'salary', header: 'Salario', type: 'currency' },
  ];
  protected readonly customFilters: VzTableFilter<Employee>[] = [
    {
      key: 'status',
      label: 'Estatus',
      options: ['Activo', 'Pendiente', 'Inactivo'].map((s) => ({ value: s, label: s })),
    },
  ];
  protected readonly customData = EMPLOYEES.slice(0, 12);
  protected readonly smallConfig: VzTableConfig = {
    rowKey: 'id',
    pagination: { pageSizes: [4, 8], defaultPageSize: 4 },
    search: { enabled: false },
    showCount: false,
  };

  protected statusColor(status: unknown): string {
    return status === 'Activo' ? '#10b981' : status === 'Pendiente' ? '#f59e0b' : '#ef4444';
  }

  // ── Handlers ──
  protected onRowAction(event: VzRowActionEvent<Employee>): void {
    this.lastEvent.set(`rowAction → [${event.action.toUpperCase()}] ${event.row.name} (${event.row.folio})`);
  }

  protected onSelection(rows: Employee[]): void {
    this.lastEvent.set(`selectionChange → ${rows.length} colaborador(es) seleccionado(s)`);
  }

  protected onRetry(): void {
    this.proViewState.set('normal');
    this.lastEvent.set('retry → Estado restaurado a normal');
  }

  // ── Snippets de Código ──
  protected readonly basicHtmlSnippet = `<!-- 1. Simple Table (Minimalista sin barra de herramientas ni paginación) -->
<vz-table
  variant="outlined"
  [columns]="simpleColumns"
  [data]="orders"
  [searchable]="false"
  [pagination]="false"
  [showCount]="false"
/>

<!-- 2. Striped & Compact Table con Códigos Monospace e Indicadores Dot -->
<vz-table
  heading="Órdenes Recientes"
  subtitle="Seguimiento rápido de entregas por sede"
  density="compact"
  striped
  [columns]="compactColumns"
  [data]="orders"
  [searchable]="false"
  [pagination]="false"
/>`;

  protected readonly basicTsSnippet = `import { Component } from '@angular/core';
import { VZ_TABLE_IMPORTS, VzColumn } from 'vayzen-ui';

@Component({
  selector: 'app-ordenes-basicas',
  standalone: true,
  imports: [...VZ_TABLE_IMPORTS],
  templateUrl: './ordenes-basicas.component.html',
})
export class OrdenesBasicasComponent {
  compactColumns: VzColumn<BasicOrder>[] = [
    { key: 'orderId', header: 'Folio', type: 'code', width: '7rem' },
    { key: 'customer', header: 'Titular', subtitleKey: 'office' },
    { key: 'amount', header: 'Total', type: 'currency' },
    { key: 'status', header: 'Estado', type: 'badge', badgeStyle: 'dot' },
  ];
}`;

  protected readonly optionAAutoTsSnippet = `import { Component } from '@angular/core';
import { VZ_TABLE_IMPORTS, VzColumn, VzTableFilter } from 'vayzen-ui';

@Component({
  selector: 'app-directorio-pro',
  standalone: true,
  imports: [...VZ_TABLE_IMPORTS],
  template: \`
    <vz-table
      heading="Directorio de Talento & Ingeniería"
      subtitle="Gestión integral de colaboradores, cumplimiento KPI y nómina"
      rowKey="id"
      selectable
      exportable
      exportFilename="directorio-vayzen"
      [columns]="columns"
      [data]="employees"
      [filters]="filters"
      (rowAction)="onRowAction($event)"
    />
  \`,
})
export class DirectorioProComponent {
  // Opción A (Zero-Boilerplate): Avatares, iniciales, doble línea, barras KPI,
  // badges semánticos e iconos SVG de acción se generan automáticamente por configuración:
  readonly columns: VzColumn<Employee>[] = [
    { key: 'folio', header: 'ID', type: 'code', width: '6.75rem' },
    { key: 'name', header: 'Colaborador', type: 'user', avatarKey: 'avatar', subtitleKey: 'email' },
    { key: 'department', header: 'Área & Rol', subtitleKey: 'role' },
    { key: 'status', header: 'Estatus', type: 'badge' },
    { key: 'performance', header: 'Cumplimiento KPI', type: 'progress' },
    { key: 'salary', header: 'Compensación', type: 'currency' },
    { key: 'hiredAt', header: 'Ingreso', type: 'date' },
    {
      key: 'actions',
      header: 'Acciones',
      type: 'actions',
      minWidth: '7.5rem',
      actions: [
        { name: 'view', label: 'Ver expediente', icon: 'view' },
        { name: 'edit', label: 'Editar registro', icon: 'edit' },
        { name: 'delete', label: 'Dar de baja', icon: 'delete', variant: 'danger' },
      ],
    },
  ];
}`;

  protected readonly customFilterHtml = `<vz-table
  heading="Control con Slots Personalizados"
  [columns]="customColumns"
  [data]="customData"
  [filters]="customFilters"
  [config]="smallConfig"
>
  <!-- 1. Slot [vzTableActions]: Botones propios en la barra superior -->
  <div vzTableActions>
    <vz-button size="sm" variant="primary">+ Nuevo Registro</vz-button>
  </div>

  <!-- 2. Directiva *vzFilterControl: Reemplaza el <select> nativo por segmented chips -->
  <ng-template vzFilterControl="status" let-value="value" let-options="options" let-change="change">
    <div class="chips">
      <button type="button" [class.active]="!value" (click)="change(null)">Todos</button>
      @for (opt of options; track opt.value) {
        <button type="button" [class.active]="value === opt.value" (click)="change(opt.value)">
          {{ opt.label }}
        </button>
      }
    </div>
  </ng-template>

  <!-- 3. Directiva *vzCell: Maquetado a la medida para cualquier columna -->
  <ng-template vzCell="status" let-row let-value="value">
    <span class="custom-status-pill">
      <span class="dot" [style.background]="statusColor(value)"></span>
      {{ value }}
    </span>
  </ng-template>
</vz-table>`;

  // ── Modo Servidor: 1. El Servicio (Separación de transporte y estado) ──
  protected readonly serviceSnippet = `import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RespuestaApi<T> {
  exito: boolean;
  mensaje: string;
  datos: T;
}

export interface AlumnosPaginados {
  datos: Alumno[];
  pagina: number;
  totalPaginas: number;
  totalRegistros: number;
  porPagina: number;
}

@Injectable({ providedIn: 'root' })
export class AlumnosService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/control_escolar/alumnos';

  obtenerAlumnos(params: {
    pagina: number;
    porPagina: number;
    busqueda?: string;
  }): Observable<RespuestaApi<AlumnosPaginados>> {
    return this.http.get<RespuestaApi<AlumnosPaginados>>(\`\${this.apiUrl}/obtener-alumnos\`, {
      params: {
        page: params.pagina,
        size: params.porPagina,
        ...(params.busqueda ? { q: params.busqueda } : {}),
      },
    });
  }
}`;

  // ── Modo Servidor: 2. El Componente (Flujo Estándar Empresarial) ──
  protected readonly standardComponentSnippet = `import { Component, inject, signal } from '@angular/core';
import { VZ_TABLE_IMPORTS, VzColumn, VzTableQuery } from 'vayzen-ui';
import { Alumno } from './alumno.model';
import { AlumnosService } from './alumnos.service';

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [...VZ_TABLE_IMPORTS],
  templateUrl: './alumnos.component.html',
})
export class AlumnosComponent {
  private alumnosService = inject(AlumnosService);

  readonly columnas: VzColumn<Alumno>[] = [
    { key: 'numero_control', header: 'No. Control', type: 'code' },
    { key: 'dt_alumno.nombre', header: 'Alumno', type: 'user', subtitleKey: 'dt_alumno.correo' },
    { key: 'ct_movimiento_alumno.movimiento_alumno', header: 'Movimiento', type: 'badge' },
  ];

  readonly alumnos = signal<Alumno[]>([]);
  readonly totalRegistros = signal<number>(0);
  readonly cargando = signal<boolean>(false);

  cargarAlumnos(q: VzTableQuery): void {
    this.cargando.set(true);

    this.alumnosService
      .obtenerAlumnos({
        pagina: q.page,
        porPagina: q.pageSize,
        busqueda: q.search,
      })
      .subscribe({
        next: (res) => {
          this.alumnos.set(res.datos.datos);
          this.totalRegistros.set(res.datos.totalRegistros);
          this.cargando.set(false);
        },
        error: () => this.cargando.set(false),
      });
  }
}`;

  protected readonly standardHtmlSnippet = `<vz-table
  heading="Padrón de Alumnos"
  subtitle="Consulta en tiempo real conectada al servidor"
  [columns]="columnas"
  [data]="alumnos()"
  mode="server"
  [total]="totalRegistros()"
  [loading]="cargando()"
  (queryChange)="cargarAlumnos($event)"
/>`;

  // ── Modo Servidor: Opción Élite Autónoma (con [loader]) ──
  protected readonly eliteLoaderTsSnippet = `import { Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { VZ_TABLE_IMPORTS, VzColumn, VzTableQuery } from 'vayzen-ui';
import { AlumnosService } from './alumnos.service';

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [...VZ_TABLE_IMPORTS],
  template: \`
    <vz-table
      heading="Listado de Alumnos"
      [columns]="columnas"
      [loader]="load"
    />
  \`,
})
export class AlumnosComponent {
  private alumnosService = inject(AlumnosService);
  readonly columnas: VzColumn<Alumno>[] = [ ... ];

  // 🚀 La tabla gestiona automáticamente skeleton shimmer, debounce y cancelación de llamadas obsoletas:
  readonly load = (q: VzTableQuery) =>
    this.alumnosService
      .obtenerAlumnos({ pagina: q.page, porPagina: q.pageSize, busqueda: q.search })
      .pipe(map((res) => res.datos));
}`;

  protected readonly darkAndTokensSnippet = `<!-- 1. Modo Oscuro Nativo integrado de fábrica (Cero CSS adicional) -->
<vz-table
  theme="dark"
  heading="Monitoreo de Nodos Cloud"
  [columns]="columns"
  [data]="rows"
/>

<!-- O bien con atributo booleano corto -->
<vz-table dark [columns]="columns" [data]="rows" />

<!-- 2. Personalización de Marca con Design Tokens CSS (--vz-table-*) -->
<vz-table class=" theme-violet " [columns]="columns" [data]="rows" />`;

  protected readonly themingClassSnippet = `/* Sobrescritura limpia mediante Design Tokens (sin ::ng-deep ni !important) */
.theme-violet {
  --vz-primary: #6d28d9;
  --vz-table-accent: #6d28d9;
  --vz-table-radius: 14px;
  --vz-table-header-bg: #f5f3ff;
  --vz-table-header-color: #5b21b6;
  --vz-table-row-hover-bg: #faf5ff;
  --vz-table-border-color: #ddd6fe;
}`;

  protected readonly inputRows: [string, string, string, string][] = [
    ['theme', "'light' | 'dark' | 'auto' | undefined", 'undefined', 'Activa el Modo Claro, Modo Oscuro nativo de fábrica o automático según el sistema.'],
    ['dark', 'boolean', 'false', 'Atajo booleano para activar el Modo Oscuro nativo (<vz-table dark>).'],
    ['variant', "'elevated' | 'outlined' | 'flat' | 'borderless'", "'elevated'", 'Variante estética del contenedor y bordes de la tabla.'],
    ['heading', 'string', "''", 'Título principal en la barra superior.'],
    ['subtitle', 'string', "''", 'Subtítulo descriptivo debajo del título principal.'],
    ['columns', 'VzColumn<T>[]', '[]', 'Definición de columnas, tipos ricos (user, code, progress, badge, currency, date, actions) y formateadores.'],
    ['data', 'T[] | VzPaginated<T>', '[]', 'Filas o respuesta paginada ({ items, total } / { datos, totalRegistros }).'],
    ['loader', 'VzTableLoader<T>', 'null', 'Cargador autónomo de élite (Promise u Observable): gestiona loading, debounce y cancelación.'],
    ['total / totalRecords', 'number | null', 'null', 'Total de registros cuando se pagina en servidor.'],
    ['mode', "'client' | 'server'", "'client'", 'Modo general de resolución de datos (navegador o backend).'],
    ['page / pageSize', 'number', '1 / 10', 'Página actual y tamaño de página.'],
    ['pagination', 'boolean', 'true', 'Muestra u oculta el pie de paginación.'],
    ['searchable', 'boolean', 'true', 'Muestra u oculta el buscador integrado.'],
    ['showToolbar', 'boolean | null', 'null (auto)', 'Muestra u oculta la barra superior completa. Se oculta sola si no hay elementos activos.'],
    ['exportable', 'boolean', 'false', 'Agrega un botón nativo para descargar las filas actuales o seleccionadas en formato CSV.'],
    ['selectable', 'boolean', 'false', 'Activa casillas de selección por fila y selección masiva en cabecera.'],
    ['rowKey', 'string | (row) => unknown', 'null', 'Propiedad única por fila para conservar la selección entre páginas.'],
    ['density', "'compact' | 'comfortable' | 'spacious'", "'comfortable'", 'Densidad y espaciado interno de las celdas.'],
    ['striped / hoverable / bordered', 'boolean', 'false / true / false', 'Modificadores visuales de filas y cuadrícula.'],
    ['stickyHeader / maxHeight', 'boolean / string', 'true / null', 'Fija el encabezado superior durante el scroll vertical.'],
    ['loading', 'boolean', 'false', 'Activa el estado skeleton shimmer adaptado al tipo de cada columna.'],
    ['error', 'string | null', 'null', 'Muestra el estado de alerta de error con botón de reintento.'],
    ['filters', 'VzTableFilter<T>[]', '[]', 'Arreglo de filtros selectores para la barra superior.'],
    ['labels', 'Partial<VzTableLabels>', '{}', 'Textos personalizables para internacionalización (i18n).'],
  ];

  protected readonly outputRows: [string, string, string][] = [
    ['queryChange', 'VzTableQuery', 'Estado completo ({ page, pageSize, search, sort, filters }) emitido en modo servidor.'],
    ['searchChange', 'string', 'Término de búsqueda aplicado tras el debounce.'],
    ['sortChange', 'VzSortState[]', 'Estado de ordenamiento activo (simple o múltiple con Shift+clic).'],
    ['pageChange / pageSizeChange', 'number', 'Eventos de cambio de página o de cantidad de filas por página.'],
    ['filterChange', '{ key, value }', 'Se emite cuando cambia el valor de un filtro.'],
    ['selectionChange', 'T[]', 'Arreglo actualizado de filas seleccionadas.'],
    ['rowAction', 'VzRowActionEvent<T>', 'Se emite al pulsar un botón de la columna de tipo actions ({ action, row }).'],
    ['rowClick', 'T', 'Se emite al hacer clic sobre una fila cuando clickableRows está activo.'],
    ['exportCsv', 'T[]', 'Se emite al exportar los datos a CSV con las filas exportadas.'],
    ['retry', 'void', 'Se emite al pulsar el botón Reintentar en el estado de error.'],
  ];

  protected readonly columnRows: [string, string, string][] = [
    ['key', 'string', 'Ruta de la propiedad (soporta anidación "dt_alumno.nombre").'],
    ['header', 'string', 'Título visible en la cabecera de la columna.'],
    ['type', "'text' | 'user' | 'code' | 'number' | 'currency' | 'date' | 'badge' | 'progress' | 'actions'", 'Tipo de celda rica con formato y diseño automático.'],
    ['avatarKey', 'string', "En type: 'user', ruta de la imagen de avatar. Si es vacía, genera iniciales con color semántico."],
    ['subtitleKey', 'string', "Propiedad secundaria mostrada en una segunda línea debajo del texto principal (ej. 'email' o 'role')."],
    ['badgeVariant', 'variant | Record | fn', "'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info' (incluye auto-detección semántica)."],
    ['badgeStyle', "'pill' | 'dot' | 'outline'", "Estilo del badge: píldora suave ('pill'), indicador con punto ('dot') o contorno ('outline')."],
    ['sticky', "'start' | 'end'", 'Fija la columna al extremo izquierdo o derecho durante el scroll horizontal.'],
    ['actions', 'VzRowAction<T>[]', "Botones de acción con iconos SVG nativos (icon: 'view' | 'edit' | 'delete' | 'download' | 'copy' | 'more')."],
  ];

  protected readonly cssVarRows: [string, string][] = [
    ['--vz-table-bg', 'Color de superficie principal de la tabla'],
    ['--vz-table-title-color / --vz-table-color', 'Color del título y del texto principal de celdas'],
    ['--vz-table-muted-color', 'Color para subtítulos, correos y textos secundarios'],
    ['--vz-table-border-color', 'Color de líneas divisorias y contorno'],
    ['--vz-table-radius / --vz-table-shadow', 'Radio de bordes y sombra de elevación del contenedor'],
    ['--vz-table-header-bg / --vz-table-header-color', 'Fondo y color tipográfico de la cabecera <thead>'],
    ['--vz-table-footer-bg', 'Fondo del pie de paginación'],
    ['--vz-table-row-hover-bg / --vz-table-row-stripe-bg', 'Fondo de fila en hover y en modo cebrado (striped)'],
    ['--vz-table-row-selected-bg', 'Fondo de fila cuando está seleccionada'],
    ['--vz-table-accent', 'Color de acento principal (ordenamiento activo, selección, chips y barra KPI)'],
    ['--vz-table-cell-padding-y / --vz-table-cell-padding-x', 'Espaciado vertical y horizontal de celdas'],
  ];
}
