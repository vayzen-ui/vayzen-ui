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
  VzMultiSelectOption,
  VzMultiSelectSize,
  VzMultiSelectTheme,
  VzMultiSelectVariant,
} from './multi-select.types';
import {
  VzMultiSelectOptionDirective,
  VzMultiSelectTriggerDirective,
} from './multi-select.directive';

@Component({
  selector: 'vz-multi-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './multi-select.component.html',
  styleUrl: './multi-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VzMultiSelectComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => VzMultiSelectComponent),
      multi: true,
    },
  ],
  host: {
    '[attr.data-vz-theme]': 'resolvedTheme()',
    '[class.vz-multi-select-host--dark]': 'isDark()',
    '[class.is-disabled]': 'isDisabled()',
    '[class.is-open]': 'isOpen()',
    '[class.is-invalid]': 'isInvalid()',
  },
})
export class VzMultiSelectComponent<T = any>
  implements OnInit, OnDestroy, ControlValueAccessor, Validator
{
  private readonly documentRef = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostElement = inject(ElementRef<HTMLElement>);
  private readonly cdr = inject(ChangeDetectorRef);

  // ───────────────────────── Inputs ─────────────────────────
  readonly options = input<VzMultiSelectOption<T>[]>([]);
  readonly icon = input<string>('');
  readonly placeholder = input<string>('Seleccionar opciones...');
  readonly searchPlaceholder = input<string>('Buscar...');
  readonly searchable = input<boolean, unknown>(true, { transform: booleanAttribute });
  readonly showSelectAll = input<boolean, unknown>(true, { transform: booleanAttribute });
  readonly selectAllText = input<string>('Seleccionar todos');
  readonly maxSelectedDisplay = input<number>(3);
  readonly clearable = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly disabled = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly loading = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly required = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly size = input<VzMultiSelectSize>('md');
  readonly variant = input<VzMultiSelectVariant>('outline');
  readonly fixedDropdown = input<boolean | null>(null);

  // ───────────────────────── Tema Nativo ─────────────────────────
  readonly theme = input<VzMultiSelectTheme | undefined>(undefined);
  readonly dark = input<boolean, unknown>(false, { transform: booleanAttribute });

  // ───────────────────────── Outputs ─────────────────────────
  readonly selectionChange = output<T[]>();
  readonly opened = output<void>();
  readonly closed = output<void>();

  // ───────────────────────── Slots ─────────────────────────
  protected readonly optionTemplate = contentChild(VzMultiSelectOptionDirective);
  protected readonly triggerTemplate = contentChild(VzMultiSelectTriggerDirective);

  // ───────────────────────── Element Queries ─────────────────────────
  readonly searchInputElement = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  readonly dropdownPanelElement = viewChild<ElementRef<HTMLElement>>('dropdownPanel');
  readonly triggerElement = viewChild<ElementRef<HTMLElement>>('triggerEl');

  // ───────────────────────── Estado interno ─────────────────────────
  protected readonly selectedValues = signal<T[]>([]);
  protected readonly searchText = signal<string>('');
  protected readonly isOpen = signal<boolean>(false);
  protected readonly focusedIndex = signal<number>(-1);
  protected readonly opensAbove = signal<boolean>(false);
  protected readonly touched = signal<boolean>(false);
  private readonly disabledByForm = signal<boolean>(false);

  // Callbacks de ControlValueAccessor
  private onChange: (value: T[]) => void = () => {};
  private onTouched: () => void = () => {};

  // ───────────────────────── Derivados ─────────────────────────
  protected readonly resolvedTheme = computed<VzMultiSelectTheme | null>(() =>
    this.dark() ? 'dark' : (this.theme() ?? null),
  );
  protected readonly isDark = computed(() => this.resolvedTheme() === 'dark');

  protected readonly isDisabled = computed(
    () => this.disabled() || this.disabledByForm() || this.loading(),
  );

  protected readonly hasSelection = computed(() => this.selectedValues().length > 0);

  protected readonly isInvalid = computed(
    () => this.touched() && this.required() && !this.hasSelection(),
  );

  protected readonly selectedOptions = computed<VzMultiSelectOption<T>[]>(() => {
    const vals = this.selectedValues();
    return this.options().filter((opt) => vals.some((v) => this.idsMatch(v, opt.id)));
  });

  protected readonly visibleChips = computed(() => {
    const all = this.selectedOptions();
    const max = this.maxSelectedDisplay();
    return all.slice(0, max);
  });

  protected readonly extraCount = computed(() => {
    const all = this.selectedOptions().length;
    const max = this.maxSelectedDisplay();
    return all > max ? all - max : 0;
  });

  protected readonly filteredOptions = computed<VzMultiSelectOption<T>[]>(() => {
    const query = this.normalize(this.searchText());
    const opts = this.options();
    if (!query) return opts;
    return opts.filter((opt) => {
      const desc = this.normalize(opt.descripcion ?? opt.label ?? '');
      const sub = this.normalize(opt.subtitle ?? '');
      return desc.includes(query) || sub.includes(query);
    });
  });

  protected readonly allSelected = computed(() => {
    const selectable = this.options().filter((o) => o.activo !== false && o.disabled !== true);
    if (selectable.length === 0) return false;
    const current = this.selectedValues();
    return selectable.every((o) => current.some((v) => this.idsMatch(v, o.id)));
  });

  protected readonly someSelected = computed(() => {
    const count = this.selectedValues().length;
    return count > 0 && !this.allSelected();
  });

  ngOnInit(): void {
    this.registerOutsideClickListener();
  }

  ngOnDestroy(): void {}

  // ───────────────────────── ControlValueAccessor & Validator ─────────────────────────
  writeValue(value: T[] | null): void {
    this.selectedValues.set(Array.isArray(value) ? value : []);
  }

  registerOnChange(fn: (val: T[]) => void): void {
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
      this.opensAbove.set(spaceBelow < 280 && rect.top > spaceBelow);
    }

    this.isOpen.set(true);
    this.focusedIndex.set(-1);
    this.opened.emit();
    this.cdr.markForCheck();

    if (this.searchable()) {
      setTimeout(() => {
        this.searchInputElement()?.nativeElement?.focus({ preventScroll: true });
      }, 0);
    }
  }

  closeDropdown(): void {
    if (!this.isOpen()) return;

    this.isOpen.set(false);
    this.opensAbove.set(false);
    this.searchText.set('');
    this.focusedIndex.set(-1);
    this.markAsTouched();
    this.closed.emit();
    this.cdr.markForCheck();
  }

  toggleOption(option: VzMultiSelectOption<T>, event?: Event): void {
    if (option.activo === false || option.disabled === true) return;
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const current = [...this.selectedValues()];
    const index = current.findIndex((val) => this.idsMatch(val, option.id));

    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(option.id);
    }

    this.selectedValues.set(current);
    this.onChange(current);
    this.markAsTouched();
    this.selectionChange.emit(current);
  }

  removeChip(id: T, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    const current = this.selectedValues().filter((v) => !this.idsMatch(v, id));
    this.selectedValues.set(current);
    this.onChange(current);
    this.markAsTouched();
    this.selectionChange.emit(current);
  }

  toggleSelectAll(): void {
    const selectable = this.options().filter((o) => o.activo !== false && o.disabled !== true);
    if (this.allSelected()) {
      this.selectedValues.set([]);
      this.onChange([]);
      this.selectionChange.emit([]);
    } else {
      const allIds = selectable.map((o) => o.id);
      this.selectedValues.set(allIds);
      this.onChange(allIds);
      this.selectionChange.emit(allIds);
    }
    this.markAsTouched();
  }

  clearAll(event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.selectedValues.set([]);
    this.onChange([]);
    this.markAsTouched();
    this.selectionChange.emit([]);
  }

  onSearchInput(event: Event): void {
    this.searchText.set((event.target as HTMLInputElement).value);
  }

  clearSearch(event?: Event): void {
    if (event) event.stopPropagation();
    this.searchText.set('');
    this.searchInputElement()?.nativeElement?.focus({ preventScroll: true });
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
    const opts = this.filteredOptions();
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
        event.preventDefault();
        const current = this.focusedIndex();
        if (current >= 0 && current < count) {
          this.toggleOption(opts[current]);
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
    return this.selectedValues().some((val) => this.idsMatch(val, id));
  }

  protected optionTrackBy(index: number, option: VzMultiSelectOption<T>): any {
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
    const items = panel.querySelectorAll<HTMLElement>('.vz-multi-select__option');
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

  private normalize(str: string): string {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }
}
