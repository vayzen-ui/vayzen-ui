export * from './select.types';
export * from './select.directive';
export * from './select.component';

import { VzSelectComponent } from './select.component';
import {
  VzSelectOptionDirective,
  VzSelectTriggerDirective,
} from './select.directive';

export const VZ_SELECT_IMPORTS = [
  VzSelectComponent,
  VzSelectOptionDirective,
  VzSelectTriggerDirective,
] as const;

