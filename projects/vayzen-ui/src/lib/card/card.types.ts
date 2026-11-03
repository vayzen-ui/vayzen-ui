export type VzCardVariant = 'elevated' | 'outlined' | 'flat' | 'accent';
export type VzCardAccent = 'primary' | 'success' | 'warning' | 'danger' | 'info' | string;
export type VzCardAccentPosition = 'top' | 'left';
export type VzCardDensity = 'compact' | 'comfortable' | 'spacious';
export type VzCardOrientation = 'vertical' | 'horizontal';
export type VzCardImagePosition = 'top' | 'bottom' | 'cover';
export type VzCardTone = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export type VzCardTheme = 'light' | 'dark' | 'auto';

/**
 * Modelo de comentario para el panel lateral (drawer) integrado de VzCard.
 */
export interface VzCardComment {
  id: string | number;
  author: string;
  text: string;
  time?: string;
  verifiedBuyer?: boolean;
  badgeText?: string;
  avatarUrl?: string;
}
