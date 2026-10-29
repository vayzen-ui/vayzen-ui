import { computed, Directive, input } from '@angular/core';
import type { VzCardImagePosition, VzCardTone } from './card.types';

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

/**
 * Fila superior dentro de la tarjeta para colocar un badge de categoría a la izquierda
 * y una calificación (rating) o indicador de estado a la derecha.
 */
@Directive({
  selector: '[vzCardEyebrow]',
  standalone: true,
  host: {
    class: 'vz-card__eyebrow',
  },
})
export class VzCardEyebrowDirective {}

/**
 * Pastilla (pill badge) semántica de categoría para tarjetas (ej. "TECNOLOGÍA", "ACADÉMICO").
 */
@Directive({
  selector: '[vzCardBadge]',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class VzCardBadgeDirective {
  readonly variant = input<VzCardTone>('primary');
  protected readonly hostClasses = computed(
    () => `vz-card__badge vz-card__badge--${this.variant()}`
  );
}

/**
 * Indicador de calificación o puntaje destacado (ej. "★ 4.95").
 */
@Directive({
  selector: '[vzCardRating]',
  standalone: true,
  host: {
    class: 'vz-card__rating',
  },
})
export class VzCardRatingDirective {}

/**
 * Contenedor de indicadores de confianza o metadatos en línea separados automáticamente por puntos (·).
 */
@Directive({
  selector: '[vzCardMeta]',
  standalone: true,
  host: {
    class: 'vz-card__meta',
  },
})
export class VzCardMetaDirective {}

/**
 * Elemento individual dentro de [vzCardMeta] (ej. "Verificado", "99% Seriedad", "98% Puntualidad").
 */
@Directive({
  selector: '[vzCardMetaItem]',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class VzCardMetaItemDirective {
  readonly tone = input<VzCardTone | 'default'>('default');
  protected readonly hostClasses = computed(
    () => `vz-card__meta-item vz-card__meta-item--${this.tone()}`
  );
}

/**
 * Divisor horizontal sutil (punteado o continuo) para separar bloques dentro de una tarjeta completa.
 */
@Directive({
  selector: '[vzCardDivider]',
  standalone: true,
  host: {
    class: 'vz-card__divider',
    '[class.vz-card__divider--solid]': "lineStyle() === 'solid'",
  },
})
export class VzCardDividerDirective {
  readonly lineStyle = input<'dashed' | 'solid'>('dashed');
}

/**
 * Contenedor flexible de etiquetas/chips de atributos o métodos aceptados.
 */
@Directive({
  selector: '[vzCardTags]',
  standalone: true,
  host: {
    class: 'vz-card__tags',
  },
})
export class VzCardTagsDirective {}

/**
 * Chip semántico con borde suave para mostrar atributos (ej. "Efectivo", "Digital", "Coin Points").
 */
@Directive({
  selector: '[vzCardTag]',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class VzCardTagDirective {
  readonly tone = input<VzCardTone>('neutral');
  protected readonly hostClasses = computed(
    () => `vz-card__tag vz-card__tag--${this.tone()}`
  );
}

/**
 * Fila inferior del cuerpo para mostrar ubicación/horario a la izquierda y una acción secundaria (ej. "Ver QR") a la derecha.
 */
@Directive({
  selector: '[vzCardInfoRow]',
  standalone: true,
  host: {
    class: 'vz-card__info-row',
  },
})
export class VzCardInfoRowDirective {}

/**
 * Enlace estilizado para el pie de la tarjeta (ej. "kintab.app/@nexus-hardw").
 */
@Directive({
  selector: '[vzCardLink]',
  standalone: true,
  host: {
    class: 'vz-card__link',
  },
})
export class VzCardLinkDirective {}

export const VZ_CARD_DIRECTIVES = [
  VzCardHeaderDirective,
  VzCardTitleDirective,
  VzCardSubtitleDirective,
  VzCardActionsDirective,
  VzCardContentDirective,
  VzCardFooterDirective,
  VzCardImageDirective,
  VzCardEyebrowDirective,
  VzCardBadgeDirective,
  VzCardRatingDirective,
  VzCardMetaDirective,
  VzCardMetaItemDirective,
  VzCardDividerDirective,
  VzCardTagsDirective,
  VzCardTagDirective,
  VzCardInfoRowDirective,
  VzCardLinkDirective,
] as const;
