import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VzMultiSelectComponent } from './multi-select.component';
import { VzMultiSelectOption } from './multi-select.types';

describe('VzMultiSelectComponent', () => {
  let component: VzMultiSelectComponent;
  let fixture: ComponentFixture<VzMultiSelectComponent>;

  const MOCK_OPTIONS: VzMultiSelectOption<string>[] = [
    { id: 'ANG', descripcion: 'Angular', badge: 'Frontend', badgeVariant: 'danger' },
    { id: 'REA', descripcion: 'React', badge: 'Frontend', badgeVariant: 'primary' },
    { id: 'VUE', descripcion: 'Vue', badge: 'Frontend', badgeVariant: 'success' },
    { id: 'SVE', descripcion: 'Svelte', badge: 'Frontend', activo: false },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VzMultiSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VzMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', MOCK_OPTIONS);
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe alternar selección múltiple de opciones activas', () => {
    let emitted: any = null;
    component.selectionChange.subscribe((val) => (emitted = val));

    component.toggleOption(MOCK_OPTIONS[0]); // Angular
    fixture.detectChanges();

    expect(component['selectedValues']()).toEqual(['ANG']);
    expect(emitted).toEqual(['ANG']);

    component.toggleOption(MOCK_OPTIONS[1]); // React
    fixture.detectChanges();

    expect(component['selectedValues']()).toEqual(['ANG', 'REA']);
    expect(emitted).toEqual(['ANG', 'REA']);

    // Quitar Angular
    component.toggleOption(MOCK_OPTIONS[0]);
    fixture.detectChanges();

    expect(component['selectedValues']()).toEqual(['REA']);
  });

  it('no debe seleccionar opciones inactivas', () => {
    component.toggleOption(MOCK_OPTIONS[3]); // Svelte (inactivo)
    fixture.detectChanges();

    expect(component['selectedValues']()).toEqual([]);
  });

  it('debe soportar toggleSelectAll para marcar todas las activas', () => {
    component.toggleSelectAll();
    fixture.detectChanges();

    expect(component['selectedValues']()).toEqual(['ANG', 'REA', 'VUE']);

    component.toggleSelectAll();
    fixture.detectChanges();

    expect(component['selectedValues']()).toEqual([]);
  });

  it('debe permitir quitar un chip individualmente', () => {
    component.writeValue(['ANG', 'REA']);
    fixture.detectChanges();

    const mockEvent = new MouseEvent('click');
    component.removeChip('ANG', mockEvent);
    fixture.detectChanges();

    expect(component['selectedValues']()).toEqual(['REA']);
  });

  it('soporta Modo Oscuro nativo con theme="dark" y [dark]="true"', () => {
    fixture.componentRef.setInput('theme', 'dark');
    fixture.detectChanges();

    expect(fixture.nativeElement.getAttribute('data-vz-theme')).toBe('dark');
    expect(fixture.nativeElement.classList.contains('vz-multi-select-host--dark')).toBe(true);

    fixture.componentRef.setInput('theme', 'light');
    fixture.componentRef.setInput('dark', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.classList.contains('vz-multi-select-host--dark')).toBe(true);
  });
});

