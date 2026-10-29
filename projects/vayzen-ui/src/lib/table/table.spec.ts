import { TestBed } from '@angular/core/testing';
import { VzTableComponent } from './table.component';
import type { VzColumn, VzTableConfig, VzTableQuery } from './table.types';
import { buildPageList, compareValues, formatValue, normalizeText, resolveConfig } from './table.utils';

interface Row {
  id: number;
  name: string;
  status: string;
  amount: number;
}

const COLUMNS: VzColumn<Row>[] = [
  { key: 'name', header: 'Nombre' },
  { key: 'status', header: 'Estatus' },
  { key: 'amount', header: 'Monto', type: 'currency' },
];

const ROWS: Row[] = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: i === 0 ? 'Ángela Pérez' : `Persona ${i + 1}`,
  status: i % 2 === 0 ? 'Activo' : 'Inactivo',
  amount: (i + 1) * 100,
}));

function setup(config: VzTableConfig = {}, data: Row[] = ROWS) {
  const fixture = TestBed.createComponent(VzTableComponent<Row>);
  fixture.componentRef.setInput('columns', COLUMNS);
  fixture.componentRef.setInput('data', data);
  fixture.componentRef.setInput('config', { rowKey: 'id', ...config });
  fixture.detectChanges();
  return fixture;
}

const el = (f: { nativeElement: HTMLElement }) => f.nativeElement;
const bodyRows = (f: { nativeElement: HTMLElement }) => el(f).querySelectorAll('tbody .vz-table__row');
const firstColumnTexts = (f: { nativeElement: HTMLElement }) =>
  Array.from(el(f).querySelectorAll('tbody .vz-table__row td:first-child')).map((td) => td.textContent?.trim());

describe('table utils', () => {
  it('normaliza acentos y mayúsculas', () => {
    expect(normalizeText('Ángela PÉREZ')).toBe('angela perez');
  });

  it('construye la lista de páginas con elipsis', () => {
    expect(buildPageList(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(buildPageList(1, 20)).toEqual([1, 2, 3, 4, 5, null, 20]);
    expect(buildPageList(10, 20)).toEqual([1, null, 9, 10, 11, null, 20]);
    expect(buildPageList(20, 20)).toEqual([1, null, 16, 17, 18, 19, 20]);
  });

  it('compara números y textos de forma natural', () => {
    expect(compareValues(2, 10)).toBeLessThan(0);
    expect(compareValues('Item 2', 'Item 10')).toBeLessThan(0);
  });

  it('formatea moneda y vacíos', () => {
    expect(formatValue(null, { key: 'x', header: 'x' })).toBe('—');
    expect(formatValue(1500, { key: 'x', header: 'x', type: 'currency' })).toContain('1,500');
  });

  it('resuelve la configuración y detecta modo servidor', () => {
    expect(resolveConfig({}).anyServer).toBe(false);
    expect(resolveConfig({ pagination: { mode: 'server' } }).anyServer).toBe(true);
    expect(resolveConfig({ mode: 'server', search: { mode: 'client' } }).search.mode).toBe('client');
  });
});

describe('VzTableComponent · modo cliente', () => {
  it('pagina localmente', () => {
    const f = setup({ pagination: { defaultPageSize: 10 } });
    expect(bodyRows(f).length).toBe(10);
    expect(el(f).querySelector('.vz-pagination__info')?.textContent).toContain('1–10');
  });

  it('busca ignorando acentos y mayúsculas', () => {
    const f = setup();
    const input = el(f).querySelector<HTMLInputElement>('.vz-table__search-input')!;
    input.value = 'angela';
    input.dispatchEvent(new Event('input'));
    f.detectChanges();
    expect(bodyRows(f).length).toBe(1);
    expect(firstColumnTexts(f)[0]).toBe('Ángela Pérez');
  });

  it('muestra el estado vacío cuando no hay coincidencias', () => {
    const f = setup();
    const input = el(f).querySelector<HTMLInputElement>('.vz-table__search-input')!;
    input.value = 'zzzz';
    input.dispatchEvent(new Event('input'));
    f.detectChanges();
    expect(el(f).querySelector('.vz-table__state')?.textContent).toContain('No se encontraron datos');
  });

  it('ordena y soporta orden múltiple con shift', () => {
    const f = setup({ pagination: { enabled: false } });
    const sortBtns = () => el(f).querySelectorAll<HTMLButtonElement>('.vz-table__sort');

    sortBtns()[2].click(); // monto asc
    f.detectChanges();
    expect(firstColumnTexts(f)[0]).toBe('Ángela Pérez');

    sortBtns()[2].click(); // monto desc
    f.detectChanges();
    expect(firstColumnTexts(f)[0]).toBe('Persona 25');

    // Orden múltiple: estatus asc (shift) y luego monto desc como desempate
    sortBtns()[1].dispatchEvent(new MouseEvent('click', { shiftKey: true }));
    f.detectChanges();
    const ranks = el(f).querySelectorAll('.vz-table__sort-rank');
    expect(ranks.length).toBe(2);
  });

  it('filtra con el select nativo', () => {
    const f = setup();
    f.componentRef.setInput('filters', [
      { key: 'status', label: 'Estatus', options: [{ value: 'Activo', label: 'Activo' }, { value: 'Inactivo', label: 'Inactivo' }] },
    ]);
    f.detectChanges();
    const select = el(f).querySelector<HTMLSelectElement>('.vz-table__select')!;
    select.value = 'Activo';
    select.dispatchEvent(new Event('change'));
    f.detectChanges();
    expect(el(f).querySelector('.vz-table__chip')?.textContent).toContain('13 registros');
  });

  it('selecciona filas y emite la selección', () => {
    const f = setup();
    const emitted: Row[][] = [];
    f.componentInstance.selectionChange.subscribe((rows) => emitted.push(rows));
    f.componentRef.setInput('config', { rowKey: 'id', selectable: true });
    f.detectChanges();
    el(f).querySelectorAll<HTMLInputElement>('tbody .vz-table__checkbox')[0].click();
    f.detectChanges();
    expect(emitted.at(-1)?.length).toBe(1);
    expect(emitted.at(-1)?.[0].id).toBe(1);
  });
});

describe('VzTableComponent · modo servidor', () => {
  it('emite la consulta inicial y no pagina localmente', async () => {
    const f = setup({ mode: 'server' }, ROWS.slice(0, 10));
    f.componentRef.setInput('serverPage', { total: 245 });
    const queries: VzTableQuery[] = [];
    f.componentInstance.queryChange.subscribe((q) => queries.push(q));
    // La consulta inicial se emite en microtarea; se vuelve a leer para comprobar el estado.
    await Promise.resolve();
    f.detectChanges();
    expect(bodyRows(f).length).toBe(10);
    expect(el(f).querySelector('.vz-pagination__info')?.textContent).toContain('245');
  });

  it('emite queryChange al cambiar de página, buscar u ordenar', () => {
    const f = setup({ mode: 'server', search: { debounce: 0 } }, ROWS.slice(0, 10));
    f.componentRef.setInput('serverPage', { total: 100 });
    f.detectChanges();
    const queries: VzTableQuery[] = [];
    f.componentInstance.queryChange.subscribe((q) => queries.push(q));

    el(f).querySelectorAll<HTMLButtonElement>('.vz-pagination__btn--page')[1].click();
    f.detectChanges();
    expect(queries.at(-1)).toMatchObject({ page: 2, pageSize: 10 });

    const input = el(f).querySelector<HTMLInputElement>('.vz-table__search-input')!;
    input.value = 'ana';
    input.dispatchEvent(new Event('input'));
    f.detectChanges();
    expect(queries.at(-1)).toMatchObject({ page: 1, search: 'ana' }); // la búsqueda reinicia la página

    el(f).querySelectorAll<HTMLButtonElement>('.vz-table__sort')[0].click();
    f.detectChanges();
    expect(queries.at(-1)?.sort).toEqual([{ key: 'name', direction: 'asc' }]);
  });

  it('con búsqueda en cliente y paginación en servidor solo avisa al backend por la paginación', () => {
    const f = setup({ mode: 'server', search: { mode: 'client' } }, ROWS.slice(0, 10));
    f.componentRef.setInput('serverPage', { total: 100 });
    f.detectChanges();
    const queries: VzTableQuery[] = [];
    f.componentInstance.queryChange.subscribe((q) => queries.push(q));

    const input = el(f).querySelector<HTMLInputElement>('.vz-table__search-input')!;
    input.value = 'persona 2';
    input.dispatchEvent(new Event('input'));
    f.detectChanges();
    expect(queries.length).toBe(0); // filtrado local, sin llamada al backend
    expect(bodyRows(f).length).toBeLessThan(10);
  });
});

