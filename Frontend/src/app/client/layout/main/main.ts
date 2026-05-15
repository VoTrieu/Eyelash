import { Component, inject } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { RouterOutlet } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';
import { BusyService } from '../../../core/services/busy-service';


@Component({
  selector: 'app-main',
  imports: [Header, Footer, RouterOutlet, ProgressBarModule],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  protected readonly busyService = inject(BusyService);
}
