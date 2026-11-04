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
  effect,
  untracked,
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
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import {
  VzComboboxOption,
  VzComboboxSize,
  VzComboboxTheme,
  VzComboboxVariant,
} from './combobox.types';
import {
  VzComboboxOptionDirective,
  VzComboboxTriggerDirective,
} from './combobox.directive';

@Component({
  selector: 'vz-combobox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './combobox.component.html',
  styleUrl: './combobox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VzComboboxComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => VzComboboxComponent),
      multi: true,
    },
  ],
  host: {
    '[attr.data-vz-theme]': 'resolvedTheme()',
    '[class.vz-combobox-host--dark]': 'isDark()',
    '[class.is-disabled]': 'isDisabled()',
    '[class.is-open]': 'isOpen()',
    '[class.is-invalid]': 'isInvalid()',
  },
})
export class VzComboboxComponent<T = any>
  implements OnInit, OnDestroy, ControlValueAccessor, Validator
{
  private readonly documentRef = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostElement = inject(ElementRef<HTMLElement>);
  private readonly cdr = inject(ChangeDetectorRef);

  // ───────────────────────── Inputs ─────────────────────────
  readonly options = input<VzComboboxOption<T>[]>([]);
  readonly icon = input<string>('');
  readonly placeholder = input<string>('Seleccionar...');
  readonly searchPlaceholder = input<string>('Buscar...');
  readonly allOptionText = input<string>('Seleccionar...');
  readonly showAllOption = input<boolean, unknown>(true, { transform: booleanAttribute });
  readonly searchable = input<boolean, unknown>(true, { transform: booleanAttribute });
  readonly localSearch = input<boolean, unknown>(true, { transform: booleanAttribute });
  readonly clearable = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly disabled = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly loading = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly required = input<boolean, unknown>(false, { transform: booleanAttribute });
  readonly size = input<VzComboboxSize>('md');
  readonly variant = input<VzComboboxVariant>('outline');
  readonly fixedDropdown = input<boolean | null>(null);
  readonly searchDebounce = input<number>(300);

  // ───────────────────────── Tema Nativo ─────────────────────────
  readonly theme = input<VzComboboxTheme | undefined>(undefined);
  readonly dark = input<boolean, unknown>(false, { transform: booleanAttribute });

  // ───────────────────────── Outputs ─────────────────────────
  readonly selectionChange = output<T | null>();
  readonly searchChange = output<string>();
  readonly opened = output<void>();
  readonly closed = output<void>();
  readonly cleared = output<void>();

  // ───────────────────────── Slots ─────────────────────────
  protected readonly optionTemplate = contentChild(VzComboboxOptionDirective);
  protected readonly triggerTemplate = contentChild(VzComboboxTriggerDirective);

  // ───────────────────────── Element Queries ─────────────────────────
  readonly searchInputElement = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  readonly dropdownPanelElement = viewChild<ElementRef<HTMLElement>>('dropdownPanel');
  readonly triggerElement = viewChild<ElementRef<HTMLElement>>('triggerEl');

  // ───────────────────────── Estado interno ─────────────────────────
  protected readonly selectedValue = signal<T | null>(null);
  protected readonly searchText = signal<string>('');
  protected readonly isOpen = signal<boolean>(false);
  protected readonly focusedIndex = signal<number>(-1);
  protected readonly opensAbove = signal<boolean>(false);
  protected readonly touched = signal<boolean>(false);
  private readonly disabledByForm = signal<boolean>(false);

  private readonly searchSubject = new Subject<string>();

  // Callbacks de ControlValueAccessor
  private onChange: (value: T | null) => void = () => {};
  private onTouched: () => void = () => {};

  // ───────────────────────── Derivados ─────────────────────────
  protected readonly resolvedTheme = computed<VzComboboxTheme | null>(() =>
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

  protected readonly selectedOption = computed<VzComboboxOption<T> | null>(() => {
    const val = this.selectedValue();
    if (val === null || val === undefined) return null;
    return this.options().find((opt) => this.idsMatch(opt.id, val)) ?? null;
  });

  protected readonly displayText = computed<string>(() => {
    const sel = this.selectedOption();
    if (sel) {
      return sel.descripcion ?? sel.label ?? String(sel.id);
    }
    return this.placeholder() || this.allOptionText();
  });

  protected readonly filteredOptions = computed<VzComboboxOption<T>[]>(() => {
    const opts = this.options();
    if (!this.localSearch()) {
      return opts;
    }
    const query = this.normalize(this.searchText());
    if (!query) {
      return opts;
    }
    return opts.filter((opt) => {
      const desc = this.normalize(opt.descripcion ?? opt.label ?? '');
      const sub = this.normalize(opt.subtitle ?? '');
      const id = this.normalize(String(opt.id ?? ''));
      return desc.includes(query) || sub.includes(query) || id.includes(query);
    });
  });

  constructor() {
    // Sincronizar debounce de búsqueda
    effect(() => {
      const ms = this.searchDebounce();
      untracked(() => {
        // Inicializar subject con el nuevo debounce
      });
    });
  }

  ngOnInit(): void {
    this.initSearchPipeline();
    this.registerOutsideClickListener();
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

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

  // ───────────────────────── Interacción Pública y Eventos ─────────────────────────
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

  selectOption(option: VzComboboxOption<T>, event?: Event): void {
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

  onSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchText.set(val);
    this.searchSubject.next(val);
  }

  clearSearch(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.searchText.set('');
    this.searchSubject.next('');
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
          this.selectOption(opts[current]);
        } else if (this.showAllOption() && !this.searchText()) {
          this.clearSelection();
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

  protected optionTrackBy(index: number, option: VzComboboxOption<T>): any {
    return option.id ?? index;
  }

  // ───────────────────────── Métodos Privados y Portal ─────────────────────────
  private initSearchPipeline(): void {
    this.searchSubject
      .pipe(debounceTime(this.searchDebounce()), distinctUntilChanged())
      .subscribe((term) => {
        this.searchChange.emit(term);
      });
  }

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
    const items = panel.querySelectorAll<HTMLElement>('.vz-combobox__option');
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

