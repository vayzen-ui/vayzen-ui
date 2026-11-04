import type { VzPaginationLabels } from './pagination/pagination.component';

/** Dónde se resuelve una capacidad de la tabla: en el navegador o en el backend. */
export type VzDataMode = 'client' | 'server';
export type VzTableTheme = 'light' | 'dark' | 'auto';
export type VzTableVariant = 'elevated' | 'outlined' | 'flat' | 'borderless';
export type VzColumnType =
  | 'text'
  | 'user'
  | 'code'
  | 'number'
  | 'currency'
  | 'date'
  | 'badge'
  | 'progress'
  | 'actions';
export type VzColumnAlign = 'start' | 'center' | 'end';
export type VzBadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type VzBadgeStyle = 'pill' | 'dot' | 'outline';
export type VzActionIcon = 'view' | 'edit' | 'delete' | 'download' | 'copy' | 'more';
export type VzSortDirection = 'asc' | 'desc';
export type VzTableDensity = 'compact' | 'comfortable' | 'spacious';

export interface VzSortState {
  key: string;
  direction: VzSortDirection;
}

/** Acción disponible por fila (columna de tipo `actions`). */
export interface VzRowAction<T = any> {
  /** Identificador que llega en el evento `rowAction`. */
  name: string;
  label: string;
  /** Icono SVG nativo integrado ('view' | 'edit' | 'delete' | 'download' | 'copy' | 'more'). */
  icon?: VzActionIcon;
  /** Clase de un icon-font propio (ej. "bi bi-pencil"). Si se omite se muestra `icon` o `label`. */
  iconClass?: string;
  /** Si se incluye `icon`, define si además se muestra el texto `label` al lado. */
  showLabel?: boolean;
  variant?: 'default' | 'primary' | 'danger';
  visible?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
}

export type VzBadgeVariantResolver<T = any> =
  | VzBadgeVariant
  | Record<string, VzBadgeVariant>
  | ((value: unknown, row: T) => VzBadgeVariant);

export interface VzColumn<T = any> {
  /** Ruta de la propiedad (soporta anidación: "cliente.nombre"). También identifica la columna. */
  key: string;
  header: string;
  type?: VzColumnType;
  width?: string;
  minWidth?: string;
  align?: VzColumnAlign;
  /** Por defecto `true` (excepto en columnas `actions`). */
  sortable?: boolean;
  /** Por defecto `true` (excepto en columnas `actions`). */
  searchable?: boolean;
  hidden?: boolean;
  /** Fija la columna al hacer scroll horizontal. */
  sticky?: 'start' | 'end';
  /** Calcula el valor de la celda cuando no es una simple propiedad. */
  valueGetter?: (row: T) => unknown;
  /** Texto mostrado (también se usa en búsqueda). */
  formatter?: (value: unknown, row: T) => string;
  /** Para `type: 'user'` o celdas de doble línea: propiedad secundaria (ej. "email" o "puesto"). */
  subtitleKey?: string;
  /** Para `type: 'user'`: propiedad con la URL del avatar. Si no existe, genera iniciales automáticas. */
  avatarKey?: string;
  badgeVariant?: VzBadgeVariantResolver<T>;
  /** Estilo visual del badge: `'pill'` (por defecto), `'dot'` (indicador limpio) o `'outline'`. */
  badgeStyle?: VzBadgeStyle;
  /** Código ISO para `type: 'currency'`. Por defecto "MXN". */
  currency?: string;
  /** Locale para números, moneda y fechas. Por defecto "es-MX". */
  locale?: string;
  dateOptions?: Intl.DateTimeFormatOptions;
  headerClass?: string;
  cellClass?: string | ((row: T) => string);
  actions?: VzRowAction<T>[];
}

export interface VzFilterOption {
  value: string | number | boolean;
  label: string;
}

/** Filtro tipo selector. Se renderiza con un `<select>` nativo o con tu propio control (`*vzFilterControl`). */
export interface VzTableFilter<T = any> {
  key: string;
  label: string;
  /** Texto de la opción "sin filtro". Por defecto `label`. */
  placeholder?: string;
  options: VzFilterOption[];
  width?: string;
  /** Comparación personalizada para el modo cliente (por defecto igualdad estricta de texto). */
  match?: (row: T, value: unknown) => boolean;
}

/** Metadatos que devuelve el backend cuando la paginación es `server`. */
export interface VzServerPage {
  total: number;
  page?: number;
  pageSize?: number;
}

/**
 * Objeto de datos paginado devuelto habitualmente por APIs REST / GraphQL / Backend.
 * Permite pasar la respuesta completa del backend directamente en `[data]="response"`.
 */
export interface VzPaginated<T = any> {
  items?: T[];
  data?: T[];
  datos?: T[];
  content?: T[];
  rows?: T[];
  registros?: T[];
  total?: number;
  totalRegistros?: number;
  totalElementos?: number;
  count?: number;
  page?: number;
  pagina?: number;
  pageSize?: number;
  porPagina?: number;
}

export type VzTableData<T = any> = T[] | VzPaginated<T> | null | undefined;

export type VzTableLoaderResult<T = any> = T[] | VzPaginated<T>;

/**
 * Función cargadora de datos autónoma (nivel de arquitectura de élite).
 * La tabla se encarga del ciclo completo: spinner de loading, debounce, cancelación de peticiones obsoletas y reintentos.
 */
export type VzTableLoader<T = any> = (
  query: VzTableQuery,
) => Promise<VzTableLoaderResult<T>> | { subscribe: (observer: any) => any };

/** Estado completo de la consulta; es lo que se envía al backend. */
export interface VzTableQuery {
  page: number;
  pageSize: number;
  search: string;
  sort: VzSortState[];
  filters: Record<string, unknown>;
}

export interface VzRowActionEvent<T = any> {
  action: string;
  row: T;
}

export interface VzTableConfig {
  /** Modo por defecto de todas las capacidades: 'client' o 'server'. */
  mode?: VzDataMode;
  variant?: VzTableVariant;
  search?: { enabled?: boolean; mode?: VzDataMode; debounce?: number; minChars?: number; placeholder?: string };
  sort?: { enabled?: boolean; mode?: VzDataMode; multi?: boolean };
  pagination?: {
    enabled?: boolean;
    mode?: VzDataMode;
    pageSizes?: number[];
    defaultPageSize?: number;
    showSizeSelector?: boolean;
    showInfo?: boolean;
  };
  filters?: { mode?: VzDataMode };
  selectable?: boolean;
  /** Propiedad (o función) que identifica cada fila. Necesario para conservar la selección entre páginas. */
  rowKey?: string | ((row: any) => unknown);
  clickableRows?: boolean;
  density?: VzTableDensity;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  stickyHeader?: boolean;
  /** Altura máxima del área con scroll (ej. "480px"). */
  maxHeight?: string;
  showCount?: boolean;
  /** Muestra un botón de exportación CSV instantánea en la barra de herramientas. */
  exportable?: boolean;
  exportFilename?: string;
  /** En modo server, emite `queryChange` al iniciar para cargar la primera página. Por defecto `true`. */
  emitInitialQuery?: boolean;
}

export interface VzTableOverrides {
  mode?: VzDataMode | null;
  variant?: VzTableVariant | null;
  searchable?: boolean | null;
  searchDebounce?: number | null;
  searchMinChars?: number | null;
  searchPlaceholder?: string | null;
  sortable?: boolean | null;
  multiSort?: boolean | null;
  pagination?: boolean | null;
  pageSizes?: number[] | null;
  pageSize?: number | null;
  showPageSizeSelector?: boolean | null;
  showPageInfo?: boolean | null;
  selectable?: boolean | null;
  rowKey?: string | ((row: any) => unknown) | null;
  clickableRows?: boolean | null;
  density?: VzTableDensity | null;
  striped?: boolean | null;
  hoverable?: boolean | null;
  bordered?: boolean | null;
  stickyHeader?: boolean | null;
  maxHeight?: string | null;
  showCount?: boolean | null;
  exportable?: boolean | null;
  exportFilename?: string | null;
  emitInitialQuery?: boolean | null;
}

export interface VzResolvedTableConfig {
  variant: VzTableVariant;
  search: { enabled: boolean; mode: VzDataMode; debounce: number; minChars: number; placeholder?: string };
  sort: { enabled: boolean; mode: VzDataMode; multi: boolean };
  pagination: {
    enabled: boolean;
    mode: VzDataMode;
    pageSizes: number[];
    defaultPageSize: number;
    showSizeSelector: boolean;
    showInfo: boolean;
  };
  filters: { mode: VzDataMode };
  selectable: boolean;
  rowKey: string | ((row: any) => unknown) | null;
  clickableRows: boolean;
  density: VzTableDensity;
  striped: boolean;
  hoverable: boolean;
  bordered: boolean;
  stickyHeader: boolean;
  maxHeight: string | null;
  showCount: boolean;
  exportable: boolean;
  exportFilename: string;
  emitInitialQuery: boolean;
  anyServer: boolean;
}

export interface VzTableLabels {
  searchPlaceholder: string;
  clearSearch: string;
  records: string;
  selected: string;
  clearSelection: string;
  exportCsv: string;
  emptyTitle: string;
  emptyDescription: string;
  loading: string;
  errorTitle: string;
  retry: string;
  selectAll: string;
  selectRow: string;
  sortHint: string;
  pagination: Partial<VzPaginationLabels>;
}

export const VZ_TABLE_DEFAULT_LABELS: VzTableLabels = {
  searchPlaceholder: 'Buscar en la tabla...',
  clearSearch: 'Limpiar búsqueda',
  records: 'registros',
  selected: 'seleccionados',
  clearSelection: 'Limpiar',
  exportCsv: 'Exportar CSV',
  emptyTitle: 'No se encontraron datos',
  emptyDescription: 'Prueba ajustando los términos de búsqueda o los filtros activos.',
  loading: 'Cargando datos...',
  errorTitle: 'No se pudieron cargar los datos',
  retry: 'Reintentar carga',
  selectAll: 'Seleccionar todas las filas visibles',
  selectRow: 'Seleccionar fila',
  sortHint: 'Clic para ordenar · Shift+clic para orden múltiple',
  pagination: {},
};
