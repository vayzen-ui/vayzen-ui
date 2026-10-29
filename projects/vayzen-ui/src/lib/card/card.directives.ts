import { Directive, input } from '@angular/core';
import type { VzCardImagePosition } from './card.types';

@Directive({
  selector: '[vzCardHeader]',
  standalone: true,
  host: {
    class: 'vz-card__header',
  },
})
export class VzCardHeaderDirective {}

@Directive({
  selector: '[vzCardTitle]',
  standalone: true,
  host: {
    class: 'vz-card__title',
  },
})
export class VzCardTitleDirective {}

@Directive({
  selector: '[vzCardSubtitle]',
  standalone: true,
  host: {
    class: 'vz-card__subtitle',
  },
})
export class VzCardSubtitleDirective {}

@Directive({
  selector: '[vzCardActions]',
  standalone: true,
  host: {
    class: 'vz-card__actions',
  },
})
export class VzCardActionsDirective {}

@Directive({
  selector: '[vzCardContent]',
  standalone: true,
  host: {
    class: 'vz-card__content',
  },
})
export class VzCardContentDirective {}

@Directive({
  selector: '[vzCardFooter]',
  standalone: true,
  host: {
    class: 'vz-card__footer',
  },
})
export class VzCardFooterDirective {}

@Directive({
  selector: '[vzCardImage]',
  standalone: true,
  host: {
    class: 'vz-card__image',
    '[class.vz-card__image--top]': "position() === 'top'",
    '[class.vz-card__image--bottom]': "position() === 'bottom'",
    '[class.vz-card__image--cover]': "position() === 'cover'",
  },
})
export class VzCardImageDirective {
  readonly position = input<VzCardImagePosition>('top');
}

export const VZ_CARD_DIRECTIVES = [
  VzCardHeaderDirective,
  VzCardTitleDirective,
  VzCardSubtitleDirective,
  VzCardActionsDirective,
  VzCardContentDirective,
  VzCardFooterDirective,
  VzCardImageDirective,
] as const;

