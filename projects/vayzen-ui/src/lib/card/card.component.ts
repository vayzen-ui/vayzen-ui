import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  output,
} from '@angular/core';
import { VzCardHeaderDirective } from './card.directives';
import type {
  VzCardAccent,
  VzCardAccentPosition,
  VzCardDensity,
  VzCardOrientation,
  VzCardVariant,
} from './card.types';

@Component({
  selector: 'vz-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[style]': 'hostStyles()',
    '[attr.role]': "clickable() ? 'button' : null",
    '[attr.tabindex]': "clickable() && !disabled() ? 0 : null",
    '[attr.aria-disabled]': 'disabled() ? true : null',
    '(click)': 'onClick($event)',
    '(keydown.enter)': 'onKeydown($event)',
    '(keydown.space)': 'onKeydown($event)',
  },
})
export class VzCardComponent {
  // ── Inputs ──
  readonly variant = input<VzCardVariant>('elevated');
  readonly density = input<VzCardDensity>('comfortable');
  readonly orientation = input<VzCardOrientation>('vertical');
  readonly accent = input<VzCardAccent>('primary');
  readonly accentPosition = input<VzCardAccentPosition>('top');
  readonly borderedHeader = input<boolean>(true);
  readonly borderedFooter = input<boolean>(true);

  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly imageUrl = input<string>('');
  readonly imageAlt = input<string>('');
  readonly hoverable = input<boolean>(false);
  readonly clickable = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  // ── Outputs ──
  readonly clicked = output<MouseEvent | KeyboardEvent>();

  // ── Slotted Header Detection ──
  private readonly headerSlot = contentChild(VzCardHeaderDirective);
  protected readonly hasHeaderSlot = computed(() => !!this.headerSlot());

  // Semantics
  private readonly semanticAccents = ['primary', 'success', 'warning', 'danger', 'info'];

  protected readonly isSemanticAccent = computed(() => {
    return this.semanticAccents.includes(this.accent());
  });

  protected readonly hostClasses = computed(() => {
    const isAccent = this.variant() === 'accent';
    const classes = [
      'vz-card',
      `vz-card--${this.variant()}`,
      `vz-card--${this.density()}`,
      `vz-card--${this.orientation()}`,
      isAccent && this.isSemanticAccent() ? `vz-card--accent-${this.accent()}` : '',
      isAccent ? `vz-card--accent-${this.accentPosition()}` : '',
      !this.borderedHeader() ? 'vz-card--seamless-header' : '',
      !this.borderedFooter() ? 'vz-card--seamless-footer' : '',
      this.hoverable() || this.clickable() ? 'is-hoverable' : '',
      this.clickable() ? 'is-clickable' : '',
      this.loading() ? 'is-loading' : '',
      this.disabled() ? 'is-disabled' : '',
    ];
    return classes.filter(Boolean).join(' ');
  });

  protected readonly hostStyles = computed(() => {
    if (this.variant() === 'accent' && !this.isSemanticAccent() && this.accent()) {
      return { '--vz-card-accent-color': this.accent() };
    }
    return {};
  });

  protected onClick(event: MouseEvent): void {
    if (this.disabled() || !this.clickable()) return;
    this.clicked.emit(event);
  }

  protected onKeydown(event: Event): void {
    if (this.disabled() || !this.clickable()) return;
    event.preventDefault();
    this.clicked.emit(event as KeyboardEvent);
  }
}
