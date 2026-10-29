import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarService } from '../../../../core/services/sidebar.service';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  readonly themeService = inject(ThemeService);
  readonly sidebarService = inject(SidebarService);
}

