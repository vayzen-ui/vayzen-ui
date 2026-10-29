export * from './card.component';
export * from './card.directives';
export * from './card.types';

import { VzCardComponent } from './card.component';
import { VZ_CARD_DIRECTIVES } from './card.directives';

/** Atajo para importar el componente Card y todas sus directivas semánticas y de estructura. */
export const VZ_CARD_IMPORTS = [
  VzCardComponent,
  ...VZ_CARD_DIRECTIVES,
] as const;
