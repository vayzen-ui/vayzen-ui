const fs = require('fs');
const path = require('path');

// 1. Actualizar modal-doc.component.ts
const tsPath = path.join(__dirname, '..', 'projects', 'vayzen-docs', 'src', 'app', 'features', 'components-catalog', 'views', 'modal-doc', 'modal-doc.component.ts');
let tsContent = fs.readFileSync(tsPath, 'utf8');

// Agregar import de DOC_PAGE_SHARED_COMPONENTS y DocTocItem
if (!tsContent.includes('DOC_PAGE_SHARED_COMPONENTS')) {
  tsContent = tsContent.replace(
    "import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';",
    "import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';\nimport { DOC_PAGE_SHARED_COMPONENTS, DocTocItem } from '../../../../shared/components/doc-page';"
  );

  tsContent = tsContent.replace(
    "CodeBlockComponent,",
    "CodeBlockComponent,\n    ...DOC_PAGE_SHARED_COMPONENTS,"
  );
}

// Agregar propiedades TOC y filas de API
const apiRowsCode = `
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
`;

if (!tsContent.includes('modalToc')) {
  tsContent = tsContent.replace(
    'protected readonly basicSnippet =',
    `${apiRowsCode}\n  protected readonly basicSnippet =`
  );
}

fs.writeFileSync(tsPath, tsContent, 'utf8');
console.log('modal-doc.component.ts actualizado con componentes compartidos.');

// 2. Actualizar modal-doc.component.html
const htmlPath = path.join(__dirname, '..', 'projects', 'vayzen-docs', 'src', 'app', 'features', 'components-catalog', 'views', 'modal-doc', 'modal-doc.component.html');

const updatedHtml = `<div class="doc-layout">
  <article class="doc-main-content">
    <!-- Cabecera de Documentación Compartida -->
    <app-doc-header
      category="Feedback y Diálogos"
      version="Signals · Standalone · Dark Mode Nativo"
      title="Modal & Diálogos"
      description="Ventana modal y previsualizador de grado empresarial: incluye backdrop con desenfoque de cristal (glassmorphism), bloqueo de scroll con compensación de barra (zero layout shift), 7 escalas dimensionales (sm a xxl y fullscreen), 5 orientaciones espaciales (drawers laterales y bottom sheet), visor multimedia y Modo Oscuro nativo integrado de fábrica."
      [selectors]="['<vz-modal>', '<vz-file-previewer>']"
      [features]="['Multi-Posición & Drawers', 'Zero Layout Shift']"
      themeTarget="Modales"
      [(previewTheme)]="previewTheme"
    />

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- 1. MODAL BÁSICO MINIMALISTA (ZERO-BOILERPLATE)                          -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section id="modal-basico" class="doc-section">
      <div class="section-heading">
        <h2 class="section-title">1. Modal Básico (Diálogo Minimalista y Confirmación)</h2>
        <p class="section-subtitle">
          Configuración rápida zero-boilerplate para diálogos de alerta, eliminación o confirmación. Bloquea el scroll
          del body compensando el ancho de la barra de desplazamiento para eliminar cualquier salto visual (layout shift).
        </p>
      </div>

      <div class="demo-split-grid">
        <div class="preview-card-container">
          <vz-button
            [theme]="previewTheme()"
            color="danger"
            icon="trash"
            (clicked)="isBasicOpen.set(true)"
          >
            Abrir Diálogo de Confirmación
          </vz-button>

          <!-- Modal Básico -->
          <vz-modal
            [(open)]="isBasicOpen"
            [theme]="previewTheme()"
            size="sm"
            title="¿Eliminar Registro Definitivamente?"
            subtitle="Esta acción no se puede revertir del servidor institucional"
          >
            <p style="margin: 0; color: #64748b; font-size: 0.9375rem; line-height: 1.5;">
              El registro institucional de auditoría y sus archivos adjuntos serán dados de baja permanentemente.
              ¿Confirmas que deseas proceder con la remoción?
            </p>

            <div vzModalActions>
              <vz-button
                [theme]="previewTheme()"
                variant="outline"
                color="secondary"
                size="sm"
                (clicked)="isBasicOpen.set(false)"
              >
                Cancelar
              </vz-button>
              <vz-button
                [theme]="previewTheme()"
                color="danger"
                size="sm"
                (clicked)="isBasicOpen.set(false)"
              >
                Sí, Eliminar
              </vz-button>
            </div>
          </vz-modal>
        </div>

        <app-code-block [code]="basicSnippet" language="html" title="modal-basico.component.html" />
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- 2. MODAL PRO EMPRESARIAL CON SLOTS Y DROPDOWNS SIN RECORTE               -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section id="modal-pro" class="doc-section">
      <div class="section-heading">
        <h2 class="section-title">2. Modal Pro Empresarial (Formularios, Slots y Portales)</h2>
        <p class="section-subtitle">
          Estructura completa para captura de datos empresariales. Soporta proyección personalizada
          (<code>[vzModalHeader]</code>, <code>[vzModalBody]</code>, <code>[vzModalActions]</code>),
          botón nativo para maximizar a pantalla completa y <code>[allowDropdownOverflow]="true"</code>
          para desplegables flotantes sin recorte de viewport.
        </p>
      </div>

      <div class="demo-split-grid demo-split-grid--reverse">
        <div class="preview-card-container">
          <vz-button
            [theme]="previewTheme()"
            color="primary"
            icon="plus"
            (clicked)="isFormOpen.set(true)"
          >
            Abrir Formulario Empresarial (Pro)
          </vz-button>

          <!-- Modal Pro -->
          <vz-modal
            [(open)]="isFormOpen"
            [theme]="previewTheme()"
            size="lg"
            [fullscreenToggle]="true"
            [allowDropdownOverflow]="true"
          >
            <!-- Cabecera Personalizada -->
            <div vzModalHeader style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div style="width: 38px; height: 38px; border-radius: 10px; background: rgba(37, 99, 235, 0.1); display: flex; align-items: center; justify-content: center; color: #2563eb;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7.5" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                </div>
                <div>
                  <h3 style="margin: 0; font-size: 1.125rem; font-weight: 700; color: inherit;">Alta de Usuario Operativo</h3>
                  <p style="margin: 0; font-size: 0.8125rem; color: #64748b;">Asignación de credenciales y nivel de acceso</p>
                </div>
              </div>
            </div>

            <!-- Cuerpo con Formulario y Combobox Inteligente -->
            <div class="demo-form-stack">
              <div class="demo-form-field">
                <label class="demo-form-label">Nombre Completo del Operador</label>
                <input class="demo-input" type="text" placeholder="Ej. Arturo Hernández" />
              </div>

              <div class="demo-form-field">
                <label class="demo-form-label">Rol y Nivel de Privilegios en el Sistema</label>
                <vz-combobox
                  [theme]="previewTheme()"
                  placeholder="Selecciona un rol corporativo..."
                  [options]="rolesDisponibles"
                  [clearable]="true"
                  [(ngModel)]="rolSeleccionado"
                />
                <span class="demo-helper-text">El menú flotante superior/inferior se despliega sin ser recortado por el modal.</span>
              </div>

              <div class="demo-form-field">
                <label class="demo-form-label">Correo Electrónico Institucional</label>
                <input class="demo-input" type="email" placeholder="usuario@vayzen.io" />
              </div>
            </div>

            <!-- Acciones -->
            <div vzModalActions>
              <vz-button
                [theme]="previewTheme()"
                variant="outline"
                color="secondary"
                (clicked)="isFormOpen.set(false)"
              >
                Cerrar sin Guardar
              </vz-button>
              <vz-button
                [theme]="previewTheme()"
                color="primary"
                (clicked)="isFormOpen.set(false)"
              >
                Guardar Operador
              </vz-button>
            </div>
          </vz-modal>
        </div>

        <app-code-block [code]="formSnippet" language="html" title="modal-pro-slots.component.html" />
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- 3. POSICIONES Y TALLAS (DRAWERS Y BOTTOM SHEET)                         -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section id="posiciones-tamanos" class="doc-section">
      <div class="section-heading">
        <h2 class="section-title">3. Orientaciones Espaciales y Tallas (Drawers & Panels)</h2>
        <p class="section-subtitle">
          El componente se transforma en un <strong>Drawer Lateral</strong> (<code>position="right"</code> o <code>position="left"</code>),
          un <strong>Bottom Sheet</strong> (<code>position="bottom"</code>) o una ventana centrada tradicional con escalas desde <code>sm</code> (440px) hasta <code>xxl</code> (1400px).
        </p>
      </div>

      <div class="preview-card-container">
        <div class="demo-modal-trigger-group">
          <vz-button
            [theme]="previewTheme()"
            variant="outline"
            color="primary"
            icon="layout-sidebar"
            (clicked)="abrirPosicion('right', 'md', 'Drawer Lateral Derecho')"
          >
            Drawer Derecho (right)
          </vz-button>

          <vz-button
            [theme]="previewTheme()"
            variant="outline"
            color="primary"
            (clicked)="abrirPosicion('left', 'md', 'Drawer Lateral Izquierdo')"
          >
            Drawer Izquierdo (left)
          </vz-button>

          <vz-button
            [theme]="previewTheme()"
            variant="outline"
            color="primary"
            (clicked)="abrirPosicion('bottom', 'lg', 'Panel Inferior (Bottom Sheet)')"
          >
            Bottom Sheet (bottom)
          </vz-button>

          <vz-button
            [theme]="previewTheme()"
            variant="outline"
            color="secondary"
            (clicked)="abrirPosicion('center', 'sm', 'Diálogo Compacto (sm - 440px)')"
          >
            Talla sm
          </vz-button>

          <vz-button
            [theme]="previewTheme()"
            variant="outline"
            color="secondary"
            (clicked)="abrirPosicion('center', 'xl', 'Ventana Ejecutiva (xl - 1140px)')"
          >
            Talla xl
          </vz-button>
        </div>

        <!-- Modal Dinámico según Botón Presionado -->
        <vz-modal
          [(open)]="isCustomModalOpen"
          [theme]="previewTheme()"
          [position]="activeModalPosition()"
          [size]="activeModalSize()"
          [title]="activeModalTitle()"
          subtitle="Ajuste reactivo mediante inputs position y size"
        >
          <div style="display: flex; flex-direction: column; gap: 0.75rem; color: #475569; font-size: 0.9375rem;">
            <p style="margin: 0;">
              Actualmente visualizando con orientación: <strong><code>position="{{ activeModalPosition() }}"</code></strong> y escala dimensional: <strong><code>size="{{ activeModalSize() }}"</code></strong>.
            </p>
            <p style="margin: 0;">
              Ideal para flujos complejos de inspección de pedidos, filtros avanzados de analítica o paneles de configuración sin perder el contexto de la vista subyacente.
            </p>
          </div>

          <div vzModalActions>
            <vz-button
              [theme]="previewTheme()"
              color="primary"
              size="sm"
              (clicked)="isCustomModalOpen.set(false)"
            >
              Entendido
            </vz-button>
          </div>
        </vz-modal>
      </div>

      <app-code-block [code]="positionsSnippet" language="html" title="modal-drawer-positions.component.html" />
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- 4. PREVISUALIZADOR DE ARCHIVOS MULTIMEDIA INSTITUCIONAL                 -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section id="previsualizador-archivos" class="doc-section">
      <div class="section-heading">
        <h2 class="section-title">4. Previsualizador de Archivos Multimedia (VzFilePreviewer)</h2>
        <p class="section-subtitle">
          Componente especializado listo para producción. Detecta automáticamente la extensión del archivo, provee visor nativo PDF e imágenes con zoom/rotación, panel de metadatos técnicos certificados y descargas seguras.
        </p>
      </div>

      <div class="preview-card-container">
        <!-- Control para probar la Ficha Técnica configurable -->
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; max-width: 680px; padding: 0.75rem 1rem; border-radius: 10px; background: rgba(37, 99, 235, 0.06); border: 1px solid rgba(37, 99, 235, 0.15); margin-bottom: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: #1e3a8a;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span><strong>Ficha Técnica en Cabecera:</strong> {{ showTechInfo() ? 'Activada (muestra pestaña Ficha Técnica)' : 'Desactivada (visor limpio)' }}</span>
          </div>
          <vz-button
            [theme]="previewTheme()"
            size="sm"
            variant="outline"
            color="primary"
            (clicked)="toggleTechInfo()"
          >
            Alternar [showTechnicalInfo]
          </vz-button>
        </div>

        <div style="width: 100%; max-width: 680px;">
          <vz-file-previewer
            [theme]="previewTheme()"
            [files]="sampleFiles"
            [allowDelete]="true"
            [allowDownload]="true"
            [allowPrint]="true"
            [allowFullscreen]="true"
            [showTechnicalInfo]="showTechInfo()"
          />
        </div>
      </div>

      <app-code-block [code]="previewerSnippet" language="html" title="file-previewer-usage.component.html" />
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- 5. MODO OSCURO NATIVO Y TOKENS DE DISEÑO                                -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section id="modo-oscuro" class="doc-section">
      <div class="section-heading">
        <h2 class="section-title">5. Modo Oscuro Nativo y Tokens de Diseño</h2>
        <p class="section-subtitle">
          Admite <code>[theme]="'dark'"</code> directo en el componente o por contexto (<code>[data-theme='dark']</code>).
          Expone variables CSS para modificar fondos, radios, desenfoque de cristal y sombras de elevación.
        </p>
      </div>

      <app-code-block [code]="tokensSnippet" language="scss" title="modal-tokens.scss" />
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <!-- 6. REFERENCIA DE API (TABLAS COMPARTIDAS)                               -->
    <!-- ═══════════════════════════════════════════════════════════════════════ -->
    <section id="api-reference" class="doc-section">
      <div class="section-heading">
        <h2 class="section-title">6. Referencia de API</h2>
      </div>

      <!-- Inputs de vz-modal -->
      <app-doc-api-table
        title="Inputs de <vz-modal>"
        [columns]="['Nombre', 'Tipo', 'Defecto', 'Descripción']"
        [rows]="modalInputRows"
      />

      <!-- Outputs de vz-modal -->
      <app-doc-api-table
        title="Outputs de <vz-modal>"
        [columns]="['Nombre', 'Tipo', 'Descripción']"
        [rows]="modalOutputRows"
      />

      <!-- Directivas de Proyección -->
      <app-doc-api-table
        title="Directivas de Proyección (Nivel 2 - Slots a Medida)"
        [columns]="['Directiva', 'Selector', 'Descripción']"
        [rows]="modalDirectiveRows"
      />

      <!-- Inputs de vz-file-previewer -->
      <app-doc-api-table
        title="Inputs de <vz-file-previewer>"
        [columns]="['Nombre', 'Tipo', 'Defecto', 'Descripción']"
        [rows]="previewerInputRows"
      />

      <!-- Outputs de vz-file-previewer -->
      <app-doc-api-table
        title="Outputs de <vz-file-previewer>"
        [columns]="['Nombre', 'Tipo', 'Descripción']"
        [rows]="previewerOutputRows"
      />

      <!-- Tokens CSS -->
      <app-doc-api-table
        title="Design Tokens CSS (--vz-modal-*)"
        [columns]="['Variable CSS', 'Valor por Defecto', 'Descripción']"
        [rows]="modalTokenRows"
      />
    </section>
  </article>

  <!-- Sidebar Compartido -->
  <app-doc-sidebar
    studioComponent="modal"
    [toc]="modalToc"
  />
</div>
`;

fs.writeFileSync(htmlPath, updatedHtml, 'utf8');
console.log('modal-doc.component.html actualizado con componentes compartidos.');

