import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SidebarService } from '../../../core/services/sidebar.service';

@Component({
  selector: 'app-admin-topbar',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './admin-topbar.html',
  styleUrls: ['./admin-topbar.css']
})
export class AdminTopbar {
  constructor(public sidebarService: SidebarService) {}
}
