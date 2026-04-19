import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-footer.html',
  styleUrls: ['./admin-footer.css']
})
export class AdminFooter {}
