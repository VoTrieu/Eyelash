import { AfterViewInit, Component, ElementRef, OnDestroy, computed, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { SidebarService } from '../../../core/services/sidebar-service';
import { ThemeService } from '../../../core/services/theme-service';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-admin-topbar',
  standalone: true,
  imports: [CommonModule, ButtonModule, AvatarModule, MenuModule],
  templateUrl: './admin-topbar.html',
  styleUrls: ['./admin-topbar.css'],
  host: {
    '(window:resize)': 'emitHeight()',
  },
})
export class AdminTopbar implements AfterViewInit, OnDestroy {
  private elementRef = inject(ElementRef<HTMLElement>);
  private accountService = inject(AccountService);
  private router = inject(Router);
  private resizeObserver?: ResizeObserver;
  heightChange = output<number>();

  currentUser = this.accountService.currentUser;
  avatarLabel = computed(() => this.currentUser()?.displayName?.charAt(0).toUpperCase() || 'A');
  avatarUrl = computed(() => this.accountService.resolveImageUrl(this.currentUser()?.imageUrl));

  userMenuItems: MenuItem[] = [
    {
      label: 'View profile',
      icon: 'pi pi-user',
      command: () => this.router.navigate(['/admin/profile']),
    },
    {
      separator: true,
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logout(),
    },
  ];

  constructor(
    public sidebarService: SidebarService,
    public themeService: ThemeService
  ) {}

  ngAfterViewInit() {
    this.emitHeight();
    requestAnimationFrame(() => this.emitHeight());

    const header = this.elementRef.nativeElement.querySelector('header');
    if (header) {
      this.resizeObserver = new ResizeObserver(() => this.emitHeight());
      this.resizeObserver.observe(header);
    }
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }

  emitHeight() {
    const header = this.elementRef.nativeElement.querySelector('header');
    this.heightChange.emit(header?.offsetHeight || this.elementRef.nativeElement.offsetHeight);
  }

  logout() {
    this.accountService.logout();
    void this.router.navigate(['/login']);
  }
}
