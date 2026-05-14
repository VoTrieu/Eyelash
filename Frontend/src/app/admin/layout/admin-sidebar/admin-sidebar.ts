import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { SidebarService } from '../../../core/services/sidebar-service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, ButtonModule, PanelMenuModule],
  templateUrl: './admin-sidebar.html',
  styleUrls: ['./admin-sidebar.css']
})
export class AdminSidebar {
  protected readonly sidebarService = inject(SidebarService);

  items: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-fw pi-home',
      routerLink: ['/admin']
    },
    {
      label: 'Services',
      icon: 'pi pi-fw pi-sparkles',
      routerLink: ['/admin/services']
    },
    {
      label: 'Appointments',
      icon: 'pi pi-fw pi-calendar',
      routerLink: ['/admin/appointments']
    },
    {
      label: 'Availability',
      icon: 'pi pi-fw pi-clock',
      routerLink: ['/admin/availability']
    },
    {
      label: 'Reviews',
      icon: 'pi pi-fw pi-star',
      routerLink: ['/admin/reviews']
    },
    {
      label: 'Users',
      icon: 'pi pi-fw pi-users',
      routerLink: ['/admin/users']
    },
    {
      label: 'Settings',
      icon: 'pi pi-fw pi-cog',
      routerLink: ['/admin/settings']
    }
  ];
}
