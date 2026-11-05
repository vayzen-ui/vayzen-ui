import {
  VzModalActionsDirective,
  VzModalBodyDirective,
  VzModalFooterDirective,
  VzModalHeaderDirective,
  VzModalTitleDirective,
} from './modal.directives';
import { VzModalComponent } from './modal.component';

export * from './modal.component';
export * from './modal.directives';
export * from './modal.types';

export const VZ_MODAL_IMPORTS = [
  VzModalComponent,
  VzModalHeaderDirective,
  VzModalTitleDirective,
  VzModalBodyDirective,
  VzModalFooterDirective,
  VzModalActionsDirective,
] as const;

