import type { VzColumn, VzDataMode, VzResolvedTableConfig, VzTableConfig, VzTableOverrides } from './table.types';

export function getByPath(obj: unknown, path: string): unknown {
  if (obj === null || obj === undefined || !path) return undefined;
  return path.split('.').reduce<any>((acc, part) => (acc === null || acc === undefined ? undefined : acc[part]), obj);
}

export function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined || value === '';
}

/** Minúsculas y sin acentos, para búsquedas tolerantes. */
export function normalizeText(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function parseDateValue(value: unknown): Date | null {
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (typeof value === 'number') return new Date(value);
  if (typeof value !== 'string' || !value) return null;
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  // Las fechas "YYYY-MM-DD" se interpretan en hora local para no correrse un día por zona horaria.
  const date = dateOnly ? new Date(+dateOnly[1], +dateOnly[2] - 1, +dateOnly[3]) : new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

export function compareValues(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b);
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

const numberFormats = new Map<string, Intl.NumberFormat>();
const dateFormats = new Map<string, Intl.DateTimeFormat>();

function numberFormat(locale: string, currency?: string): Intl.NumberFormat {
  const key = `${locale}|${currency ?? ''}`;
  let fmt = numberFormats.get(key);
  if (!fmt) {
    fmt = new Intl.NumberFormat(locale, currency ? { style: 'currency', currency } : undefined);
    numberFormats.set(key, fmt);
  }
  return fmt;
}

function dateFormat(locale: string, options?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const opts = options ?? { day: '2-digit', month: '2-digit', year: 'numeric' };
  const key = `${locale}|${JSON.stringify(opts)}`;
  let fmt = dateFormats.get(key);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat(locale, opts);
    dateFormats.set(key, fmt);
  }
  return fmt;
}

/** Texto por defecto de una celda según el tipo de columna. */
export function formatValue(value: unknown, column: VzColumn): string {
  if (isNil(value)) return '—';
  const locale = column.locale ?? 'es-MX';
  switch (column.type) {
    case 'number':
    case 'currency': {
      const n = typeof value === 'number' ? value : Number(value);
      if (!Number.isFinite(n)) return String(value);
      return numberFormat(locale, column.type === 'currency' ? (column.currency ?? 'MXN') : undefined).format(n);
    }
    case 'date': {
      const d = parseDateValue(value);
      return d ? dateFormat(locale, column.dateOptions).format(d) : String(value);
    }
    default:
      return String(value);
  }
}

/** Páginas visibles con elipsis (`null`) para listas largas. */
export function buildPageList(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, null, total];
  if (current >= total - 3) return [1, null, total - 4, total - 3, total - 2, total - 1, total];
  return [1, null, current - 1, current, current + 1, null, total];
}

export function hasFilterValue(value: unknown): boolean {
  return value !== null && value !== undefined && value !== '';
}

export function resolveConfig(
  config?: VzTableConfig,
  overrides?: VzTableOverrides,
): VzResolvedTableConfig {
  const c = config ?? {};
  const o = overrides ?? {};
  const mode: VzDataMode = (o.mode !== null && o.mode !== undefined ? o.mode : c.mode) ?? 'client';
  const pageSizes =
    (o.pageSizes !== null && o.pageSizes !== undefined ? o.pageSizes : c.pagination?.pageSizes) ?? [10, 25, 50, 100];
  const defaultPageSize =
    (o.pageSize !== null && o.pageSize !== undefined ? o.pageSize : c.pagination?.defaultPageSize) ?? pageSizes[0];

  const resolved: VzResolvedTableConfig = {
    search: {
      enabled: (o.searchable !== null && o.searchable !== undefined ? o.searchable : c.search?.enabled) ?? true,
      mode: c.search?.mode ?? mode,
      debounce: (o.searchDebounce !== null && o.searchDebounce !== undefined ? o.searchDebounce : c.search?.debounce) ?? 300,
      minChars: (o.searchMinChars !== null && o.searchMinChars !== undefined ? o.searchMinChars : c.search?.minChars) ?? 0,
      placeholder: (o.searchPlaceholder !== null && o.searchPlaceholder !== undefined ? o.searchPlaceholder : c.search?.placeholder),
    },
    sort: {
      enabled: (o.sortable !== null && o.sortable !== undefined ? o.sortable : c.sort?.enabled) ?? true,
      mode: c.sort?.mode ?? mode,
      multi: (o.multiSort !== null && o.multiSort !== undefined ? o.multiSort : c.sort?.multi) ?? true,
    },
    pagination: {
      enabled: (o.pagination !== null && o.pagination !== undefined ? o.pagination : c.pagination?.enabled) ?? true,
      mode: c.pagination?.mode ?? mode,
      pageSizes,
      defaultPageSize,
      showSizeSelector: (o.showPageSizeSelector !== null && o.showPageSizeSelector !== undefined ? o.showPageSizeSelector : c.pagination?.showSizeSelector) ?? true,
      showInfo: (o.showPageInfo !== null && o.showPageInfo !== undefined ? o.showPageInfo : c.pagination?.showInfo) ?? true,
    },
    filters: { mode: c.filters?.mode ?? mode },
    selectable: (o.selectable !== null && o.selectable !== undefined ? o.selectable : c.selectable) ?? false,
    rowKey: (o.rowKey !== null && o.rowKey !== undefined ? o.rowKey : c.rowKey) ?? null,
    clickableRows: (o.clickableRows !== null && o.clickableRows !== undefined ? o.clickableRows : c.clickableRows) ?? false,
    density: (o.density !== null && o.density !== undefined ? o.density : c.density) ?? 'comfortable',
    striped: (o.striped !== null && o.striped !== undefined ? o.striped : c.striped) ?? false,
    hoverable: (o.hoverable !== null && o.hoverable !== undefined ? o.hoverable : c.hoverable) ?? true,
    bordered: (o.bordered !== null && o.bordered !== undefined ? o.bordered : c.bordered) ?? false,
    stickyHeader: (o.stickyHeader !== null && o.stickyHeader !== undefined ? o.stickyHeader : c.stickyHeader) ?? true,
    maxHeight: (o.maxHeight !== null && o.maxHeight !== undefined ? o.maxHeight : c.maxHeight) ?? null,
    showCount: (o.showCount !== null && o.showCount !== undefined ? o.showCount : c.showCount) ?? true,
    emitInitialQuery: (o.emitInitialQuery !== null && o.emitInitialQuery !== undefined ? o.emitInitialQuery : c.emitInitialQuery) ?? true,
    anyServer: false,
  };
  resolved.anyServer = [
    resolved.search.enabled && resolved.search.mode,
    resolved.sort.enabled && resolved.sort.mode,
    resolved.pagination.enabled && resolved.pagination.mode,
    resolved.filters.mode,
  ].includes('server');
  return resolved;
}

