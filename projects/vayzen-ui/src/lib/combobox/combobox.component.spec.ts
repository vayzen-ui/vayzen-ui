import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VzComboboxComponent } from './combobox.component';
import { VzComboboxOption } from './combobox.types';

describe('VzComboboxComponent', () => {
  let component: VzComboboxComponent;
  let fixture: ComponentFixture<VzComboboxComponent>;

  const MOCK_OPTIONS: VzComboboxOption<number>[] = [
    { id: 1, descripcion: 'México', subtitle: 'América del Norte', badge: 'Activo', badgeVariant: 'success' },
    { id: 2, descripcion: 'Colombia', subtitle: 'América del Sur' },
    { id: 3, descripcion: 'España', subtitle: 'Europa', activo: false },
    { id: 4, descripcion: 'Argentina', subtitle: 'América del Sur' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VzComboboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VzComboboxComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', MOCK_OPTIONS);
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar el placeholder por defecto si no hay valor seleccionado', () => {
    fixture.componentRef.setInput('placeholder', 'Elige un país...');
    fixture.detectChanges();

    const triggerText = fixture.nativeElement.querySelector('.vz-combobox__label');
    expect(triggerText.textContent.trim()).toBe('Elige un país...');
  });

  it('debe abrir y cerrar el dropdown al llamar a toggleDropdown()', () => {
    expect(fixture.nativeElement.querySelector('.vz-combobox__dropdown')).toBeNull();

    component.toggleDropdown();
    fixture.detectChanges();

    expect(component['isOpen']()).toBe(true);

    component.toggleDropdown();
    fixture.detectChanges();

    expect(component['isOpen']()).toBe(false);
  });

  it('no debe abrir el dropdown si el componente está deshabilitado', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    component.toggleDropdown();
    fixture.detectChanges();

    expect(component['isOpen']()).toBe(false);
  });

  it('debe filtrar las opciones localmente según el texto de búsqueda', () => {
    component['searchText'].set('col');
    fixture.detectChanges();

    const filtradas = component['filteredOptions']();
    expect(filtradas.length).toBe(1);
    expect(filtradas[0].descripcion).toBe('Colombia');
  });

  it('debe seleccionar una opción activa y emitir selectionChange', () => {
    let emittedValue: any = null;
    component.selectionChange.subscribe((val) => (emittedValue = val));

    component.selectOption(MOCK_OPTIONS[1]); // Colombia (id: 2)
    fixture.detectChanges();

    expect(component['selectedValue']()).toBe(2);
    expect(emittedValue).toBe(2);
    expect(component['displayText']()).toBe('Colombia');
  });

  it('no debe seleccionar una opción inactiva', () => {
    component.selectOption(MOCK_OPTIONS[2]); // España (activo: false)
    fixture.detectChanges();

    expect(component['selectedValue']()).toBeNull();
  });

  it('debe limpiar la selección al llamar a clearSelection()', () => {
    component.selectOption(MOCK_OPTIONS[0]);
    expect(component['hasSelection']()).toBe(true);

    component.clearSelection();
    fixture.detectChanges();

    expect(component['hasSelection']()).toBe(false);
    expect(component['selectedValue']()).toBeNull();
  });

  it('soporta ControlValueAccessor con writeValue', () => {
    component.writeValue(4); // Argentina
    fixture.detectChanges();

    expect(component['selectedValue']()).toBe(4);
    expect(component['displayText']()).toBe('Argentina');
  });

  it('soporta Modo Oscuro nativo con theme="dark" y [dark]="true"', () => {
    fixture.componentRef.setInput('theme', 'dark');
    fixture.detectChanges();

    expect(fixture.nativeElement.getAttribute('data-vz-theme')).toBe('dark');
    expect(fixture.nativeElement.classList.contains('vz-combobox-host--dark')).toBe(true);

    fixture.componentRef.setInput('theme', 'light');
    fixture.componentRef.setInput('dark', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.classList.contains('vz-combobox-host--dark')).toBe(true);
  });
});

