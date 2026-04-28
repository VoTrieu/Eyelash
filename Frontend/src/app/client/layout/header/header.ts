import { Component, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ThemeService } from '../../../core/services/theme-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [AvatarModule, ButtonModule, ToolbarModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
  host: {
    class: 'inset-x-0 top-0 z-50',
    '[class.fixed]': 'isScrolled()',
    '[class.animate-slide-down]': 'isScrolled()',
    '(window:scroll)': 'onScroll()',
  },
})
export class Header {
  protected isScrolled = signal(false);

  constructor(public themeService: ThemeService) {}

  onScroll() {
    const scrolled = window.scrollY > 0;
    this.isScrolled.set(scrolled);
  }

  navButtonClass(): string {
    if (!this.isScrolled()) {
      return 'text-white hover:bg-gray-800';
    }

    return this.themeService.mode() === 'dark'
      ? 'text-white hover:bg-slate-800'
      : 'text-black hover:bg-gray-200';
  }
}
