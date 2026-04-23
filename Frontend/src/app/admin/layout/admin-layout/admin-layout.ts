import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { AdminTopbar } from '../admin-topbar/admin-topbar';
import { AdminSidebar } from '../admin-sidebar/admin-sidebar';
import { AdminFooter } from '../admin-footer/admin-footer';
import { SidebarService } from '../../../core/services/sidebar-service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule, AdminTopbar,
    AdminSidebar, AdminFooter,
    ButtonModule,
    RouterOutlet
],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayout {
  protected readonly sidebarService = inject(SidebarService);

}
