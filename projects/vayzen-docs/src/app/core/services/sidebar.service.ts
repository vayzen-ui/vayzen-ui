import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  /** Estado reactivo de visibilidad de la barra lateral */
  readonly isOpen = signal<boolean>(true);

  toggle(): void {
    this.isOpen.update((v) => !v);
  }

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }
}

