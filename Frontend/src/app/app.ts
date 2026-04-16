import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-root',
  imports: [ButtonModule, DialogModule, InputTextModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
   visible: boolean = false;

    showDialog() {
        this.visible = true;
    }

    closeDialog() {
        this.visible = false;
    }
}
