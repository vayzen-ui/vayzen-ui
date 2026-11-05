import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  VZ_MODAL_IMPORTS,
  VZ_FILE_PREVIEWER_IMPORTS,
  VzButtonComponent,
  VzComboboxComponent,
  VzComboboxOption,
  VzModalPosition,
  VzModalSize,
  VzPreviewFile,
} from 'vayzen-ui';
import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';

@Component({
  selector: 'app-modal-doc',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ...VZ_MODAL_IMPORTS,
    ...VZ_FILE_PREVIEWER_IMPORTS,
    VzButtonComponent,
    VzComboboxComponent,
    CodeBlockComponent,
  ],
  templateUrl: './modal-doc.component.html',
  styleUrls: ['../../../../shared/styles/doc-page.css', './modal-doc.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalDocComponent {
  // ── Modo Oscuro / Claro de Previsualización ──
  protected readonly previewTheme = signal<'light' | 'dark'>('light');
  protected readonly showTechInfo = signal<boolean>(true);

  togglePreviewTheme(): void {
    this.previewTheme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  toggleTechInfo(): void {
    this.showTechInfo.update((v) => !v);
  }

  // ── Demo 1: Modal Básico Minimalista ──
  protected readonly isBasicOpen = signal<boolean>(false);

  // ── Demo 2: Modal Pro con Formulario, Slots, Dropdowns y Pantalla Completa ──
  protected readonly isFormOpen = signal<boolean>(false);
  protected readonly rolesDisponibles: VzComboboxOption<string>[] = [
    { id: 'admin', descripcion: 'Administrador de Sistema (TI)', badge: 'Nivel 1', badgeVariant: 'danger' },
    { id: 'auditor', descripcion: 'Auditor Financiero & Fiscal', badge: 'Verificado', badgeVariant: 'success' },
    { id: 'consultor', descripcion: 'Consultor Externo de Negocios', badge: 'Temporal', badgeVariant: 'warning' },
    { id: 'operador', descripcion: 'Operador de Logística y Almacén' },
  ];
  protected readonly rolSeleccionado = signal<string | null>('admin');

  // ── Demo 3: Posiciones y Dimensiones ──
  protected readonly isCustomModalOpen = signal<boolean>(false);
  protected readonly activeModalSize = signal<VzModalSize>('md');
  protected readonly activeModalPosition = signal<VzModalPosition>('center');
  protected readonly activeModalTitle = signal<string>('Modal Dinámico');

  abrirPosicion(pos: VzModalPosition, size: VzModalSize, title: string): void {
    this.activeModalPosition.set(pos);
    this.activeModalSize.set(size);
    this.activeModalTitle.set(title);
    this.isCustomModalOpen.set(true);
  }

  // ── Demo 4: Previsualizador de Archivos ──
  protected readonly sampleFiles: VzPreviewFile[] = [
    {
      name: 'politica-seguridad-informacion-2026.pdf',
      size: 2457600,
      type: 'application/pdf',
      badge: 'Oficial',
      url: '/docs/politica-seguridad-informacion-2026.pdf',
    },
    {
      name: 'arquitectura-nube-microservicios.png',
      size: 840500,
      type: 'image/png',
      badge: 'Diagrama',
      url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'resumen-ejecutivo-presupuesto.xlsx',
      size: 420000,
      type: 'application/vnd.ms-excel',
      badge: 'Finanzas',
    },
  ];

  // ── Snippets de Código ──
  protected readonly basicSnippet = `<!-- 1. Modal Básico Minimalista (Zero-Boilerplate) -->
<vz-button (clicked)="isBasicOpen.set(true)" color="danger" icon="trash">
  Eliminar Registro
</vz-button>

<vz-modal
  [(open)]="isBasicOpen"
  [theme]="previewTheme()"
  title="Confirmar Eliminación"
  subtitle="Esta acción es irreversible y retirará el elemento de la base de datos."
  icon="alert"
  size="sm"
>
  <div vzModalBody>
    <p>¿Estás seguro de que deseas eliminar permanentemente el folio <strong>#EXP-2026-994</strong>?</p>
  </div>

  <div vzModalActions>
    <vz-button variant="ghost" (clicked)="isBasicOpen.set(false)">Cancelar</vz-button>
    <vz-button color="danger" (clicked)="isBasicOpen.set(false)">Confirmar Eliminación</vz-button>
  </div>
</vz-modal>`;

  protected readonly formSlotsSnippet = `<!-- 2. Modal Pro Empresarial con Slots, Combobox sin recorte y Fullscreen -->
<vz-modal
  [(open)]="isFormOpen"
  [theme]="previewTheme()"
  title="Editar Credenciales de Acceso"
  subtitle="Gestión de roles empresariales con permisos de superusuario"
  icon="file"
  size="lg"
  [allowDropdownOverflow]="true"
  [fullscreenToggle]="true"
>
  <!-- Cuerpo proyectado a la medida -->
  <div vzModalBody class="demo-form-stack">
    <div class="demo-form-field">
      <label class="demo-form-label">Nombre Completo</label>
      <input type="text" class="demo-input" value="Lic. Alejandro Morales Valdés" />
    </div>

    <!-- Dropdown / Combobox flotando libremente sin recorte -->
    <div class="demo-form-field">
      <label class="demo-form-label">Rol Organizacional Asignado</label>
      <vz-combobox
        [options]="rolesDisponibles"
        [(ngModel)]="rolSeleccionado"
        placeholder="Selecciona un rol corporativo..."
      />
    </div>
  </div>

  <!-- Botones de Acción en el Pie -->
  <div vzModalActions>
    <vz-button variant="outline" (clicked)="isFormOpen.set(false)">Cancelar</vz-button>
    <vz-button color="primary" (clicked)="isFormOpen.set(false)">Guardar Cambios</vz-button>
  </div>
</vz-modal>`;
  protected readonly formSnippet = this.formSlotsSnippet;

  protected readonly positionsSnippet = `<!-- 3. Posicionamiento Espacial: Center, Top, Bottom, Left o Right -->
<vz-modal
  [(open)]="isOpen"
  [size]="'md'"
  [position]="'right'" 
  title="Panel Lateral de Configuración (Drawer)"
>
  <div vzModalBody>
    <!-- Contenido estilo Drawer lateral sin salir del estándar -->
  </div>
</vz-modal>`;

  protected readonly fileViewerSnippet = `<!-- 4. Previsualizador Multimedia de Archivos con Ficha Técnica Configurable -->
<vz-file-previewer
  [files]="sampleFiles"
  [showTechnicalInfo]="true"
  [allowDelete]="true"
  [allowDownload]="true"
  [allowFullscreen]="true"
  (fileDeleted)="onFileDeleted($event)"
  (fileViewed)="onFileViewed($event)"
/>`;
  protected readonly previewerSnippet = this.fileViewerSnippet;

  protected readonly tokensSnippet = `/* Sobrescritura de Tokens SCSS / Variables CSS */
:root {
  --vz-modal-bg: #ffffff;
  --vz-modal-radius: 14px;
  --vz-modal-backdrop-bg: rgba(15, 23, 42, 0.65);
  --vz-modal-header-bg: #f8fafc;
  --vz-modal-footer-bg: #f8fafc;
}

[data-theme='dark'] {
  --vz-modal-bg: #0f172a;
  --vz-modal-border: #1e293b;
  --vz-modal-header-bg: #0b1120;
  --vz-modal-footer-bg: #0b1120;
}`;
}
