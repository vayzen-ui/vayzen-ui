import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  input,
  output,
  signal,
  computed,
  viewChild,
  contentChild,
  booleanAttribute,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import {
  VzSelectOption,
  VzSelectSize,
  VzSelectTheme,
  VzSelectVariant,
} from './select.types';
import {
  VzSelectOptionDirective,
  VzSelectTriggerDirective,
} from './select.directive';

@Component({
  selector: 'vz-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VzSelectComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => VzSelectComponent),
      multi: true,
    },
  ],
  host: {
    '[attr.data-vz-theme]': 'resolvedTheme()',
    '[class.vz-select-host--dark]': 'isDark()',
    '[class.is-disabled]': 'isDisabled()',
    '[class.is-open]': 'isOpen()',
    '[class.is-invalid]': 'isInvalid()',
  },
})
export class VzSelectComponent<T = any>
  implements OnInit, OnDestroy, ControlValueAccessor, Validator
{
  private readonly documentRef = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostElement = inject(ElementRef<HTMLElement>);
  private readonly cdr = inject(ChangeDetectorRef);

  // ───────────────────────── Inputs ─────────────────────────
  readonly options = input<VzSelectOption<T>[]>([]);
  readonly icon = input<string>('');
  readonly placeholder = input<string>('Seleccionar...');
  readonly clearable = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly disabled = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly loading = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly required = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly size = input<VzSelectSize>('md');
  readonly variant = input<VzSelectVariant>('outline');
  readonly fixedDropdown = input<boolean | null>(null);

  // ───────────────────────── Tema Nativo ─────────────────────────
  readonly theme = input<VzSelectTheme | undefined>(undefined);
  readonly dark = input<boolean, unknown>(false, { transform: booleanAttribute });

  // ───────────────────────── Outputs ─────────────────────────
  readonly selectionChange = output<T | null>();
  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly cleared = output<void>();

  // ───────────────────────── Slots ─────────────────────────
  protected readonly optionTemplate = contentChild(VzSelectOptionDirective);
  protected readonly triggerTemplate = contentChild(VzSelectTriggerDirective);

  // ───────────────────────── Element Queries ─────────────────────────
  readonly dropdownPanelElement = viewChild<ElementRef<HTMLElement>>('dropdownPanel');
  readonly triggerElement = viewChild<ElementRef<HTMLElement>>('triggerEl');

  // ───────────────────────── Estado interno ─────────────────────────
  protected readonly selectedValue = signal<T | null>(null);
  protected readonly isOpen = signal<boolean>(false);
  protected readonly focusedIndex = signal<number>(-1);
  protected readonly opensAbove = signal<boolean>(false);
  protected readonly touched = signal<boolean>(false);
  private readonly disabledByForm = signal<boolean>(false);

  // Callbacks de ControlValueAccessor
  private onChange: (value: T | null) => void = () => {};
  private onTouched: () => void = () => {};

  // ───────────────────────── Derivados ─────────────────────────
  protected readonly resolvedTheme = computed<VzSelectTheme | null>(() =>
    this.dark() ? 'dark' : (this.theme() ?? null),
  );
  protected readonly isDark = computed(() => this.resolvedTheme() === 'dark');

  protected readonly isDisabled = computed(
    () => this.disabled() || this.disabledByForm() || this.loading(),
  );

  protected readonly hasSelection = computed(
    () => this.selectedValue() !== null && this.selectedValue() !== undefined,
  );

  protected readonly isInvalid = computed(
    () => this.touched() && this.required() && !this.hasSelection(),
  );

  protected readonly selectedOption = computed<VzSelectOption<T> | null>(() => {
    const val = this.selectedValue();
    if (val === null || val === undefined) return null;
    return this.options().find((opt) => this.idsMatch(opt.id, val)) ?? null;
  });

  protected readonly displayText = computed<string>(() => {
    const sel = this.selectedOption();
    if (sel) {
      return sel.descripcion ?? sel.label ?? String(sel.id);
    }
    return this.placeholder();
  });

  ngOnInit(): void {
    this.registerOutsideClickListener();
  }

  ngOnDestroy(): void {}

  // ───────────────────────── ControlValueAccessor & Validator ─────────────────────────
  writeValue(value: T | null): void {
    this.selectedValue.set(value);
  }

  registerOnChange(fn: (val: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledByForm.set(isDisabled);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.required() && !this.hasSelection()) {
      return { required: true };
    }
    return null;
  }

  // ───────────────────────── Métodos Públicos ─────────────────────────
  toggleDropdown(): void {
    if (this.isDisabled()) return;

    if (this.isOpen()) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown(): void {
    if (this.isDisabled() || this.isOpen()) return;

    const triggerEl = this.triggerElement()?.nativeElement;
    if (triggerEl) {
      const rect = triggerEl.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      this.opensAbove.set(spaceBelow < 250 && rect.top > spaceBelow);
    }

    this.isOpen.set(true);
    this.focusedIndex.set(-1);
    this.opened.emit();
    this.cdr.markForCheck();
  }

  closeDropdown(): void {
    if (!this.isOpen()) return;

    this.isOpen.set(false);
    this.opensAbove.set(false);
    this.focusedIndex.set(-1);
    this.markAsTouched();
    this.closed.emit();
    this.cdr.markForCheck();
  }

  selectOption(option: VzSelectOption<T>, event?: Event): void {
    if (option.activo === false || option.disabled === true) return;
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.selectedValue.set(option.id);
    this.onChange(option.id);
    this.markAsTouched();
    this.selectionChange.emit(option.id);
    this.closeDropdown();
  }

  clearSelection(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.selectedValue.set(null);
    this.onChange(null);
    this.markAsTouched();
    this.selectionChange.emit(null);
    this.cleared.emit();
    this.closeDropdown();
  }

  // ───────────────────────── Navegación por Teclado ─────────────────────────
  onTriggerKeyDown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
        event.preventDefault();
        this.openDropdown();
        break;
      case 'Escape':
        this.closeDropdown();
        break;
    }
  }

  onDropdownKeyDown(event: KeyboardEvent): void {
    const opts = this.options();
    const count = opts.length;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (count > 0) {
          const next = (this.focusedIndex() + 1) % count;
          this.focusedIndex.set(next);
          this.scrollFocusedOptionIntoView(next);
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (count > 0) {
          const prev = this.focusedIndex() <= 0 ? count - 1 : this.focusedIndex() - 1;
          this.focusedIndex.set(prev);
          this.scrollFocusedOptionIntoView(prev);
        }
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        const current = this.focusedIndex();
        if (current >= 0 && current < count) {
          this.selectOption(opts[current]);
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        this.triggerElement()?.nativeElement?.focus();
        break;

      case 'Tab':
        this.closeDropdown();
        break;
    }
  }

  protected isOptionSelected(id: T): boolean {
    return this.idsMatch(id, this.selectedValue());
  }

  protected optionTrackBy(index: number, option: VzSelectOption<T>): any {
    return option.id ?? index;
  }

  // ───────────────────────── Métodos Privados ─────────────────────────
  private registerOutsideClickListener(): void {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!this.isOpen()) return;
      const target = event.target as Node;
      if (!target) return;
      if (this.hostElement.nativeElement.contains(target)) return;
      this.closeDropdown();
    };

    this.documentRef.addEventListener('mousedown', handleOutsideClick);
    this.destroyRef.onDestroy(() => {
      this.documentRef.removeEventListener('mousedown', handleOutsideClick);
    });
  }

  private scrollFocusedOptionIntoView(index: number): void {
    const panel = this.dropdownPanelElement()?.nativeElement;
    if (!panel) return;
    const items = panel.querySelectorAll<HTMLElement>('.vz-select__option');
    const target = items[index];
    if (target) {
      target.scrollIntoView({ block: 'nearest' });
    }
  }

  private markAsTouched(): void {
    if (!this.touched()) {
      this.touched.set(true);
      this.onTouched();
    }
  }

  private idsMatch(a: any, b: any): boolean {
    if (a === b) return true;
    if (a === null || a === undefined || b === null || b === undefined) return false;
    return String(a) === String(b);
  }
}

