import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { AdminTopbar } from '../admin-topbar/admin-topbar';
import { AdminSidebar } from '../admin-sidebar/admin-sidebar';
import { AdminFooter } from '../admin-footer/admin-footer';
import { SidebarService } from '../../../core/services/sidebar-service';
import { RouterOutlet } from '@angular/router';
import { AppointmentsService } from '../../../core/services/appointments-service';
import { BusyService } from '../../../core/services/busy-service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule, AdminTopbar,
    AdminSidebar, AdminFooter,
    ButtonModule,
    ProgressBarModule,
    RouterOutlet
],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayout implements OnInit, OnDestroy {
  protected readonly sidebarService = inject(SidebarService);
  private readonly appointmentsService = inject(AppointmentsService);
  protected readonly busyService = inject(BusyService);
  topbarHeight = signal(64);

  ngOnInit() {
    void this.appointmentsService.startRealtime();
  }

  ngOnDestroy() {
    void this.appointmentsService.stopRealtime();
  }

  setTopbarHeight(height: number) {
    this.topbarHeight.set(height);
  }
}
