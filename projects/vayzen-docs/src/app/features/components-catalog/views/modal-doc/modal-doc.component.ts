import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { DOC_PAGE_SHARED_COMPONENTS, DocTocItem } from '../../../../shared/components/doc-page';

@Component({
  selector: 'app-modal-doc',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ...VZ_MODAL_IMPORTS,
    ...VZ_FILE_PREVIEWER_IMPORTS,
    VzButtonComponent,
    VzComboboxComponent,
    CodeBlockComponent,
    ...DOC_PAGE_SHARED_COMPONENTS,
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
  
  // ── Tabla de Contenidos (TOC) ──
  protected readonly modalToc: DocTocItem[] = [
    { id: 'modal-basico', label: '1. Modal Básico Minimalista' },
    { id: 'modal-pro', label: '2. Modal Pro Empresarial (Slots)' },
    { id: 'posiciones-tamanos', label: '3. Posiciones y Tallas (Drawers)' },
    { id: 'previsualizador-archivos', label: '4. Previsualizador de Archivos' },
    { id: 'modo-oscuro', label: '5. Modo Oscuro & Tokens' },
    { id: 'api-reference', label: '6. Referencia de API' },
  ];

  // ── Filas de Referencia de API ──
  protected readonly modalInputRows: string[][] = [
    ['open', 'boolean (ModelSignal)', 'false', 'Estado reactivo de apertura bidireccional ([(open)]="miEstado").'],
    ['title', 'string', "''", 'Título principal mostrado en la cabecera automática.'],
    ['subtitle', 'string', "''", 'Subtítulo descriptivo secundario debajo del título.'],
    ['size', "'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'fullscreen' | 'custom'", "'md'", 'Escala dimensional de anchura máxima del diálogo.'],
    ['position', "'center' | 'top' | 'bottom' | 'left' | 'right'", "'center'", 'Orientación espacial del diálogo en el viewport (Drawers, Bottom Sheet o Centro).'],
    ['customWidth', 'string', 'undefined', 'Ancho CSS personalizado cuando size="custom" (ej. "880px").'],
    ['customMaxWidth', 'string', 'undefined', 'Max-width CSS personalizado cuando size="custom".'],
    ['scrollable', 'boolean', 'true', 'Habilita el scrollbar interno estilizado en el cuerpo del diálogo.'],
    ['flush', 'boolean', 'false', 'Elimina el padding interno del cuerpo para incrustar tablas o visores borde a borde.'],
    ['closable', 'boolean', 'true', 'Muestra el botón de cerrar (✕) en la cabecera automática.'],
    ['closeOnBackdrop', 'boolean', 'true', 'Cierra el modal al hacer clic en el telón de fondo.'],
    ['backdropBlur', 'boolean', 'true', 'Aplica desenfoque de cristal (glassmorphism) al telón de fondo.'],
    ['fullscreenToggle', 'boolean', 'false', 'Muestra un botón en la cabecera para alternar pantalla completa.'],
    ['allowDropdownOverflow', 'boolean', 'false', 'Permite que menús desplegables (combobox, datepicker) floten sin recorte.'],
    ['staticBackdrop', 'boolean', 'false', 'Si es true, no cierra al hacer clic afuera y produce una animación sutil de rebote.'],
    ['theme', "'light' | 'dark' | 'auto'", 'undefined', 'Fuerza el Modo Claro u Oscuro nativo de fábrica sobre el modal.'],
    ['dark', 'boolean', 'false', 'Atributo booleano de conveniencia para modo oscuro ([dark]="true").'],
  ];

  protected readonly modalOutputRows: string[][] = [
    ['openChange', 'boolean', 'Emite cuando el estado de apertura cambia (soporte bidireccional para [(open)]).'],
    ['closed', 'void', 'Emite cuando el modal se cierra por cualquier vía (botón X, backdrop o tecla Esc).'],
  ];

  protected readonly modalDirectiveRows: string[][] = [
    ['VzModalHeaderDirective', '[vzModalHeader]', 'Reemplaza completamente la cabecera del modal por un diseño a medida.'],
    ['VzModalTitleDirective', '[vzModalTitle]', 'Proyecta un título HTML enriquecido en la cabecera por defecto.'],
    ['VzModalBodyDirective', '[vzModalBody]', 'Proyecta el contenido principal o formulario del cuerpo del modal.'],
    ['VzModalActionsDirective', '[vzModalActions]', 'Proyecta el grupo de botones de acción en el pie del modal.'],
    ['VzModalFooterDirective', '[vzModalFooter]', 'Reemplaza completamente el pie del modal.'],
  ];

  protected readonly previewerInputRows: string[][] = [
    ['files', '(File | VzPreviewFile)[]', '[]', 'Arreglo de archivos nativos o remotos (PDF, imágenes, Word, Excel, etc.).'],
    ['showTechnicalInfo', 'boolean', 'true', 'Configurable: Muestra u oculta la pestaña de Ficha Técnica con metadatos de auditoría.'],
    ['showList', 'boolean', 'true', 'Muestra la lista de tarjetas de archivos o solo el modal de previsualización.'],
    ['allowDelete', 'boolean', 'true', 'Muestra el botón de eliminar y emite (fileDeleted) con el índice.'],
    ['allowDownload', 'boolean', 'true', 'Habilita el botón de descarga en la cabecera del visor y en los items.'],
    ['allowPrint', 'boolean', 'true', 'Habilita el botón de impresión directa nativa en el visor multimedia.'],
    ['allowFullscreen', 'boolean', 'true', 'Habilita el botón de alternar pantalla completa en la cabecera del visor.'],
    ['maxFiles', 'number | undefined', 'undefined', 'Límite recomendado de archivos; muestra alerta ámbar cuando se supera.'],
    ['emptyMessage', 'string', "'No hay archivos cargados'", 'Texto del estado vacío cuando no hay archivos adjuntos.'],
    ['theme', "'light' | 'dark' | 'auto'", 'undefined', 'Modo Claro u Oscuro nativo de fábrica para todo el componente y su visor.'],
    ['dark', 'boolean', 'false', 'Atributo booleano de activación de tema oscuro.'],
  ];

  protected readonly previewerOutputRows: string[][] = [
    ['fileDeleted', 'number', 'Emite el índice numérico del archivo eliminado de la lista.'],
    ['fileViewed', 'VzPreviewFile', 'Emite el objeto del archivo abierto para previsualización multimedia.'],
    ['fileDownloaded', 'VzPreviewFile', 'Emite el archivo cuando el usuario acciona la descarga.'],
  ];

  protected readonly modalTokenRows: string[][] = [
    ['--vz-modal-bg', '#ffffff', 'Color de fondo de la superficie del diálogo modal.'],
    ['--vz-modal-radius', '16px', 'Radio de curvatura de las esquinas del modal.'],
    ['--vz-modal-shadow', '0 25px 50px -12px rgba(15, 23, 42, 0.25)', 'Sombra de elevación perimetral del diálogo.'],
    ['--vz-modal-border', '#e2e8f0', 'Color del borde del diálogo y líneas divisorias de cabecera y pie.'],
    ['--vz-modal-header-bg', 'transparent', 'Fondo específico de la sección de cabecera.'],
    ['--vz-modal-title-color', '#0f172a', 'Color tipográfico del título institucional del diálogo.'],
    ['--vz-modal-overlay', 'rgba(15, 23, 42, 0.65)', 'Tinte y opacidad del telón de fondo (backdrop).'],
    ['--vz-modal-blur', '4px', 'Nivel de desenfoque de cristal (glassmorphism) sobre la vista subyacente.'],
  ];

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
