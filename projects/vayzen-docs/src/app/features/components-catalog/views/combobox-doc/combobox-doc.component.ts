import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  VzComboboxComponent,
  VzComboboxOption,
  VzComboboxOptionDirective,
  VzComboboxTheme,
  VzSelectComponent,
  VzSelectOption,
  VzMultiSelectComponent,
  VzMultiSelectOption,
} from 'vayzen-ui';
import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';

@Component({
  selector: 'app-combobox-doc',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    VzComboboxComponent,
    VzComboboxOptionDirective,
    VzSelectComponent,
    VzMultiSelectComponent,
    CodeBlockComponent,
  ],
  templateUrl: './combobox-doc.component.html',
  styleUrls: ['../../../../shared/styles/doc-page.css', './combobox-doc.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComboboxDocComponent {
  // Tema de previsualización (Claro / Oscuro)
  protected readonly previewTheme = signal<VzComboboxTheme>('light');

  togglePreviewTheme(): void {
    this.previewTheme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  // ── Demo 1: Básico Minimalista ──
  protected readonly paisesSimples: VzComboboxOption<string>[] = [
    { id: 'MX', descripcion: 'México' },
    { id: 'CO', descripcion: 'Colombia' },
    { id: 'ES', descripcion: 'España' },
    { id: 'AR', descripcion: 'Argentina' },
    { id: 'CL', descripcion: 'Chile' },
    { id: 'PE', descripcion: 'Perú' },
  ];
  protected readonly selectedPais = signal<string | null>('MX');

  // ── Demo 2: Enterprise Pro con Icono, Subtítulos, Badges y Opciones Inactivas ──
  protected readonly empresasPro: VzComboboxOption<number>[] = [
    {
      id: 101,
      descripcion: 'Vayzen Technologies Corp.',
      subtitle: 'Sede Central · CDMX, México',
      badge: 'Tier 1',
      badgeVariant: 'primary',
      icon: 'building',
    },
    {
      id: 102,
      descripcion: 'Global Logistics Latam',
      subtitle: 'Bogotá, Colombia · Logística & Carga',
      badge: 'Verificado',
      badgeVariant: 'success',
      icon: 'building',
    },
    {
      id: 103,
      descripcion: 'Iberia Cloud Services',
      subtitle: 'Madrid, España · Nube & DevOps',
      badge: 'En Revisión',
      badgeVariant: 'warning',
      icon: 'building',
    },
    {
      id: 104,
      descripcion: 'Austral CyberSec Group',
      subtitle: 'Buenos Aires, Argentina · SOC 24/7',
      badge: 'Crítico',
      badgeVariant: 'danger',
      icon: 'building',
    },
    {
      id: 105,
      descripcion: 'Andes FinTech SpA',
      subtitle: 'Santiago, Chile · Pasarela de Pagos',
      badge: 'Inactivo',
      badgeVariant: 'neutral',
      activo: false,
      icon: 'building',
    },
  ];
  protected readonly selectedEmpresa = signal<number | null>(null);
  protected readonly isLoadingEmpresas = signal(false);

  simularCarga(): void {
    this.isLoadingEmpresas.set(true);
    setTimeout(() => {
      this.isLoadingEmpresas.set(false);
    }, 1200);
  }

  // ── Demo 3: Textos Extensos y Truncado Inteligente (Ellipsis + Tooltip) ──
  protected readonly normativasLargas: VzComboboxOption<string>[] = [
    {
      id: 'iso-27001',
      descripcion:
        'Norma Internacional ISO/IEC 27001:2022 — Sistemas de Gestión de Seguridad de la Información (SGSI) y Controles de Ciberseguridad Global',
      subtitle:
        'Dirección Corporativa de Auditoría, Riesgo Tecnológico y Cumplimiento Regulatorio Internacional · Edificio Prisma Torre B',
      badge: 'Auditoría 2026',
      badgeVariant: 'warning',
      icon: 'tag',
    },
    {
      id: 'lic-enterprise',
      descripcion:
        'Contrato de Licenciamiento Maestro Multiregional Enterprise SaaS con SLA Garantizado del 99.99% y Soporte Crítico 24/7/365',
      subtitle:
        'Contrato Marco Nº AR-2026-99482-B2B suscrito entre Vayzen Global Inc. y Consorcio Tecnológico Latinoamericano S.A.P.I. de C.V.',
      badge: 'Vigente',
      badgeVariant: 'success',
      icon: 'building',
    },
    {
      id: 'infra-cloud',
      descripcion:
        'Clúster Distribuido de Alta Disponibilidad Kubernetes en Multi-Región Este de EE. UU. (us-east-1) y Frankfurt (eu-central-1)',
      subtitle:
        'Infraestructura de microservicios con replicación activa-activa, balanceo geo-redundante y cifrado de datos en reposo AES-256',
      badge: 'Tier 4',
      badgeVariant: 'primary',
      icon: 'building',
    },
    {
      id: 'term-conf',
      descripcion:
        'Acuerdo de Confidencialidad Bilateral, No Divulgación de Secretos Industriales y Cesión Exclusiva de Propiedad Intelectual',
      subtitle:
        'Anexo Legal Nº 4 · Sujeto a la jurisdicción de los tribunales de la Ciudad de México y legislación mercantil aplicable',
      badge: 'Confidencial',
      badgeVariant: 'danger',
      icon: 'tag',
    },
  ];
  protected readonly selectedNormativa = signal<string | null>('iso-27001');

  // ── Demo 4: Selector de Equipo / Colaboradores (Avatar + Estatus Dot) ──
  protected readonly teamMembers: VzSelectOption<string>[] = [
    {
      id: 'sc',
      descripcion: 'Sarah Chen',
      subtitle: 'Engineering Lead',
      avatarText: 'SC',
      status: 'away',
      avatarColor: '#1e293b',
    },
    {
      id: 'ar',
      descripcion: 'Alex Rivera',
      subtitle: 'Senior Developer',
      avatarText: 'AR',
      status: 'online',
      avatarColor: '#0f172a',
    },
    {
      id: 'jk',
      descripcion: 'Jordan Kim',
      subtitle: 'UX Designer',
      avatarText: 'JK',
      status: 'away',
      avatarColor: '#334155',
    },
    {
      id: 'tm',
      descripcion: 'Taylor Morgan',
      subtitle: 'Product Manager',
      avatarText: 'TM',
      status: 'busy',
      avatarColor: '#1e293b',
    },
    {
      id: 'er',
      descripcion: 'Elena Rostova',
      subtitle: 'DevOps Architect',
      avatarText: 'ER',
      status: 'online',
      avatarColor: '#0f172a',
    },
  ];
  protected readonly selectedTeamMember = signal<string | null>(null);

  // ── Demo 5: Opción B con Template Personalizado (Slots) ──
  protected readonly usuarios: VzComboboxOption<number>[] = [
    { id: 1, descripcion: 'Ángela Pérez', subtitle: 'angela.perez@vayzen.dev', role: 'Principal Architect' },
    { id: 2, descripcion: 'Luis Hernández', subtitle: 'luis.hernandez@vayzen.dev', role: 'Product Lead' },
    { id: 3, descripcion: 'María García', subtitle: 'maria.garcia@vayzen.dev', role: 'Senior Frontend' },
  ];
  protected readonly selectedUsuario = signal<number | null>(null);

  // ── Demo 5: VzSelect (Dropdown directo sin buscador) ──
  protected readonly selectCategorias: VzSelectOption<string>[] = [
    { id: 'it', descripcion: 'Tecnología & Cloud', icon: 'tag' },
    { id: 'design', descripcion: 'Diseño UX / UI', icon: 'tag' },
    { id: 'sales', descripcion: 'Ventas Enterprise', icon: 'tag' },
    { id: 'finance', descripcion: 'Finanzas & FinOps', icon: 'tag' },
    { id: 'hr', descripcion: 'Talento Humano', icon: 'tag', activo: false },
  ];
  protected readonly selectedCategoria = signal<string | null>('it');

  // ── Demo 6: VzMultiSelect (Chips interactivos + Seleccionar Todo) ──
  protected readonly multiHabilidades: VzMultiSelectOption<string>[] = [
    { id: 'angular', descripcion: 'Angular 21+', badge: 'Core' },
    { id: 'typescript', descripcion: 'TypeScript 5.8', badge: 'Strict' },
    { id: 'rxjs', descripcion: 'RxJS / Signals', badge: 'Reactive' },
    { id: 'scss', descripcion: 'SCSS Nativo BEM', badge: 'Styles' },
    { id: 'docker', descripcion: 'Docker & K8s', badge: 'DevOps' },
    { id: 'graphql', descripcion: 'GraphQL / Apollo', badge: 'API' },
  ];
  protected readonly selectedHabilidades = signal<string[]>(['angular', 'typescript']);

  // ── Snippets de código ──
  protected readonly basicSnippetHtml = `<vz-combobox
  [theme]="theme"
  placeholder="Selecciona un país..."
  [options]="paises"
  [(ngModel)]="paisSeleccionado"
  (selectionChange)="onPaisChange($event)"
/>`;

  protected readonly proSnippetHtml = `<vz-combobox
  [theme]="theme"
  icon="building"
  placeholder="Seleccionar corporativo..."
  searchPlaceholder="Buscar por nombre, ciudad o ID..."
  allOptionText="Todos los corporativos"
  [options]="empresas"
  [clearable]="true"
  [loading]="isLoading"
  [(ngModel)]="empresaSeleccionada"
/>`;

  protected readonly longTextSnippetHtml = `<vz-combobox
  [theme]="theme"
  icon="tag"
  placeholder="Seleccionar normativa o acuerdo..."
  searchPlaceholder="Buscar por cualquier término del texto..."
  allOptionText="Todas las normativas registradas"
  [options]="normativasLargas"
  [clearable]="true"
  [(ngModel)]="normativaSeleccionada"
/>`;

  protected readonly teamMemberSnippetHtml = `<vz-select
  [theme]="theme"
  placeholder="Select team member..."
  [options]="teamMembers"
  [clearable]="true"
  [(ngModel)]="selectedTeamMember"
/>`;

  protected readonly customSlotSnippetHtml = `<vz-combobox
  placeholder="Seleccionar colaborador..."
  [options]="usuarios"
  [(ngModel)]="usuarioId"
>
  <!-- Slot personalizado con directiva [vzComboboxOption] -->
  <ng-template vzComboboxOption let-option let-selected="selected">
    <div class="user-custom-cell">
      <div class="user-avatar">{{ option.descripcion[0] }}</div>
      <div class="user-info">
        <strong>{{ option.descripcion }}</strong>
        <small>{{ option.subtitle }}</small>
      </div>
    </div>
  </ng-template>
</vz-combobox>`;

  protected readonly selectSnippetHtml = `<vz-select
  [theme]="theme"
  icon="tag"
  placeholder="Selecciona una categoría..."
  [options]="categorias"
  [clearable]="true"
  [(ngModel)]="categoriaSeleccionada"
/>`;

  protected readonly multiSelectSnippetHtml = `<vz-multi-select
  [theme]="theme"
  icon="tag"
  placeholder="Seleccionar habilidades..."
  [options]="habilidades"
  [showSelectAll]="true"
  [maxChipsVisible]="2"
  [clearable]="true"
  [(ngModel)]="habilidadesSeleccionadas"
/>`;

  // ── Tablas de API ──
  protected readonly inputApi = [
    ['theme', "'light' | 'dark' | 'auto' | undefined", 'undefined', 'Activa el Modo Claro, Modo Oscuro nativo de fábrica o automático según el sistema.'],
    ['dark', 'boolean', 'false', 'Atajo booleano para activar el Modo Oscuro nativo (<vz-combobox dark>).'],
    ['variant', "'outline' | 'filled' | 'flush'", "'outline'", 'Variante estética del contenedor y bordes del selector.'],
    ['size', "'sm' | 'md' | 'lg'", "'md'", 'Tamaño visual del selector.'],
    ['options', 'VzComboboxOption<T>[]', '[]', 'Arreglo de opciones (id, descripcion, subtitle, badge, activo, icon).'],
    ['icon', 'string', "''", 'Icono temático de prefijo opcional ("building", "user", "tag", "map-pin").'],
    ['placeholder', 'string', "'Seleccionar...'", 'Texto mostrado en el trigger cuando no hay selección.'],
    ['searchPlaceholder', 'string', "'Buscar...'", 'Placeholder dentro del input de búsqueda del dropdown.'],
    ['allOptionText', 'string', "'Seleccionar...'", 'Texto de la opción superior para limpiar o seleccionar "Todos".'],
    ['showAllOption', 'boolean', 'true', 'Muestra la opción superior fija "Todos / Limpiar filtro".'],
    ['searchable', 'boolean', 'true', 'Habilita la caja de búsqueda en vivo dentro del panel flotante.'],
    ['localSearch', 'boolean', 'true', 'Filtra localmente sin acentos. En false, emite (searchChange) para APIs remotas.'],
    ['clearable', 'boolean', 'false', 'Muestra botón de cruz rápida en el trigger para deseleccionar.'],
    ['loading', 'boolean', 'false', 'Muestra spinner nativo animado SVG y desactiva temporalmente el trigger.'],
    ['disabled', 'boolean', 'false', 'Deshabilita la interacción visual y de teclado.'],
    ['required', 'boolean', 'false', 'Valida en Reactive Forms que exista una opción seleccionada.'],
  ];

  protected readonly outputApi = [
    ['selectionChange', 'T | null', 'Emite el id seleccionado o null cuando se limpia.'],
    ['searchChange', 'string', 'Emite el término de búsqueda tecleado (con debounce configurable).'],
    ['opened', 'void', 'Se emite al desplegarse el panel flotante.'],
    ['closed', 'void', 'Se emite al cerrarse el panel flotante.'],
    ['cleared', 'void', 'Se emite al limpiar la selección.'],
  ];

  protected readonly optionPropRows = [
    ['id', 'T', 'Identificador único de la opción (string, number, etc.).'],
    ['descripcion', 'string', 'Texto principal mostrado en el trigger y en el dropdown.'],
    ['subtitle', 'string', 'Subtítulo descriptivo secundario debajo del texto principal.'],
    ['badge', 'string', 'Texto de la insignia o badge semántico flotante.'],
    ['badgeVariant', "'primary' | 'success' | 'warning' | 'danger' | 'neutral'", 'Variante visual del badge.'],
    ['icon', 'string', 'Icono temático individual de la opción.'],
    ['avatar', 'string', 'URL de imagen de avatar para el colaborador o elemento.'],
    ['avatarText', 'string', "Iniciales o texto corto (ej. 'SC', 'AR') cuando no hay imagen."],
    ['status', "'online' | 'busy' | 'away' | 'offline'", 'Estatus de disponibilidad para dot indicador visual.'],
    ['statusColor', 'string', 'Color CSS personalizado para el indicador de estatus.'],
    ['activo', 'boolean', 'Estado activo/inactivo (si es false, queda deshabilitada).'],
  ];

  protected readonly cssVarApi = [
    ['--vz-combobox-bg', '#ffffff (#0f172a en dark)', 'Fondo del trigger principal.'],
    ['--vz-combobox-border', '#e2e8f0 (#334155 en dark)', 'Borde exterior del selector.'],
    ['--vz-combobox-accent', '#2563eb (#3b82f6 en dark)', 'Color primario de foco, checkmarks y badges.'],
    ['--vz-combobox-dropdown-bg', '#ffffff (#0f172a en dark)', 'Fondo del panel flotante dropdown.'],
    ['--vz-combobox-item-hover-bg', '#f8fafc (#1e293b en dark)', 'Fondo de la opción en hover o navegación con flechas.'],
    ['--vz-combobox-radius', '0.5rem', 'Radio de bordes del trigger y del dropdown.'],
  ];
}
