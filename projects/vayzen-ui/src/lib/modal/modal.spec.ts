import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VZ_MODAL_IMPORTS, VzModalComponent } from './index';

@Component({
  standalone: true,
  imports: [VZ_MODAL_IMPORTS],
  template: `
    <vz-modal
      [(open)]="isOpen"
      [title]="title"
      [subtitle]="subtitle"
      [size]="size"
      [position]="position"
      [closable]="closable"
      [closeOnEscape]="closeOnEscape"
      [staticBackdrop]="staticBackdrop"
      [theme]="theme"
      [dark]="dark"
    >
      <div vzModalBody>
        <p class="test-content">Contenido del modal</p>
      </div>
      <div vzModalActions>
        <button class="test-action-btn">Confirmar</button>
      </div>
    </vz-modal>
  `,
})
class TestHostComponent {
  isOpen = signal(false);
  title = 'Título de Prueba';
  subtitle = 'Subtítulo descriptivo';
  size: any = 'md';
  position: any = 'center';
  closable = true;
  closeOnEscape = true;
  staticBackdrop = false;
  theme: any = undefined;
  dark = false;
}

describe('VzModalComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Asegurar restauración de scroll de body
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  it('no debe renderizar el contenido cuando open es false', () => {
    const dialogEl = fixture.nativeElement.querySelector('.vz-modal__dialog');
    expect(dialogEl).toBeNull();
  });

  it('debe renderizar el diálogo y bloquear el scroll del body cuando open es true', () => {
    host.isOpen.set(true);
    fixture.detectChanges();

    const dialogEl = fixture.nativeElement.querySelector('.vz-modal__dialog');
    expect(dialogEl).not.toBeNull();

    const titleEl = fixture.nativeElement.querySelector('.vz-modal__title');
    expect(titleEl.textContent).toContain('Título de Prueba');

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('debe aplicar la clase de tamaño correspondiente', () => {
    host.isOpen.set(true);
    host.size = 'lg';
    fixture.detectChanges();

    const dialogEl = fixture.nativeElement.querySelector('.vz-modal__dialog');
    expect(dialogEl.classList.contains('vz-modal__dialog--size-lg')).toBe(true);
  });

  it('debe cerrar el modal al hacer clic en el botón de cerrar', () => {
    host.isOpen.set(true);
    fixture.detectChanges();

    const closeBtn = fixture.nativeElement.querySelector('.vz-modal__btn-close');
    expect(closeBtn).not.toBeNull();

    closeBtn.click();
    fixture.detectChanges();

    expect(host.isOpen()).toBe(false);
    expect(document.body.style.overflow).toBe('');
  });

  it('debe respetar el cierre mediante tecla Escape', () => {
    host.isOpen.set(true);
    fixture.detectChanges();

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    fixture.detectChanges();

    expect(host.isOpen()).toBe(false);
  });

  it('no debe cerrar el modal en Escape si staticBackdrop es true', () => {
    host.isOpen.set(true);
    host.staticBackdrop = true;
    host.closeOnEscape = false;
    fixture.detectChanges();

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    fixture.detectChanges();

    expect(host.isOpen()).toBe(true);
  });

  it('debe proyectar el contenido mediante slots vzModalBody y vzModalActions', () => {
    host.isOpen.set(true);
    fixture.detectChanges();

    const contentEl = fixture.nativeElement.querySelector('.test-content');
    expect(contentEl).not.toBeNull();
    expect(contentEl.textContent).toContain('Contenido del modal');

    const actionBtn = fixture.nativeElement.querySelector('.test-action-btn');
    expect(actionBtn).not.toBeNull();
    expect(actionBtn.textContent).toContain('Confirmar');
  });

  it('debe activar el modo oscuro nativo cuando theme="dark" o dark=true', () => {
    host.isOpen.set(true);
    host.theme = 'dark';
    fixture.detectChanges();

    const modalComponentEl = fixture.nativeElement.querySelector('vz-modal');
    expect(modalComponentEl.getAttribute('data-theme')).toBe('dark');
    expect(modalComponentEl.classList.contains('is-dark')).toBe(true);
  });
});

