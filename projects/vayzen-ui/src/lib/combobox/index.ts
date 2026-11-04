export * from './combobox.types';
export * from './combobox.directive';
export * from './combobox.component';

import { VzComboboxComponent } from './combobox.component';
import {
  VzComboboxOptionDirective,
  VzComboboxTriggerDirective,
} from './combobox.directive';

export const VZ_COMBOBOX_IMPORTS = [
  VzComboboxComponent,
  VzComboboxOptionDirective,
  VzComboboxTriggerDirective,
] as const;

