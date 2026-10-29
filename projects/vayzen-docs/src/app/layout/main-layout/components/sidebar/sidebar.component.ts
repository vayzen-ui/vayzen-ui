import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface SidebarNavItem {
  label: string;
  route: string;
  icon: 'home' | 'install' | 'studio' | 'button' | 'card' | 'table';
  badge?: string;
  badgeType?: 'soft' | 'primary' | 'live';
}

export interface SidebarNavGroup {
  id: string;
  title: string;
  items: SidebarNavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  readonly filterQuery = signal('');

  readonly navGroups: SidebarNavGroup[] = [
    {
      id: 'getting-started',
      title: 'Comenzar',
      items: [
        {
          label: 'Bienvenida',
          route: '/home',
          icon: 'home',
          badge: 'Inicio',
          badgeType: 'soft',
        },
        {
          label: 'Instalación',
          route: '/installation',
          icon: 'install',
          badge: 'CLI',
          badgeType: 'soft',
        },
      ],
    },
    {
      id: 'tools',
      title: 'Herramientas',
      items: [
        {
          label: 'Vayzen Studio',
          route: '/studio',
          icon: 'studio',
          badge: 'Live',
          badgeType: 'live',
        },
      ],
    },
    {
      id: 'components',
      title: 'Componentes UI',
      items: [
        {
          label: 'Button',
          route: '/components/buttons',
          icon: 'button',
          badge: 'Acción',
          badgeType: 'soft',
        },
        {
          label: 'Card',
          route: '/components/cards',
          icon: 'card',
          badge: 'Nuevo',
          badgeType: 'primary',
        },
        {
          label: 'Table',
          route: '/components/tables',
          icon: 'table',
          badge: 'Datos',
          badgeType: 'soft',
        },
      ],
    },
  ];

  readonly filteredGroups = computed(() => {
    const q = this.filterQuery().trim().toLowerCase();
    if (!q) {
      return this.navGroups;
    }
    return this.navGroups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            (item.badge && item.badge.toLowerCase().includes(q)) ||
            group.title.toLowerCase().includes(q)
        ),
      }))
      .filter((group) => group.items.length > 0);
  });

  onFilterInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.filterQuery.set(target.value);
  }

  clearFilter(): void {
    this.filterQuery.set('');
  }
}
