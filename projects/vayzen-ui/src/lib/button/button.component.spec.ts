import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VzButtonComponent } from './button.component';

describe('VzButtonComponent', () => {
  let component: VzButtonComponent;
  let fixture: ComponentFixture<VzButtonComponent>;
  let btnEl: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VzButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VzButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    btnEl = fixture.nativeElement.querySelector('button');
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
    expect(btnEl.classList.contains('vz-btn')).toBe(true);
  });

  it('debe emitir clicked al hacer click en estado normal', () => {
    let clicked = false;
    component.clicked.subscribe(() => (clicked = true));
    btnEl.click();
    expect(clicked).toBe(true);
  });

  it('no debe emitir clicked cuando disabled es true', () => {
    let clicked = false;
    component.clicked.subscribe(() => (clicked = true));
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    btnEl.click();
    expect(clicked).toBe(false);
    expect(btnEl.disabled).toBe(true);
  });

  it('no debe emitir clicked cuando loading es true y debe mostrar spinner', () => {
    let clicked = false;
    component.clicked.subscribe(() => (clicked = true));
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    btnEl.click();
    expect(clicked).toBe(false);
    expect(btnEl.classList.contains('is-loading')).toBe(true);
    const spinner = btnEl.querySelector('.vz-btn__spinner');
    expect(spinner).toBeTruthy();
  });

  it('debe aplicar clases de tamaño (sm, md, lg)', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();
    expect(btnEl.classList.contains('vz-btn--sm')).toBe(true);

    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(btnEl.classList.contains('vz-btn--lg')).toBe(true);
  });

  it('debe aplicar clases de variante (solid, soft, outline, ghost)', () => {
    fixture.componentRef.setInput('variant', 'soft');
    fixture.detectChanges();
    expect(btnEl.classList.contains('vz-btn--soft')).toBe(true);

    fixture.componentRef.setInput('variant', 'outline');
    fixture.detectChanges();
    expect(btnEl.classList.contains('vz-btn--outline')).toBe(true);
  });

  it('debe aplicar modificadores de píldora (pill) e icon-only', () => {
    fixture.componentRef.setInput('pill', true);
    fixture.componentRef.setInput('iconOnly', true);
    fixture.detectChanges();
    expect(btnEl.classList.contains('vz-btn--pill')).toBe(true);
    expect(btnEl.classList.contains('vz-btn--icon-only')).toBe(true);
  });

  it('debe activar modo oscuro nativo con [dark]="true"', () => {
    fixture.componentRef.setInput('dark', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('data-theme')).toBe('dark');
    expect(fixture.nativeElement.classList.contains('is-dark')).toBe(true);
  });

  it('debe mantener retrocompatibilidad con variant="primary"', () => {
    fixture.componentRef.setInput('variant', 'primary');
    fixture.detectChanges();
    expect(btnEl.classList.contains('vz-btn--solid')).toBe(true);
    expect(btnEl.classList.contains('vz-btn--color-primary')).toBe(true);
  });
});
