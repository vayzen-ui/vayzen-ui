export * from './card.component';
export * from './card.directives';
export * from './card.types';

import { VzCardComponent } from './card.component';
import {
  VzCardActionsDirective,
  VzCardContentDirective,
  VzCardFooterDirective,
  VzCardHeaderDirective,
  VzCardImageDirective,
  VzCardSubtitleDirective,
  VzCardTitleDirective,
} from './card.directives';

/** Atajo para importar el componente Card y todas sus directivas de slot. */
export const VZ_CARD_IMPORTS = [
  VzCardComponent,
  VzCardHeaderDirective,
  VzCardTitleDirective,
  VzCardSubtitleDirective,
  VzCardActionsDirective,
  VzCardContentDirective,
  VzCardFooterDirective,
  VzCardImageDirective,
] as const;

