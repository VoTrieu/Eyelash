import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AppConfirmDialog } from './shared/confirm-dialog/app-confirm-dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, AppConfirmDialog],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
