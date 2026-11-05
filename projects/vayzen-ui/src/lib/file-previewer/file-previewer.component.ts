import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  booleanAttribute,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VZ_MODAL_IMPORTS } from '../modal';
import { VzFileTypeCategory, VzPreviewFile, VzRemoteFileOptions } from './file-previewer.types';

@Component({
  selector: 'vz-file-previewer',
  standalone: true,
  imports: [CommonModule, ...VZ_MODAL_IMPORTS],
  templateUrl: './file-previewer.component.html',
  styleUrl: './file-previewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-dark]': 'isDarkActive()',
    '[attr.data-theme]': 'effectiveTheme()',
  },
})
export class VzFilePreviewerComponent {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);

  // ── Inputs ──
  readonly files = input<(File | VzPreviewFile)[]>([]);
  readonly showList = input<boolean, unknown>(true, { transform: booleanAttribute });
  readonly allowDelete = input<boolean, unknown>(true, { transform: booleanAttribute });
  readonly allowDownload = input<boolean, unknown>(true, { transform: booleanAttribute });
  readonly allowPrint = input<boolean, unknown>(true, { transform: booleanAttribute });
  readonly allowFullscreen = input<boolean, unknown>(true, { transform: booleanAttribute });
  readonly showTechnicalInfo = input<boolean, unknown>(true, { transform: booleanAttribute });
  readonly maxFiles = input<number | undefined>(undefined);
  readonly emptyMessage = input<string>('No hay archivos cargados');

  // ── Modo Oscuro ──
  readonly theme = input<'light' | 'dark' | 'auto' | undefined>(undefined);
  readonly dark = input<boolean, unknown>(false, { transform: booleanAttribute });

  // ── Outputs ──
  readonly fileDeleted = output<number>();
  readonly fileViewed = output<VzPreviewFile>();
  readonly fileDownloaded = output<VzPreviewFile>();

  // ── Estado Interno ──
  readonly isModalOpen = signal<boolean>(false);
  readonly currentFile = signal<VzPreviewFile | null>(null);
  readonly isFullscreen = signal<boolean>(false);
  readonly safePdfUrl = signal<SafeResourceUrl | null>(null);
  readonly zoomLevel = signal<number>(100);
  readonly rotation = signal<number>(0);
  readonly activeTab = signal<'viewer' | 'info'>('viewer');
  readonly isFrameError = signal<boolean>(false);

  private createdBlobUrls: string[] = [];

  // ── Computados ──
  readonly effectiveTheme = computed<'light' | 'dark' | undefined>(() => {
    if (this.dark()) return 'dark';
    const t = this.theme();
    if (t === 'dark' || t === 'light') return t;
    return undefined;
  });

  readonly isDarkActive = computed<boolean>(() => {
    return this.dark() || this.theme() === 'dark';
  });

  readonly normalizedFiles = computed<VzPreviewFile[]>(() => {
    return this.files().map((item) => {
      if (item instanceof File) {
        return {
          name: item.name,
          size: item.size,
          type: item.type,
          file: item,
        };
      }
      return item;
    });
  });

  readonly isExceeded = computed<boolean>(() => {
    const max = this.maxFiles();
    return max !== undefined && this.normalizedFiles().length > max;
  });

  readonly currentCategory = computed<VzFileTypeCategory>(() => {
    const f = this.currentFile();
    if (!f) return 'other';
    return this.getFileCategory(f);
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.cleanupBlobUrls();
    });
  }

  // ── Métodos Públicos ──
  openFile(item: File | VzPreviewFile, index?: number): void {
    let normalized: VzPreviewFile;
    if (item instanceof File) {
      const blobUrl = URL.createObjectURL(item);
      this.createdBlobUrls.push(blobUrl);
      normalized = {
        name: item.name,
        size: item.size,
        type: item.type,
        url: blobUrl,
        file: item,
      };
    } else {
      normalized = { ...item };
      if (normalized.file && !normalized.url) {
        const blobUrl = URL.createObjectURL(normalized.file);
        this.createdBlobUrls.push(blobUrl);
        normalized.url = blobUrl;
      }
    }

    this.currentFile.set(normalized);
    this.zoomLevel.set(100);
    this.rotation.set(0);
    this.activeTab.set('viewer');
    this.isFrameError.set(false);

    if (this.getFileCategory(normalized) === 'pdf' && normalized.url) {
      this.safePdfUrl.set(
        this.sanitizer.bypassSecurityTrustResourceUrl(`${normalized.url}#toolbar=1&navpanes=0`)
      );
    } else {
      this.safePdfUrl.set(null);
    }

    this.isModalOpen.set(true);
    this.fileViewed.emit(normalized);
  }

  zoomIn(): void {
    this.zoomLevel.update((z) => Math.min(250, z + 25));
  }

  zoomOut(): void {
    this.zoomLevel.update((z) => Math.max(50, z - 25));
  }

  resetZoom(): void {
    this.zoomLevel.set(100);
    this.rotation.set(0);
  }

  rotate(): void {
    this.rotation.update((r) => (r + 90) % 360);
  }

  setActiveTab(tab: 'viewer' | 'info'): void {
    this.activeTab.set(tab);
  }

  openUrl(url: string, options?: VzRemoteFileOptions): void {
    const name = options?.name || this.extractNameFromUrl(url);
    const type = options?.type || this.inferTypeFromName(name);
    const item: VzPreviewFile = {
      name,
      url,
      type,
      size: options?.size,
    };
    this.openFile(item);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.currentFile.set(null);
    this.safePdfUrl.set(null);
    this.isFullscreen.set(false);
  }

  toggleFullscreen(event?: Event): void {
    event?.stopPropagation();
    this.isFullscreen.update((v) => !v);
  }

  downloadCurrent(event?: Event): void {
    event?.stopPropagation();
    const curr = this.currentFile();
    if (!curr?.url) return;

    const link = document.createElement('a');
    link.href = curr.url;
    link.download = curr.name || 'archivo';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.fileDownloaded.emit(curr);
  }

  printCurrent(event?: Event): void {
    event?.stopPropagation();
    const curr = this.currentFile();
    if (!curr?.url) return;

    const printWindow = window.open(curr.url, '_blank');
    if (printWindow) {
      printWindow.focus();
    }
  }

  openInNewTab(event?: Event): void {
    event?.stopPropagation();
    const curr = this.currentFile();
    if (!curr?.url) return;
    window.open(curr.url, '_blank');
  }

  deleteFile(index: number, event?: Event): void {
    event?.stopPropagation();
    this.fileDeleted.emit(index);
  }

  getFileCategory(file: VzPreviewFile): VzFileTypeCategory {
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const type = (file.type || '').toLowerCase();

    if (ext === 'pdf' || type.includes('pdf')) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext) || type.startsWith('image/')) {
      return 'image';
    }
    if (['doc', 'docx'].includes(ext) || type.includes('word') || type.includes('document')) {
      return 'word';
    }
    if (['xls', 'xlsx', 'csv'].includes(ext) || type.includes('sheet') || type.includes('excel')) {
      return 'excel';
    }
    if (['js', 'ts', 'html', 'css', 'scss', 'json', 'xml', 'py', 'php', 'sql'].includes(ext)) {
      return 'code';
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext) || type.includes('zip') || type.includes('compressed')) {
      return 'archive';
    }
    if (['txt', 'md', 'log'].includes(ext) || type.startsWith('text/')) {
      return 'text';
    }
    return 'other';
  }

  formatSize(bytes?: number): string {
    if (bytes === undefined || bytes === null || isNaN(bytes) || bytes < 0) return '—';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  private extractNameFromUrl(url: string): string {
    try {
      const pathname = new URL(url, window.location.origin).pathname;
      const seg = pathname.split('/').filter(Boolean).pop();
      if (seg) return decodeURIComponent(seg);
    } catch {
      // url relativa o formato personalizado
    }
    return 'documento.pdf';
  }

  private inferTypeFromName(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'application/pdf';
    if (['jpg', 'jpeg'].includes(ext || '')) return 'image/jpeg';
    if (ext === 'png') return 'image/png';
    return 'application/octet-stream';
  }

  private cleanupBlobUrls(): void {
    this.createdBlobUrls.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // Ignorar
      }
    });
    this.createdBlobUrls = [];
  }
}

