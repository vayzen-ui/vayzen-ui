import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  booleanAttribute,
  computed,
  contentChild,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  VzModalActionsDirective,
  VzModalBodyDirective,
  VzModalFooterDirective,
  VzModalHeaderDirective,
  VzModalTitleDirective,
} from './modal.directives';
import { VzModalPosition, VzModalSize, VzModalTheme } from './modal.types';

@Component({
  selector: 'vz-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-open]': 'open()',
    '[class.is-dark]': 'isDarkActive()',
    '[attr.data-theme]': 'effectiveTheme()',
  },
})
export class VzModalComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly el = inject(ElementRef<HTMLElement>);

  // ── Two-way model de estado de apertura ──
  readonly open = model<boolean>(false);

  // ── Inputs de Identificación y Textos ──
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly icon = input<string>('');

  // ── Dimensiones y Posicionamiento ──
  readonly size = input<VzModalSize>('md');
  readonly position = input<VzModalPosition>('center');
  readonly customWidth = input<string | undefined>(undefined);
  readonly customMaxWidth = input<string | undefined>(undefined);

  // ── Comportamientos y Accesibilidad ──
  readonly scrollable = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly allowDropdownOverflow = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly flush = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly closable = input<boolean, unknown>(true, { transform: booleanAttribute });
  readonly closeOnBackdrop = input<boolean, unknown>(true, { transform: booleanAttribute });
  readonly staticBackdrop = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly closeOnEscape = input<boolean, unknown>(true, { transform: booleanAttribute });
  readonly fullscreenToggle = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly backdrop = input<boolean, unknown>(true, { transform: booleanAttribute });
  readonly backdropBlur = input<boolean, unknown>(true, { transform: booleanAttribute });

  // ── Modo Oscuro Nativo ──
  readonly theme = input<VzModalTheme | undefined>(undefined);
  readonly dark = input<boolean, unknown>(false, { transform: booleanAttribute });

  // ── Outputs de Eventos ──
  readonly opened = output<void>();
  readonly closed = output<void>();

  // ── Slots / Directivas Personalizadas (Nivel 2) ──
  readonly customHeader = contentChild(VzModalHeaderDirective);
  readonly customTitle = contentChild(VzModalTitleDirective);
  readonly customBody = contentChild(VzModalBodyDirective);
  readonly customFooter = contentChild(VzModalFooterDirective);
  readonly customActions = contentChild(VzModalActionsDirective);

  // ── Estado interno reactivo ──
  readonly isFullscreen = signal<boolean>(false);
  readonly isShaking = signal<boolean>(false);

  private originalBodyOverflow = '';
  private originalBodyPaddingRight = '';
  private scrollbarWidth = 0;
  private shakeTimeout: any = null;

  // ── Computados ──
  readonly effectiveTheme = computed<'light' | 'dark' | undefined>(() => {
    if (this.dark()) return 'dark';
    const t = this.theme();
    if (t === 'dark' || t === 'light') return t;
    return undefined;
  });

  readonly isDarkActive = computed<boolean>(() => {
    return this.dark() || this.theme() === 'dark';
  });

  readonly effectiveSize = computed<VzModalSize>(() => {
    if (this.isFullscreen()) return 'fullscreen';
    return this.size();
  });

  readonly dialogClasses = computed<Record<string, boolean>>(() => {
    const sizeVal = this.effectiveSize();
    const posVal = this.position();
    return {
      'vz-modal__dialog': true,
      [`vz-modal__dialog--size-${sizeVal}`]: true,
      [`vz-modal__dialog--pos-${posVal}`]: true,
      'vz-modal__dialog--scrollable': this.scrollable(),
      'vz-modal__dialog--overflow-visible': this.allowDropdownOverflow(),
      'vz-modal__dialog--shake': this.isShaking(),
    };
  });

  readonly dialogStyles = computed<Record<string, string> | null>(() => {
    if (this.effectiveSize() !== 'custom') {
      return null;
    }
    const styles: Record<string, string> = {};
    const width = this.customWidth();
    const maxWidth = this.customMaxWidth();
    if (width) styles['width'] = width;
    if (maxWidth) styles['max-width'] = maxWidth;
    return styles;
  });

  constructor() {
    // Sincronización del bloqueo de scroll con el ciclo de vida del modal
    effect(() => {
      const isOpen = this.open();
      untracked(() => {
        if (typeof document !== 'undefined') {
          if (isOpen) {
            this.lockBodyScroll();
            this.opened.emit();
          } else {
            this.unlockBodyScroll();
            this.isFullscreen.set(false);
            this.closed.emit();
          }
        }
      });
    });

    this.destroyRef.onDestroy(() => {
      this.unlockBodyScroll();
      if (this.shakeTimeout) {
        clearTimeout(this.shakeTimeout);
      }
    });
  }

  // ── Métodos Públicos de Control ──
  close(): void {
    if (!this.open()) return;
    this.open.set(false);
  }

  toggleFullscreen(event?: Event): void {
    event?.stopPropagation();
    this.isFullscreen.update((v) => !v);
  }

  onBackdropClick(): void {
    if (this.staticBackdrop()) {
      this.triggerShake();
      return;
    }
    if (this.closeOnBackdrop()) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event?: Event): void {
    if (!this.open()) return;
    if (this.closeOnEscape()) {
      event?.preventDefault();
      this.close();
    } else if (this.staticBackdrop()) {
      this.triggerShake();
    }
  }

  private triggerShake(): void {
    this.isShaking.set(true);
    if (this.shakeTimeout) clearTimeout(this.shakeTimeout);
    this.shakeTimeout = setTimeout(() => {
      this.isShaking.set(false);
    }, 320);
  }

  private lockBodyScroll(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    this.originalBodyOverflow = document.body.style.overflow;
    this.originalBodyPaddingRight = document.body.style.paddingRight;

    this.scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (this.scrollbarWidth > 0) {
      document.body.style.paddingRight = `${this.scrollbarWidth}px`;
    }
  }

  private unlockBodyScroll(): void {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = this.originalBodyOverflow;
    document.body.style.paddingRight = this.originalBodyPaddingRight;
  }
}
