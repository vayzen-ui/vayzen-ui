import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '../../../../core/services/sidebar.service';
import { ThemeService } from '../../../../core/services/theme.service';

export interface QuickSearchItem {
  title: string;
  subtitle: string;
  category: string;
  route: string;
  badge?: string;
  icon: 'card' | 'button' | 'table' | 'studio' | 'home' | 'install';
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  readonly themeService = inject(ThemeService);
  readonly sidebarService = inject(SidebarService);
  private readonly router = inject(Router);
  private readonly hostRef = inject(ElementRef<HTMLElement>);

  @ViewChild('searchInput') searchInputRef?: ElementRef<HTMLInputElement>;

  readonly searchQuery = signal('');
  readonly isSearchOpen = signal(false);
  readonly isQuickAccessOpen = signal(false);

  readonly allItems: QuickSearchItem[] = [
    {
      title: 'Card',
      subtitle: 'Contenedor versátil con franjas de acento, KPIs y orientación horizontal.',
      category: 'Componentes',
      route: '/components/cards',
      badge: 'Nuevo',
      icon: 'card',
    },
    {
      title: 'Button',
      subtitle: 'Botón interactivo nativo con variantes, tamaños y Design Tokens.',
      category: 'Componentes',
      route: '/components/buttons',
      icon: 'button',
    },
    {
      title: 'Table',
      subtitle: 'Tabla reactiva con ordenamiento, selección, paginación y estados vacíos.',
      category: 'Componentes',
      route: '/components/tables',
      icon: 'table',
    },
    {
      title: 'Vayzen Studio',
      subtitle: 'Laboratorio visual en tiempo real con Inspector Pro y exportador de código.',
      category: 'Herramientas',
      route: '/studio',
      badge: 'LIVE',
      icon: 'studio',
    },
    {
      title: 'Bienvenida',
      subtitle: 'Introducción a la arquitectura Zero-Dependencies y filosofía de Vayzen UI.',
      category: 'Comenzar',
      route: '/home',
      icon: 'home',
    },
    {
      title: 'Instalación',
      subtitle: 'Guía paso a paso para integrar Vayzen UI en proyectos Angular 21+.',
      category: 'Comenzar',
      route: '/installation',
      icon: 'install',
    },
  ];

  readonly filteredItems = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) {
      return this.allItems;
    }
    return this.allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  });

  onSearchFocus(): void {
    this.isSearchOpen.set(true);
    this.isQuickAccessOpen.set(false);
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
    this.isSearchOpen.set(true);
  }

  navigateTo(route: string): void {
    this.isSearchOpen.set(false);
    this.isQuickAccessOpen.set(false);
    this.searchQuery.set('');
    this.router.navigateByUrl(route);
  }

  toggleQuickAccess(): void {
    this.isQuickAccessOpen.update((v) => !v);
    if (this.isQuickAccessOpen()) {
      this.isSearchOpen.set(false);
    }
  }

  @HostListener('window:keydown', ['$event'])
  onWindowKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.searchInputRef?.nativeElement.focus();
      this.isSearchOpen.set(true);
      this.isQuickAccessOpen.set(false);
    } else if (event.key === 'Escape') {
      this.isSearchOpen.set(false);
      this.isQuickAccessOpen.set(false);
      this.searchInputRef?.nativeElement.blur();
    }
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node | null;
    if (target && !this.hostRef.nativeElement.contains(target)) {
      this.isSearchOpen.set(false);
      this.isQuickAccessOpen.set(false);
    }
  }
}
