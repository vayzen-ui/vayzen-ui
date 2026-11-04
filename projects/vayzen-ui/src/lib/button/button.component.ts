import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  booleanAttribute,
} from '@angular/core';
import {
  VzButtonColor,
  VzButtonIconPosition,
  VzButtonSize,
  VzButtonTheme,
  VzButtonType,
  VzButtonVariant,
} from './button.types';

@Component({
  selector: 'vz-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-theme]': 'resolvedTheme()',
    '[class.is-dark]': 'isDark()',
    '[class.vz-button-host--full]': 'fullWidth()',
  },
})
export class VzButtonComponent {
  // ── Modo Oscuro / Temas de Fábrica ──
  readonly theme = input<VzButtonTheme | undefined>(undefined);
  readonly dark = input<boolean, unknown>(false, { transform: booleanAttribute });

  // ── Estilo y Color ──
  readonly variant = input<VzButtonVariant>('solid');
  readonly color = input<VzButtonColor>('primary');
  readonly size = input<VzButtonSize>('md');
  readonly type = input<VzButtonType>('button');

  // ── Estados y Modificadores ──
  readonly disabled = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly loading = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly pill = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly iconOnly = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly fullWidth = input<boolean, unknown>(false, { transform: booleanAttribute });

  // ── Icono y Badge ──
  readonly icon = input<string | undefined>(undefined);
  readonly iconPosition = input<VzButtonIconPosition>('left');
  readonly badge = input<string | number | undefined>(undefined);
  readonly badgeVariant = input<VzButtonColor | undefined>(undefined);

  // ── Accesibilidad ──
  readonly ariaLabel = input<string | undefined>(undefined);

  // ── Eventos ──
  readonly clicked = output<MouseEvent>();

  // ── Señales Derivadas ──
  protected readonly resolvedTheme = computed<VzButtonTheme | null>(() =>
    this.dark() ? 'dark' : (this.theme() ?? null),
  );
  protected readonly isDark = computed(() => this.resolvedTheme() === 'dark');

  protected readonly effectiveVariant = computed<'solid' | 'outline' | 'soft' | 'ghost' | 'link'>(() => {
    const v = this.variant();
    if (v === 'primary' || v === 'secondary') return 'solid';
    return v;
  });

  protected readonly effectiveColor = computed<VzButtonColor>(() => {
    const v = this.variant();
    if (v === 'primary') return 'primary';
    if (v === 'secondary') return 'secondary';
    return this.color();
  });

  protected readonly effectiveBadgeVariant = computed<VzButtonColor>(() => {
    return this.badgeVariant() ?? (this.effectiveVariant() === 'solid' ? 'light' : 'primary');
  });

  protected readonly computedAriaLabel = computed<string | undefined>(() => {
    if (this.ariaLabel()) return this.ariaLabel();
    return undefined;
  });

  protected readonly buttonClasses = computed(() => {
    const classes = [
      'vz-btn',
      `vz-btn--${this.effectiveVariant()}`,
      `vz-btn--color-${this.effectiveColor()}`,
      `vz-btn--${this.size()}`,
    ];

    if (this.pill()) classes.push('vz-btn--pill');
    if (this.iconOnly()) classes.push('vz-btn--icon-only');
    if (this.fullWidth()) classes.push('vz-btn--full');
    if (this.loading()) classes.push('is-loading');
    if (this.disabled()) classes.push('is-disabled');

    return classes.join(' ');
  });

  protected handleClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }
}
