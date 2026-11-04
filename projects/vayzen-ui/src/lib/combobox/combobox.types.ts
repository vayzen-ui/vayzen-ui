/**
 * @fileoverview Tipos e interfaces oficiales para VzCombobox
 * Estándar Oficial Vayzen UI (`@vayzen-ui`)
 */

export interface VzComboboxOption<T = any> {
  /** Identificador único o valor del modelo */
  id: T;
  /** Texto principal visible */
  descripcion?: string;
  /** Alias estándar alternativo para descripción */
  label?: string;
  /** Subtítulo o texto secundario explicativo */
  subtitle?: string;
  /** Estado activo/inactivo (false desactiva la selección) */
  activo?: boolean;
  /** Alias estándar para activo */
  disabled?: boolean;
  /** Nombre o clave del icono SVG opcional */
  icon?: string;
  /** URL de imagen para avatar (selectores de personas/colaboradores) */
  avatar?: string;
  /** Iniciales o texto del avatar cuando no hay imagen (ej. 'SC', 'AR') */
  avatarText?: string;
  /** Color de fondo personalizado para el avatar de iniciales */
  avatarColor?: string;
  /** Estatus de disponibilidad para dot indicador ('online' | 'busy' | 'away' | 'offline' o color CSS) */
  status?: 'online' | 'busy' | 'away' | 'offline' | string;
  /** Color personalizado para el dot de estatus */
  statusColor?: string;
  /** Badge o píldora opcional junto a la opción */
  badge?: string;
  /** Variante del badge (primary, success, warning, danger, neutral) */
  badgeVariant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  /** Datos adicionales arbitrarios */
  [key: string]: any;
}

export type VzComboboxSize = 'sm' | 'md' | 'lg';
export type VzComboboxVariant = 'outline' | 'filled' | 'flush';
export type VzComboboxTheme = 'light' | 'dark' | 'auto';

