import type { VzColumn, VzResolvedTableConfig, VzTableConfig } from './table.types';

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

export function resolveConfig(config: VzTableConfig | undefined): VzResolvedTableConfig {
  const c = config ?? {};
  const mode = c.mode ?? 'client';
  const pageSizes = c.pagination?.pageSizes?.length ? c.pagination.pageSizes : [10, 25, 50, 100];
  const resolved: VzResolvedTableConfig = {
    search: {
      enabled: c.search?.enabled ?? true,
      mode: c.search?.mode ?? mode,
      debounce: c.search?.debounce ?? 300,
      minChars: c.search?.minChars ?? 0,
    },
    sort: { enabled: c.sort?.enabled ?? true, mode: c.sort?.mode ?? mode, multi: c.sort?.multi ?? true },
    pagination: {
      enabled: c.pagination?.enabled ?? true,
      mode: c.pagination?.mode ?? mode,
      pageSizes,
      defaultPageSize: c.pagination?.defaultPageSize ?? pageSizes[0],
    },
    filters: { mode: c.filters?.mode ?? mode },
    selectable: c.selectable ?? false,
    rowKey: c.rowKey ?? null,
    clickableRows: c.clickableRows ?? false,
    density: c.density ?? 'comfortable',
    striped: c.striped ?? false,
    hoverable: c.hoverable ?? true,
    bordered: c.bordered ?? false,
    stickyHeader: c.stickyHeader ?? true,
    maxHeight: c.maxHeight ?? null,
    showCount: c.showCount ?? true,
    emitInitialQuery: c.emitInitialQuery ?? true,
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
