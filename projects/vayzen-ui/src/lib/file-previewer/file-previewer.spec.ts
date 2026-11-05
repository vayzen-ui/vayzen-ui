import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VZ_FILE_PREVIEWER_IMPORTS, VzFilePreviewerComponent, VzPreviewFile } from './index';

@Component({
  standalone: true,
  imports: [VZ_FILE_PREVIEWER_IMPORTS],
  template: `
    <vz-file-previewer
      [files]="files()"
      [allowDelete]="allowDelete()"
      [showTechnicalInfo]="showTechnicalInfo()"
      [theme]="theme()"
      [dark]="dark()"
      (fileDeleted)="onFileDeleted($event)"
      (fileViewed)="onFileViewed($event)"
    />
  `,
})
class TestHostComponent {
  files = signal<VzPreviewFile[]>([
    { name: 'documento-guia.pdf', size: 1048576, type: 'application/pdf' },
    { name: 'captura-pantalla.png', size: 524288, type: 'image/png' },
    { name: 'reporte-anual.xlsx', size: 204800, type: 'application/vnd.ms-excel' },
  ]);
  allowDelete = signal(true);
  showTechnicalInfo = signal(true);
  theme = signal<any>(undefined);
  dark = signal(false);

  deletedIndex: number | null = null;
  viewedFile: VzPreviewFile | null = null;

  onFileDeleted(index: number): void {
    this.deletedIndex = index;
  }

  onFileViewed(file: VzPreviewFile): void {
    this.viewedFile = file;
  }
}

describe('VzFilePreviewerComponent', () => {
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
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  it('debe renderizar los 3 archivos en la lista con sus nombres y tamaños formateados', () => {
    const items = fixture.nativeElement.querySelectorAll('.vz-file-item');
    expect(items.length).toBe(3);

    const names = fixture.nativeElement.querySelectorAll('.vz-file-item__name');
    expect(names[0].textContent).toContain('documento-guia.pdf');
    expect(names[1].textContent).toContain('captura-pantalla.png');
    expect(names[2].textContent).toContain('reporte-anual.xlsx');

    const sizes = fixture.nativeElement.querySelectorAll('.vz-file-item__size');
    expect(sizes[0].textContent).toContain('1 MB');
    expect(sizes[1].textContent).toContain('512 KB');
  });

  it('debe asignar las clases semánticas de badge de tipo (pdf, image, excel)', () => {
    const badges = fixture.nativeElement.querySelectorAll('.vz-file-item__icon-badge');
    expect(badges[0].classList.contains('vz-file-item__icon-badge--pdf')).toBe(true);
    expect(badges[1].classList.contains('vz-file-item__icon-badge--image')).toBe(true);
    expect(badges[2].classList.contains('vz-file-item__icon-badge--excel')).toBe(true);
  });

  it('debe emitir fileDeleted cuando se hace clic en el botón de eliminar', () => {
    const deleteBtns = fixture.nativeElement.querySelectorAll('.vz-file-item__btn--delete');
    expect(deleteBtns.length).toBe(3);

    deleteBtns[1].click();
    fixture.detectChanges();

    expect(host.deletedIndex).toBe(1);
  });

  it('debe abrir el modal de previsualización al hacer clic en el botón de ver', () => {
    const viewBtns = fixture.nativeElement.querySelectorAll('.vz-file-item__btn--view');
    viewBtns[0].click();
    fixture.detectChanges();

    expect(host.viewedFile).not.toBeNull();
    expect(host.viewedFile?.name).toBe('documento-guia.pdf');

    const modalDialog = fixture.nativeElement.querySelector('.vz-modal__dialog');
    expect(modalDialog).not.toBeNull();
  });

  it('debe activar el modo oscuro cuando theme="dark" o dark=true', () => {
    host.dark.set(true);
    fixture.detectChanges();

    const previewerEl = fixture.nativeElement.querySelector('vz-file-previewer');
    expect(previewerEl.getAttribute('data-theme')).toBe('dark');
    expect(previewerEl.classList.contains('is-dark')).toBe(true);
  });

  it('debe mostrar u ocultar la pestaña de Ficha Técnica según showTechnicalInfo', () => {
    // Abrir primer archivo
    const viewBtns = fixture.nativeElement.querySelectorAll('.vz-file-item__btn--view');
    viewBtns[0].click();
    fixture.detectChanges();

    let nav = fixture.nativeElement.querySelector('.vz-file-header__nav');
    expect(nav).not.toBeNull();

    // Desactivar showTechnicalInfo
    host.showTechnicalInfo.set(false);
    fixture.detectChanges();

    nav = fixture.nativeElement.querySelector('.vz-file-header__nav');
    expect(nav).toBeNull();
  });

  it('debe ejecutar printCurrent sin lanzar excepciones al imprimir un archivo abierto', () => {
    // Abrir primer archivo (PDF)
    const viewBtns = fixture.nativeElement.querySelectorAll('.vz-file-item__btn--view');
    viewBtns[0].click();
    fixture.detectChanges();

    const previewerComp = fixture.debugElement.children[0].componentInstance as VzFilePreviewerComponent;
    expect(() => previewerComp.printCurrent()).not.toThrow();
  });
});
