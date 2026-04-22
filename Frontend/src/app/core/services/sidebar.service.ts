import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  readonly sidebarOpen = signal<boolean>(window.innerWidth >= 1024);

  toggle() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  open() {
    this.sidebarOpen.set(true);
  }

  close() {
    this.sidebarOpen.set(false);
  }
}
