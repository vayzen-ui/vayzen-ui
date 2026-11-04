export * from './multi-select.types';
export * from './multi-select.directive';
export * from './multi-select.component';

import { VzMultiSelectComponent } from './multi-select.component';
import {
  VzMultiSelectOptionDirective,
  VzMultiSelectTriggerDirective,
} from './multi-select.directive';

export const VZ_MULTI_SELECT_IMPORTS = [
  VzMultiSelectComponent,
  VzMultiSelectOptionDirective,
  VzMultiSelectTriggerDirective,
] as const;

