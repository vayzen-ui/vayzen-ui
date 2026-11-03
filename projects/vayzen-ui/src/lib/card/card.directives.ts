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
 * Enlace estilizado para el pie de la tarjeta (ej. "nexus.store/@nexus-hardware").
 */
@Directive({
  selector: '[vzCardLink]',
  standalone: true,
  host: {
    class: 'vz-card__link',
  },
})
export class VzCardLinkDirective {}

/**
 * Panel lateral / drawer personalizado para la tarjeta (ej. filtros, historial o panel a medida).
 * Si no se proyecta, VzCard arma automáticamente el panel de comentarios por defecto al activar [drawerOpen].
 */
@Directive({
  selector: '[vzCardDrawer]',
  standalone: true,
  host: {
    class: 'vz-card__drawer',
  },
})
export class VzCardDrawerDirective {}

/**
 * Píldora o tarjeta flotante sobre elementos multimedia con efecto glassmorphism
 * (ej. ficha de producto destacado sobre imagen con precio y nombre).
 */
@Directive({
  selector: '[vzCardProductOverlay]',
  standalone: true,
  host: {
    class: 'vz-card__product-overlay',
  },
})
export class VzCardProductOverlayDirective {}

/**
 * Avatar estilizado para cabeceras de tarjetas sociales o tiendas (44x44px con bordes redondeados).
 */
@Directive({
  selector: '[vzCardAvatar]',
  standalone: true,
  host: {
    class: 'vz-card__avatar',
  },
})
export class VzCardAvatarDirective {}

/**
 * Contenedor multimedia edge-to-edge (de borde a borde) para imágenes o videos con soporte para [vzCardProductOverlay].
 */
@Directive({
  selector: '[vzCardMedia]',
  standalone: true,
  host: {
    class: 'vz-card__media-container',
  },
})
export class VzCardMediaDirective {}

/**
 * Barra de aviso logístico o punto de encuentro de borde a borde.
 */
@Directive({
  selector: '[vzCardLogistics]',
  standalone: true,
  host: {
    class: 'vz-card__logistics',
  },
})
export class VzCardLogisticsDirective {}

/**
 * Botón de acción social en forma de píldora (Me gusta, Comentarios, Mensaje, Compartir).
 */
@Directive({
  selector: '[vzCardSocialAction]',
  standalone: true,
  host: {
    class: 'vz-card__social-action',
    '[class.is-liked]': 'liked()',
    '[class.is-active]': 'active()',
  },
})
export class VzCardSocialActionDirective {
  readonly liked = input<boolean>(false);
  readonly active = input<boolean>(false);
}

/**
 * Botón CTA principal en forma de píldora con sombra elevada (ej. "Agendar Pedido").
 */
@Directive({
  selector: '[vzCardCta]',
  standalone: true,
  host: {
    class: 'vz-card__cta',
  },
})
export class VzCardCtaDirective {}

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
  VzCardDrawerDirective,
  VzCardProductOverlayDirective,
  VzCardAvatarDirective,
  VzCardMediaDirective,
  VzCardLogisticsDirective,
  VzCardSocialActionDirective,
  VzCardCtaDirective,
] as const;
