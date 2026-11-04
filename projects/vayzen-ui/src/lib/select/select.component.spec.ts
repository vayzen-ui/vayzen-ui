import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VzSelectComponent } from './select.component';
import { VzSelectOption } from './select.types';

describe('VzSelectComponent', () => {
  let component: VzSelectComponent;
  let fixture: ComponentFixture<VzSelectComponent>;

  const MOCK_OPTIONS: VzSelectOption<string>[] = [
    { id: 'ACT', descripcion: 'Activo', badge: 'Online', badgeVariant: 'success' },
    { id: 'PEN', descripcion: 'Pendiente', badge: 'Espera', badgeVariant: 'warning' },
    { id: 'INA', descripcion: 'Inactivo', activo: false },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VzSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VzSelectComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', MOCK_OPTIONS);
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe abrir y cerrar el dropdown al llamar a toggleDropdown()', () => {
    expect(component['isOpen']()).toBe(false);

    component.toggleDropdown();
    fixture.detectChanges();

    expect(component['isOpen']()).toBe(true);

    component.toggleDropdown();
    fixture.detectChanges();

    expect(component['isOpen']()).toBe(false);
  });

  it('debe seleccionar una opción activa y emitir selectionChange', () => {
    let emitted: any = null;
    component.selectionChange.subscribe((val) => (emitted = val));

    component.selectOption(MOCK_OPTIONS[0]); // Activo
    fixture.detectChanges();

    expect(component['selectedValue']()).toBe('ACT');
    expect(emitted).toBe('ACT');
    expect(component['displayText']()).toBe('Activo');
  });

  it('no debe seleccionar una opción inactiva', () => {
    component.selectOption(MOCK_OPTIONS[2]); // Inactivo
    fixture.detectChanges();

    expect(component['selectedValue']()).toBeNull();
  });

  it('soporta ControlValueAccessor con writeValue', () => {
    component.writeValue('PEN');
    fixture.detectChanges();

    expect(component['selectedValue']()).toBe('PEN');
    expect(component['displayText']()).toBe('Pendiente');
  });

  it('soporta Modo Oscuro nativo con theme="dark" y [dark]="true"', () => {
    fixture.componentRef.setInput('theme', 'dark');
    fixture.detectChanges();

    expect(fixture.nativeElement.getAttribute('data-vz-theme')).toBe('dark');
    expect(fixture.nativeElement.classList.contains('vz-select-host--dark')).toBe(true);

    fixture.componentRef.setInput('theme', 'light');
    fixture.componentRef.setInput('dark', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.classList.contains('vz-select-host--dark')).toBe(true);
  });
});

