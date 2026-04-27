import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'eyelash-theme-mode';
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly mode = signal<ThemeMode>(this.getInitialMode());

  constructor() {
    this.applyMode(this.mode());
  }

  toggle(): void {
    this.setMode(this.mode() === 'dark' ? 'light' : 'dark');
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
    this.applyMode(mode);

    if (this.isBrowser) {
      localStorage.setItem(this.storageKey, mode);
    }
  }

  private getInitialMode(): ThemeMode {
    if (!this.isBrowser) {
      return 'light';
    }

    return localStorage.getItem(this.storageKey) === 'dark' ? 'dark' : 'light';
  }

  private applyMode(mode: ThemeMode): void {
    const root = this.document.documentElement;

    root.classList.toggle('app-dark', mode === 'dark');
    root.style.colorScheme = mode;
  }
}
