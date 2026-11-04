import { Component, HostListener, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SidebarService } from '../../core/services/sidebar.service';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent implements OnInit {
  readonly sidebarService = inject(SidebarService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        const hash = window.location.hash.substring(1);
        if (hash) {
          setTimeout(() => {
            const targetEl = document.getElementById(hash);
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 150);
        }
      });
  }

  @HostListener('click', ['$event'])
  onAnchorClick(event: MouseEvent): void {
    const target = (event.target as HTMLElement)?.closest('a[href^="#"]');
    if (!target) return;

    const href = target.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
      const id = href.substring(1);
      const element = document.getElementById(id);
      if (element) {
        event.preventDefault();
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.replaceState(null, '', href);
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b') {
      event.preventDefault();
      this.sidebarService.toggle();
    }
  }
}
