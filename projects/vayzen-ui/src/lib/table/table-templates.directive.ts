import { Directive, TemplateRef, inject, input } from '@angular/core';
import type { VzColumn, VzFilterOption, VzTableFilter } from './table.types';

export interface VzCellContext<T = any> {
  $implicit: T;
  value: unknown;
  column: VzColumn<T>;
  index: number;
}

export interface VzFilterControlContext<T = any> {
  $implicit: VzTableFilter<T>;
  filter: VzTableFilter<T>;
  /** Valor actual del filtro (`null` si no hay). */
  value: unknown;
  options: VzFilterOption[];
  /** Llama a esta función con el nuevo valor (o `null` para limpiar). */
  change: (value: unknown) => void;
}

/**
 * Reemplaza el contenido de una celda.
 * `<ng-template vzCell="estatus" let-row let-value="value">...</ng-template>`
 */
@Directive({ selector: 'ng-template[vzCell]', standalone: true })
export class VzCellDirective {
  readonly key = input.required<string>({ alias: 'vzCell' });
  readonly template = inject<TemplateRef<VzCellContext>>(TemplateRef);
}

/**
 * Reemplaza el `<select>` nativo de un filtro por tu propio control.
 * `<ng-template vzFilterControl="estatus" let-filter let-value="value" let-change="change">...</ng-template>`
 */
@Directive({ selector: 'ng-template[vzFilterControl]', standalone: true })
export class VzFilterControlDirective {
  readonly key = input.required<string>({ alias: 'vzFilterControl' });
  readonly template = inject<TemplateRef<VzFilterControlContext>>(TemplateRef);
}

/** Slot semántico para proyectar un bloque de título o encabezado personalizado en la barra superior. */
@Directive({ selector: '[vzTableTitle]', standalone: true })
export class VzTableTitleDirective {}

/** Slot semántico para proyectar controles de filtrado adicionales en la barra superior. */
@Directive({ selector: '[vzTableFilters]', standalone: true })
export class VzTableFiltersDirective {}

/** Slot semántico para proyectar botones de acción en el extremo derecho de la barra superior. */
@Directive({ selector: '[vzTableActions]', standalone: true })
export class VzTableActionsDirective {}

/** Slot semántico para proyectar un estado vacío personalizado cuando no hay registros. */
@Directive({ selector: '[vzTableEmpty]', standalone: true })
export class VzTableEmptyDirective {}

/** Slot semántico para proyectar información adicional en el pie de la tabla. */
@Directive({ selector: '[vzTableFooter]', standalone: true })
export class VzTableFooterDirective {}
