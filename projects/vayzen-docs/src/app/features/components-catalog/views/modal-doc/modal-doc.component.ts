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
      url: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXSAvQ29udGVudHMgNCAwIFIgL1Jlc291cmNlcyA8PCAvRm9udCA8PCAvRjEgNSAwIFIgPj4gPj4gPj4KZW5kb2JqCjQgMCBvYmoKPDwgL0xlbmd0aCA0NTUwID4+CnN0cmVhbQoKcQolIEhlYWRlciB0b3AgYWNjZW50IGJhciAoUHJpbWFyeSBCbHVlKQowLjE0NSAwLjM4OCAwLjkyMSByZwowIDc3MCA2MTIgMjIgcmUgZgoKJSBTdWIgYmFyIChUZWFsIGFjY2VudCkKMC4wNjMgMC43MjUgMC41MDYgcmcKMCA3NjYgNjEyIDQgcmUgZgoKJSBJbnN0aXR1dGlvbmFsIExvZ28gQm94CjAuOTYgMC45NyAwLjk5IHJnCjAuOCAwLjg1IDAuOTIgUkcKMSB3CjQwIDY5MCA2MCA2MCByZSBiCgolIExvZ28gdGV4dApCVAovRjEgMTggVGYKMC4xNDUgMC4zODggMC45MjEgcmcKNTUgNzEyIFRkCihWWk4pIFRqCkVUCgolIEhlYWRlciBUaXRsZSAmIFN1YnRpdGxlCkJUCi9GMSAxMyBUZgowLjA2IDAuMDkgMC4xNiByZwoxMTUgNzM1IFRkCihHT0JJRVJOTyBDT1JQT1JBVElWTyBZIFNJU1RFTUFTIElOU1RJVFVDSU9OQUxFUyBWQVlaRU4pIFRqCi9GMSA4LjUgVGYKMC4zOSAwLjQ1IDAuNTUgcmcKMTE1IDcyMCBUZAooRElSRUNDSU9OIEdFTkVSQUwgREUgVEVDTk9MT0dJQVMgREUgTEEgSU5GT1JNQUNJT04gWSBDSUJFUlNFR1VSSURBRCkgVGoKMTE1IDcwNyBUZAooRm9saW8gT2ZpY2lhbDogVlpOLTIwMjYtUE9MLTA5ODItREYgIHwgIENsYXNpZmljYWNpb246IENPTkZJREVOQ0lBTCBBMSkgVGoKRVQKCiUgRGl2aWRlciBsaW5lCjAuODggMC45MSAwLjk1IFJHCjAuNzUgdwo0MCA2NzUgbSA1NzIgNjc1IGwgUwoKJSBEb2N1bWVudCBNYWluIFRpdGxlIEJhbm5lcgowLjk2IDAuOTcgMSByZwo0MCA2MjUgNTMyIDM4IHJlIGYKMC44IDAuODYgMC45OCBSRwowLjc1IHcKNDAgNjI1IDUzMiAzOCByZSBTCgpCVAovRjEgMTIgVGYKMC4xMSAwLjI4IDAuNzEgcmcKNTIgNjQ1IFRkCihQT0xJVElDQSBHRU5FUkFMIERFIFNFR1VSSURBRCBERSBMQSBJTkZPUk1BQ0lPTiBZIENJQkVSU0VHVVJJREFEKSBUagovRjEgOCBUZgowLjM1IDAuNDIgMC41NSByZwo1MiA2MzMgVGQKKE5vcm1hIFRlY25pY2EgSG9tb2xvZ2FkYSAyMDI2LTIwMzAgIHwgIFJlc29sdWNpb24gZGUgRGlyZWN0b3JpbyBOby4gRC0yMDI2LTQ0KSBUagpFVAoKJSBNZXRhZGF0YSBHcmlkIFRhYmxlCjAuOTggMC45OCAwLjk5IHJnCjQwIDU1MCA1MzIgNjAgcmUgZgowLjg4IDAuOTEgMC45NSBSRwowLjUgdwo0MCA1NTAgNTMyIDYwIHJlIFMKNDAgNTgwIG0gNTcyIDU4MCBsIFMKMTczIDU1MCBtIDE3MyA2MTAgbCBTCjMwNiA1NTAgbSAzMDYgNjEwIGwgUwo0MzkgNTUwIG0gNDM5IDYxMCBsIFMKCkJUCiUgUm93IDEKL0YxIDcgVGYKMC40NSAwLjUgMC42IHJnCjQ4IDU5OCBUZCAoT1JHQU5PIEVNSVNPUikgVGoKMTgxIDU5OCBUZCAoVklHRU5DSUEpIFRqCjMxNCA1OTggVGQgKEFNQklUTyBERSBBUExJQ0FDSU9OKSBUago0NDcgNTk4IFRkIChFU1RBVFVTKSBUagoKL0YxIDguNSBUZgowLjA4IDAuMTIgMC4yIHJnCjQ4IDU4NiBUZCAoQ29taXRlIGRlIFRJKSBUagoxODEgNTg2IFRkICgyMDI2IC0gMjAzMCkgVGoKMzE0IDU4NiBUZCAoTmFjaW9uYWwgJiBOdWJlKSBUagowLjA1IDAuNTkgMC40MSByZwo0NDcgNTg2IFRkIChBUFJPQkFETykgVGoKCiUgUm93IDIKL0YxIDcgVGYKMC40NSAwLjUgMC42IHJnCjQ4IDU2OCBUZCAoTUFSQ08gTk9STUFUSVZPKSBUagoxODEgNTY4IFRkIChBVURJVE9SIFJFU1BPTlNBQkxFKSBUagozMTQgNTY4IFRkIChOSVZFTCBERSBDUklUSUNJREFEKSBUago0NDcgNTY4IFRkIChVTFRJTUEgUkVWSVNJT04pIFRqCgovRjEgOC41IFRmCjAuMDggMC4xMiAwLjIgcmcKNDggNTU2IFRkIChJU08vSUVDIDI3MDAxOjIwMjIpIFRqCjE4MSA1NTYgVGQgKEluZy4gQS4gTW9yYWxlcykgVGoKMzE0IDU1NiBUZCAoVGllciA0IC0gTWF4aW1vKSBUago0NDcgNTU2IFRkIChOb3ZpZW1icmUgMjAyNikgVGoKRVQKCiUgU2VjdGlvbiAxCkJUCi9GMSAxMC41IFRmCjAuMTQ1IDAuMzg4IDAuOTIxIHJnCjQwIDUyMiBUZAooMS4gT0JKRVRJVk8gWSBBTENBTkNFIEVTVFJBVEVHSUNPKSBUagovRjEgOC41IFRmCjAuMiAwLjI1IDAuMzIgcmcKNDAgNTA2IFRkCihMYSBwcmVzZW50ZSBwb2xpdGljYSBlc3RhYmxlY2UgbG9zIGNvbnRyb2xlcyBvYmxpZ2F0b3Jpb3MgcGFyYSBzYWx2YWd1YXJkYXIgbGEgY29uZmlkZW5jaWFsaWRhZCwpIFRqCjQwIDQ5NCBUZAooaW50ZWdyaWRhZCB5IGRpc3BvbmliaWxpZGFkIGRlIGxvcyBhY3Rpdm9zIGRlIGluZm9ybWFjaW9uIGRlbCBlY29zaXN0ZW1hIFZheXplbiBVSSBlbiB0b2RhcyBzdXMpIFRqCjQwIDQ4MiBUZAoocGxhdGFmb3JtYXMgZGlnaXRhbGVzLCByZXBvc2l0b3Jpb3MsIG1pY3Jvc2VydmljaW9zIGRpc3RyaWJ1aWRvcyB5IGNlbnRyb3MgZGUgcHJvY2VzYW1pZW50byBkZSBkYXRvcy4pIFRqCkVUCgolIFNlY3Rpb24gMgpCVAovRjEgMTAuNSBUZgowLjE0NSAwLjM4OCAwLjkyMSByZwo0MCA0NTQgVGQKKDIuIENPTlRST0wgREUgQUNDRVNPUyBZIENSSVBUT0dSQUZJQSBBVkFOWkFEQSkgVGoKL0YxIDguNSBUZgowLjIgMC4yNSAwLjMyIHJnCjQwIDQzOCBUZAooVG9kbyBhY2Nlc28gYSBiYXNlcyBkZSBkYXRvcyBvIEFQSXMgZGUgbml2ZWwgZGUgcHJvZHVjY2lvbiByZXF1aWVyZSBhdXRlbnRpY2FjaW9uIG11bHRpZmFjdG9yIChNRkEpKSBUago0MCA0MjYgVGQKKHkgZmlybWEgZGlnaXRhbCBjcmlwdG9ncmFmaWNhIGNvbiBhbGdvcml0bW8gU0hBLTI1NiAvIEFFUy0yNTYtR0NNLiBRdWVkYSBleHByZXNhbWVudGUgcHJvaGliaWRvKSBUago0MCA0MTQgVGQKKGVsIGFsbWFjZW5hbWllbnRvIGRlIGNyZWRlbmNpYWxlcyBlbiB0ZXh0byBwbGFubyBvIGVuIGVudG9ybm9zIGxvY2FsZXMgc2luIGNpZnJhZG8gcG9yIGhhcmR3YXJlLikgVGoKRVQKCiUgU2VjdGlvbiAzCkJUCi9GMSAxMC41IFRmCjAuMTQ1IDAuMzg4IDAuOTIxIHJnCjQwIDM4NiBUZAooMy4gUkVHSVNUUk8gREUgQVVESVRPUklBIFkgTU9OSVRPUklaQUNJT04gRU4gVElFTVBPIFJFQUwpIFRqCi9GMSA4LjUgVGYKMC4yIDAuMjUgMC4zMiByZwo0MCAzNzAgVGQKKFRvZGFzIGxhcyB0cmFuc2FjY2lvbmVzIHNlcmFuIGF1ZGl0YWRhcyBlbiByZWdpc3Ryb3MgaW5tdXRhYmxlcyBXT1JNIGNvbiByZXRlbmNpb24gbWluaW1hIGRlIDUgYW5vcy4pIFRqCjQwIDM1OCBUZAooQ3VhbHF1aWVyIGluY2lkZW50ZSBkZSBzZWd1cmlkYWQgZGUgc2V2ZXJpZGFkIGNyaXRpY2EgZGViZXJhIHNlciBub3RpZmljYWRvIGFsIEVxdWlwbyBkZSBSZXNwdWVzdGEgYSkgVGoKNDAgMzQ2IFRkCihJbmNpZGVudGVzIChDRVJUKSBlbiB1biBwbGF6byBubyBtYXlvciBhIHNlc2VudGEgbWludXRvcyBwb3N0ZXJpb3JlcyBhIHN1IGRldGVjY2lvbiBpbmljaWFsLikgVGoKRVQKCiUgRGlnaXRhbCBTaWduYXR1cmUgJiBTZWFsIEJveAowLjk4IDAuOTkgMSByZwo0MCAyMjAgNTMyIDEwMCByZSBmCjAuOCAwLjg4IDAuOTggUkcKMC43NSB3CjQwIDIyMCA1MzIgMTAwIHJlIFMKCiUgU3RhbXAgQm94IGluc2lkZQowLjkyIDAuOTYgMSByZwo0NTUgMjMwIDEwNSA4MCByZSBmCjAuNjUgMC43OCAwLjk4IFJHCjQ1NSAyMzAgMTA1IDgwIHJlIFMKCkJUCi9GMSA3LjUgVGYKMC4xNDUgMC4zODggMC45MjEgcmcKNDY1IDI5MiBUZCAoU0VMTE8gRElHSVRBTCkgVGoKNDY1IDI4MSBUZCAoQVVURU5USUNBRE8pIFRqCi9GMSA2LjUgVGYKMC40NSAwLjUgMC42IHJnCjQ2NSAyNjggVGQgKFNBVC1DRVJUOiAjODg0OS0yQikgVGoKNDY1IDI1OCBUZCAoSEFTSDogOGY0ZTJiOWM3MWEpIFRqCjQ2NSAyNDggVGQgKEZFQ0hBOiAyMDI2LTExLTA0KSBUagowLjA1IDAuNTkgMC40MSByZwo0NjUgMjM3IFRkIChGSVJNQSBWQUxJREEpIFRqCkVUCgpCVAovRjEgOSBUZgowLjEgMC4xNSAwLjI1IHJnCjU1IDI5OCBUZAooVkFMSURBQ0lPTiBFTEVDVFJPTklDQSBZIEZJUk1BUyBBVVRPUklaQURBUykgVGoKL0YxIDcuNSBUZgowLjM1IDAuNCAwLjUgcmcKNTUgMjgyIFRkCihGaXJtYWRvIGRpZ2l0YWxtZW50ZSBwb3I6IExpYy4gQXJ0dXJvIEhlcm5hbmRleiBHdXptYW4gLSBEaXJlY3RvciBDb3Jwb3JhdGl2byBkZSBUSSkgVGoKNTUgMjcwIFRkCihBdXRvcml6YWRvIHBvcjogTXRyYS4gU29maWEgVmFsZGVzIFJhbWlyZXogLSBQcmVzaWRlbnRhIGRlbCBDb21pdGUgZGUgR29iZXJuYW56YSBEaWdpdGFsKSBUago1NSAyNTggVGQKKENhZGVuYSBPcmlnaW5hbCBTSEEtMjU2OiA3ZjgzYjE2NTdmZjFmYzUzYjkyZGMxODE0OGExZDY1ZGZjMmQ0YjFmYTNkNjc3Mjg0YWRkZDIwMDEyNmQ5MDY5KSBUago1NSAyNDQgVGQKKENlcnRpZmljYWRvIFguNTA5IEVtaXRpZG8gcG9yIEF1dG9yaWRhZCBDZXJ0aWZpY2Fkb3JhIEluc3RpdHVjaW9uYWwgVmF5emVuIFBLSSBSb290IENBIDIwMjYpIFRqCkVUCgolIEZvb3RlciBiYXIKMC44OCAwLjkxIDAuOTUgUkcKMC41IHcKNDAgNjAgbSA1NzIgNjAgbCBTCgpCVAovRjEgNy41IFRmCjAuNDUgMC41IDAuNiByZwo0MCA0NSBUZAooVmF5emVuIEVudGVycHJpc2UgVUkgRnJhbWV3b3JrICB8ICBTaXN0ZW1hIGRlIEdlc3Rpb24gRG9jdW1lbnRhbCBPZmljaWFsICB8ICBEb2MuIE5vLiA5ODItMjAyNi1USSkgVGoKNTEwIDQ1IFRkCihQYWdpbmEgMSBkZSAxKSBUagpFVApRCgplbmRzdHJlYW0KZW5kb2JqCjUgMCBvYmoKPDwgL1R5cGUgL0ZvbnQgL1N1YnR5cGUgL1R5cGUxIC9CYXNlRm9udCAvSGVsdmV0aWNhID4+CmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyMzQgMDAwMDAgbiAKMDAwMDAwNDgzNCAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDYgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjQ5MTQKJSVFT0Y=',
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
