import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { VzButtonComponent } from '../button/button.component';
import { VzPaginationComponent } from './pagination/pagination.component';
import { VzCellDirective, VzFilterControlDirective } from './table-templates.directive';
import {
  VZ_TABLE_DEFAULT_LABELS,
  VzBadgeVariant,
  VzColumn,
  VzRowAction,
  VzRowActionEvent,
  VzServerPage,
  VzSortState,
  VzTableConfig,
  VzTableFilter,
  VzTableLabels,
  VzTableQuery,
} from './table.types';
import {
  compareValues,
  formatValue,
  getByPath,
  hasFilterValue,
  isNil,
  normalizeText,
  parseDateValue,
  resolveConfig,
} from './table.utils';

type ChangeSource = 'search' | 'sort' | 'page' | 'pageSize' | 'filter';

@Component({
  selector: 'vz-table',
  standalone: true,
  imports: [NgTemplateOutlet, VzButtonComponent, VzPaginationComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VzTableComponent<T = any> implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  // ───────────────────────── Inputs ─────────────────────────
  readonly columns = input<VzColumn<T>[]>([]);
  readonly data = input<T[]>([]);
  readonly config = input<VzTableConfig>({});
  readonly filters = input<VzTableFilter<T>[]>([]);
  readonly labels = input<Partial<VzTableLabels>>({});
  readonly heading = input<string>('');
  readonly loading = input<boolean>(false);
  /** Mensaje de error. `null`/`undefined` = sin error (un string vacío también muestra el estado de error). */
  readonly error = input<string | null | undefined>(null);
  /** Metadatos del backend cuando la paginación es `server`. */
  readonly serverPage = input<VzServerPage | null>(null);

  // ───────────────────────── Outputs ─────────────────────────
  /** Estado completo de la consulta. Se emite cuando cambia algo que se resuelve en `server`. */
  readonly queryChange = output<VzTableQuery>();
  readonly searchChange = output<string>();
  readonly sortChange = output<VzSortState[]>();
  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();
  readonly filterChange = output<{ key: string; value: unknown }>();
  readonly selectionChange = output<T[]>();
  readonly rowAction = output<VzRowActionEvent<T>>();
  readonly rowClick = output<T>();
  readonly retry = output<void>();

  // ───────────────────────── Slots (templates) ─────────────────────────
  private readonly cellDirectives = contentChildren(VzCellDirective);
  private readonly filterDirectives = contentChildren(VzFilterControlDirective);
  protected readonly cellTemplates = computed(() => new Map(this.cellDirectives().map((d) => [d.key(), d.template])));
  protected readonly filterTemplates = computed(() => new Map(this.filterDirectives().map((d) => [d.key(), d.template])));

  // ───────────────────────── Estado interno ─────────────────────────
  protected readonly searchTerm = signal('');
  private readonly appliedSearch = signal('');
  protected readonly sort = signal<VzSortState[]>([]);
  private readonly page = signal(1);
  private readonly pageSizeState = signal<number | null>(null);
  private readonly filterValues = signal<Record<string, unknown>>({});
  private readonly selected = signal<ReadonlyMap<unknown, T>>(new Map());

  // ───────────────────────── Derivados ─────────────────────────
  protected readonly cfg = computed(() => resolveConfig(this.config()));
  protected readonly lbl = computed(() => ({ ...VZ_TABLE_DEFAULT_LABELS, ...this.labels() }));
  protected readonly visibleColumns = computed(() => this.columns().filter((c) => !c.hidden));
  protected readonly colspan = computed(() => this.visibleColumns().length + (this.cfg().selectable ? 1 : 0));
  protected readonly hasError = computed(() => this.error() !== null && this.error() !== undefined);

  protected readonly activePageSize = computed(() => this.pageSizeState() ?? this.cfg().pagination.defaultPageSize);

  private readonly processedRows = computed(() => {
    const cfg = this.cfg();
    let rows: T[] = this.data() ?? [];
    if (cfg.filters.mode === 'client') rows = this.applyFilters(rows);
    if (cfg.search.enabled && cfg.search.mode === 'client') rows = this.applySearch(rows);
    if (cfg.sort.enabled && cfg.sort.mode === 'client') rows = this.applySort(rows);
    return rows;
  });

  protected readonly totalRows = computed(() => {
    const cfg = this.cfg();
    if (cfg.pagination.enabled && cfg.pagination.mode === 'server') {
      return this.serverPage()?.total ?? this.processedRows().length;
    }
    return this.processedRows().length;
  });

  private readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalRows() / this.activePageSize())));

  protected readonly activePage = computed(() =>
    this.cfg().pagination.mode === 'server' ? this.page() : Math.min(this.page(), this.totalPages()),
  );

  protected readonly visibleRows = computed(() => {
    const cfg = this.cfg();
    const rows = this.processedRows();
    if (!cfg.pagination.enabled || cfg.pagination.mode === 'server') return rows;
    const start = (this.activePage() - 1) * this.activePageSize();
    return rows.slice(start, start + this.activePageSize());
  });

  protected readonly skeletonRows = computed(() => Array.from({ length: Math.min(this.activePageSize(), 8) }));

  /** Estado de la consulta; es lo que recibe el backend. */
  readonly query = computed<VzTableQuery>(() => {
    const filters: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(this.filterValues())) {
      if (hasFilterValue(value)) filters[key] = value;
    }
    return {
      page: this.page(),
      pageSize: this.activePageSize(),
      search: this.appliedSearch(),
      sort: this.sort(),
      filters,
    };
  });

  protected readonly filterViews = computed(() => {
    const values = this.filterValues();
    return this.filters().map((filter) => {
      const value = values[filter.key];
      const hasValue = hasFilterValue(value);
      return {
        filter,
        hasValue,
        selectedKey: hasValue ? String(value) : '',
        context: {
          $implicit: filter,
          filter,
          value: hasValue ? value : null,
          options: filter.options,
          change: (v: unknown) => this.setFilter(filter.key, v),
        },
      };
    });
  });

  protected readonly rootClasses = computed(() => {
    const cfg = this.cfg();
    return [
      'vz-table',
      `vz-table--${cfg.density}`,
      cfg.striped ? 'vz-table--striped' : '',
      cfg.hoverable ? 'vz-table--hoverable' : '',
      cfg.bordered ? 'vz-table--bordered' : '',
      cfg.stickyHeader ? 'vz-table--sticky-header' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  protected readonly selectedCount = computed(() => this.selected().size);
  protected readonly allVisibleSelected = computed(() => {
    const rows = this.visibleRows();
    return rows.length > 0 && rows.every((r) => this.selected().has(this.rowKeyOf(r)));
  });
  protected readonly someVisibleSelected = computed(
    () => !this.allVisibleSelected() && this.visibleRows().some((r) => this.selected().has(this.rowKeyOf(r))),
  );

  constructor() {
    // Si el backend devuelve página/tamaño normalizados, se sincronizan con el estado interno.
    effect(() => {
      const sp = this.serverPage();
      untracked(() => {
        if (this.cfg().pagination.mode !== 'server' || !sp) return;
        if (sp.page) this.page.set(sp.page);
        if (sp.pageSize) this.pageSizeState.set(sp.pageSize);
      });
    });
    this.destroyRef.onDestroy(() => this.clearSearchTimer());
  }

  ngOnInit(): void {
    const cfg = this.cfg();
    if (cfg.anyServer && cfg.emitInitialQuery) {
      // En microtarea para no modificar el estado del padre durante su detección de cambios.
      Promise.resolve().then(() => this.queryChange.emit(this.query()));
    }
  }

  // ───────────────────────── Búsqueda ─────────────────────────
  protected onSearchInput(value: string): void {
    this.searchTerm.set(value);
    this.clearSearchTimer();
    const { mode, debounce } = this.cfg().search;
    const delay = mode === 'server' ? debounce : 0;
    if (delay <= 0) {
      this.applySearchTerm(value);
    } else {
      this.searchTimer = setTimeout(() => this.applySearchTerm(value), delay);
    }
  }

  protected clearSearch(): void {
    this.searchTerm.set('');
    this.clearSearchTimer();
    this.applySearchTerm('');
  }

  private applySearchTerm(raw: string): void {
    const trimmed = raw.trim();
    const term = trimmed.length >= this.cfg().search.minChars ? trimmed : '';
    if (term === this.appliedSearch()) return;
    this.appliedSearch.set(term);
    this.searchChange.emit(term);
    this.commit('search', true);
  }

  private clearSearchTimer(): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }
  }

  // ───────────────────────── Orden ─────────────────────────
  protected isSortable(col: VzColumn<T>): boolean {
    return this.cfg().sort.enabled && col.type !== 'actions' && col.sortable !== false;
  }

  protected sortDirection(col: VzColumn<T>): 'asc' | 'desc' | null {
    return this.sort().find((s) => s.key === col.key)?.direction ?? null;
  }

  protected ariaSort(col: VzColumn<T>): 'ascending' | 'descending' | 'none' | null {
    if (!this.isSortable(col)) return null;
    const dir = this.sortDirection(col);
    return dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none';
  }

  protected sortRank(col: VzColumn<T>): number | null {
    const list = this.sort();
    if (list.length < 2) return null;
    const idx = list.findIndex((s) => s.key === col.key);
    return idx >= 0 ? idx + 1 : null;
  }

  protected toggleSort(col: VzColumn<T>, additive: boolean): void {
    if (!this.isSortable(col)) return;
    const current = this.sort();
    const idx = current.findIndex((s) => s.key === col.key);
    const nextDir = idx < 0 ? 'asc' : current[idx].direction === 'asc' ? 'desc' : null;
    let next: VzSortState[];

    if (additive && this.cfg().sort.multi) {
      if (idx < 0) next = [...current, { key: col.key, direction: 'asc' }];
      else if (nextDir) next = current.map((s, i) => (i === idx ? { ...s, direction: nextDir } : s));
      else next = current.filter((_, i) => i !== idx);
    } else if (idx >= 0 && current.length === 1) {
      next = nextDir ? [{ key: col.key, direction: nextDir }] : [];
    } else {
      next = [{ key: col.key, direction: 'asc' }];
    }

    this.sort.set(next);
    this.sortChange.emit(next);
    this.commit('sort', false);
  }

  // ───────────────────────── Filtros ─────────────────────────
  protected onNativeFilter(filter: VzTableFilter<T>, raw: string): void {
    const option = filter.options.find((o) => String(o.value) === raw);
    this.setFilter(filter.key, option ? option.value : null);
  }

  protected setFilter(key: string, value: unknown): void {
    this.filterValues.update((prev) => ({ ...prev, [key]: value }));
    this.filterChange.emit({ key, value: hasFilterValue(value) ? value : null });
    this.commit('filter', true);
  }

  // ───────────────────────── Paginación ─────────────────────────
  protected goToPage(page: number): void {
    this.page.set(page);
    this.pageChange.emit(page);
    this.commit('page', false);
  }

  protected changePageSize(size: number): void {
    this.pageSizeState.set(size);
    this.pageSizeChange.emit(size);
    this.commit('pageSize', true);
  }

  // ───────────────────────── Selección ─────────────────────────
  protected rowKeyOf(row: T): unknown {
    const key = this.cfg().rowKey;
    if (!key) return row;
    return typeof key === 'function' ? key(row) : (getByPath(row, key) ?? row);
  }

  protected trackKey(row: T, index: number): unknown {
    return this.cfg().rowKey ? this.rowKeyOf(row) : index;
  }

  protected isSelected(row: T): boolean {
    return this.selected().has(this.rowKeyOf(row));
  }

  protected toggleRow(row: T): void {
    const next = new Map(this.selected());
    const key = this.rowKeyOf(row);
    if (next.has(key)) next.delete(key);
    else next.set(key, row);
    this.setSelection(next);
  }

  protected toggleAllVisible(): void {
    const next = new Map(this.selected());
    const select = !this.allVisibleSelected();
    for (const row of this.visibleRows()) {
      if (select) next.set(this.rowKeyOf(row), row);
      else next.delete(this.rowKeyOf(row));
    }
    this.setSelection(next);
  }

  clearSelection(): void {
    this.setSelection(new Map());
  }

  private setSelection(next: Map<unknown, T>): void {
    this.selected.set(next);
    this.selectionChange.emit([...next.values()]);
  }

  // ───────────────────────── Filas, acciones y estados ─────────────────────────
  protected onRowClick(row: T, event: MouseEvent): void {
    if (!this.cfg().clickableRows) return;
    if ((event.target as HTMLElement).closest('button, a, input, select, label, textarea')) return;
    this.rowClick.emit(row);
  }

  protected visibleActions(col: VzColumn<T>, row: T): VzRowAction<T>[] {
    return (col.actions ?? []).filter((a) => !a.visible || a.visible(row));
  }

  protected actionClass(action: VzRowAction<T>): string {
    return action.variant === 'danger' ? 'vz-table__action vz-table__action--danger' : 'vz-table__action';
  }

  protected isActionDisabled(action: VzRowAction<T>, row: T): boolean {
    return !!action.disabled && action.disabled(row);
  }

  protected runAction(action: VzRowAction<T>, row: T): void {
    this.rowAction.emit({ action: action.name, row });
  }

  protected onRetry(): void {
    this.retry.emit();
  }

  // ───────────────────────── Celdas ─────────────────────────
  protected valueOf(row: T, col: VzColumn<T>): unknown {
    return col.valueGetter ? col.valueGetter(row) : getByPath(row, col.key);
  }

  protected cellText(row: T, col: VzColumn<T>): string {
    const value = this.valueOf(row, col);
    return col.formatter ? col.formatter(value, row) : formatValue(value, col);
  }

  protected headerClasses(col: VzColumn<T>): string {
    return this.alignClass(col, 'vz-table__th', col.headerClass);
  }

  protected cellClasses(col: VzColumn<T>, row?: T): string {
    const extra = typeof col.cellClass === 'function' ? (row !== undefined ? col.cellClass(row) : '') : col.cellClass;
    return this.alignClass(col, 'vz-table__td', extra);
  }

  private alignClass(col: VzColumn<T>, base: string, extra?: string): string {
    const align = col.align ?? (col.type === 'number' || col.type === 'currency' ? 'end' : col.type === 'actions' ? 'end' : 'start');
    return [
      base,
      `is-align-${align}`,
      col.type === 'number' || col.type === 'currency' ? 'is-numeric' : '',
      col.sticky ? `is-sticky-${col.sticky}` : '',
      extra ?? '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  protected badgeClass(row: T, col: VzColumn<T>): string {
    const value = this.valueOf(row, col);
    const resolver = col.badgeVariant;
    let variant: VzBadgeVariant = 'neutral';
    if (typeof resolver === 'function') variant = resolver(value, row);
    else if (typeof resolver === 'string') variant = resolver;
    else if (resolver) variant = resolver[String(value)] ?? 'neutral';
    return `vz-badge vz-badge--${variant}`;
  }

  // ───────────────────────── Procesamiento en cliente ─────────────────────────
  private applyFilters(rows: T[]): T[] {
    const values = this.filterValues();
    const active = this.filters().filter((f) => hasFilterValue(values[f.key]));
    if (!active.length) return rows;
    return rows.filter((row) =>
      active.every((f) => (f.match ? f.match(row, values[f.key]) : String(getByPath(row, f.key)) === String(values[f.key]))),
    );
  }

  private applySearch(rows: T[]): T[] {
    const tokens = normalizeText(this.appliedSearch()).split(/\s+/).filter(Boolean);
    if (!tokens.length) return rows;
    const cols = this.visibleColumns().filter((c) => c.type !== 'actions' && c.searchable !== false);
    return rows.filter((row) => {
      const haystack = cols.map((c) => `${normalizeText(this.cellText(row, c))} ${normalizeText(this.valueOf(row, c))}`).join(' | ');
      return tokens.every((t) => haystack.includes(t));
    });
  }

  private applySort(rows: T[]): T[] {
    const sorts = this.sort();
    if (!sorts.length) return rows;
    const byKey = new Map(this.columns().map((c) => [c.key, c]));
    return [...rows].sort((a, b) => {
      for (const s of sorts) {
        const col = byKey.get(s.key);
        if (!col) continue;
        const va = this.sortValue(a, col);
        const vb = this.sortValue(b, col);
        const aNil = isNil(va);
        const bNil = isNil(vb);
        if (aNil && bNil) continue;
        if (aNil) return 1; // los vacíos siempre al final
        if (bNil) return -1;
        const result = compareValues(va, vb);
        if (result !== 0) return s.direction === 'asc' ? result : -result;
      }
      return 0;
    });
  }

  private sortValue(row: T, col: VzColumn<T>): unknown {
    const value = this.valueOf(row, col);
    return col.type === 'date' ? (parseDateValue(value)?.getTime() ?? null) : value;
  }

  // ───────────────────────── Coordinación cliente/servidor ─────────────────────────
  /**
   * Cierra un cambio de estado: reinicia la página si aplica y decide si hay que
   * avisar al backend (`queryChange`) según el modo de la capacidad modificada.
   */
  private commit(source: ChangeSource, resetPage: boolean): void {
    const cfg = this.cfg();
    const capabilityMode = {
      search: cfg.search.mode,
      sort: cfg.sort.mode,
      page: cfg.pagination.mode,
      pageSize: cfg.pagination.mode,
      filter: cfg.filters.mode,
    }[source];
    let notifyServer = capabilityMode === 'server';

    if (resetPage && this.page() !== 1) {
      this.page.set(1);
      this.pageChange.emit(1);
      if (cfg.pagination.mode === 'server') notifyServer = true;
    }
    if (notifyServer) {
      this.queryChange.emit(this.query());
    }
  }
}
