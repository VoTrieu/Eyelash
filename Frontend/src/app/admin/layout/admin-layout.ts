import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminTopbar } from './topbar/admin-topbar';
import { AdminSidebar } from './sidebar/admin-sidebar';
import { AdminFooter } from './footer/admin-footer';
import { AdminDashboard } from '../features/dashboard/admin-dashboard';
import { SidebarService } from '../services/sidebar.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, AdminTopbar, AdminSidebar, AdminFooter, AdminDashboard, ButtonModule],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayout {
  protected readonly sidebarService = inject(SidebarService);

}
