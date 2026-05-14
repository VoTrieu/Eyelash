import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './server-error.html',
  styleUrls: ['./server-error.css'],
})
export class ServerErrorComponent {
  private router = inject(Router);

  goHome() {
    void this.router.navigate(['/']);
  }

  goBack() {
    history.back();
  }
}
