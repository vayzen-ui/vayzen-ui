import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  output,
} from '@angular/core';
import { VzCardHeaderDirective } from './card.directives';
import type { VzCardDensity, VzCardVariant } from './card.types';

@Component({
  selector: 'vz-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
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

  protected readonly hostClasses = computed(() => {
    return [
      'vz-card',
      `vz-card--${this.variant()}`,
      `vz-card--${this.density()}`,
      this.hoverable() || this.clickable() ? 'is-hoverable' : '',
      this.clickable() ? 'is-clickable' : '',
      this.loading() ? 'is-loading' : '',
      this.disabled() ? 'is-disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
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
