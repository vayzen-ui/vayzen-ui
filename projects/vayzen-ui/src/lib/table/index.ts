export * from './table.component';
export * from './pagination/pagination.component';
export * from './table-templates.directive';
export * from './table.types';

import { VzTableComponent } from './table.component';
import { VzPaginationComponent } from './pagination/pagination.component';
import { VzCellDirective, VzFilterControlDirective } from './table-templates.directive';

/** Atajo: `imports: [...VZ_TABLE_IMPORTS]` trae la tabla, la paginación y las directivas de templates. */
export const VZ_TABLE_IMPORTS = [VzTableComponent, VzPaginationComponent, VzCellDirective, VzFilterControlDirective] as const;
