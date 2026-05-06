import { AfterViewInit, Component, ElementRef, inject, signal } from '@angular/core';
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
    class: 'inset-x-0 top-0 z-50 block',
    '[class.fixed]': 'isFixed()',
    '[class.animate-slide-down]': 'isFixed()',
    '(window:scroll)': 'onScroll()',
    '(window:resize)': 'setHeaderHeight()',
  },
})
export class Header implements AfterViewInit {
  private elementRef = inject(ElementRef<HTMLElement>);

  protected isScrolled = signal(false);
  protected isFixed = signal(false);
  private headerHeight = 0;

  constructor(public themeService: ThemeService) {}

  ngAfterViewInit() {
    this.setHeaderHeight();
    this.onScroll();
  }

  onScroll() {
    const shouldFix = this.isFixed()
      ? window.scrollY > 8
      : window.scrollY >= this.headerHeight;

    if (this.isFixed() !== shouldFix) {
      this.isFixed.set(shouldFix);
      this.isScrolled.set(shouldFix);
    }
  }

  protected setHeaderHeight() {
    this.headerHeight = this.elementRef.nativeElement.offsetHeight;
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
