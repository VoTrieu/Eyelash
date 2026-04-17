import { Component, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-header',
  imports: [AvatarModule, ButtonModule, ToolbarModule],
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

  onScroll() {
    const scrolled = window.scrollY > 0;
    this.isScrolled.set(scrolled);
  }
}
