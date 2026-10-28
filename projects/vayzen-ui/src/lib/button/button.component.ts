import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type VzButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type VzButtonSize = 'sm' | 'md' | 'lg';
export type VzButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'vz-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VzButtonComponent {
  readonly variant = input<VzButtonVariant>('primary');
  readonly size = input<VzButtonSize>('md');
  readonly type = input<VzButtonType>('button');
  readonly disabled = input<boolean>(false);

  readonly clicked = output<MouseEvent>();

  protected readonly buttonClasses = computed(() => {
    return `vz-button vz-button--${this.variant()} vz-button--${this.size()}`;
  });

  protected handleClick(event: MouseEvent): void {
    if (!this.disabled()) {
      this.clicked.emit(event);
    }
  }
}

