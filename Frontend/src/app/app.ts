import { Component } from '@angular/core';
import { Header } from './client/layout/header/header';
import { Map } from "./shared/map/map";


@Component({
  selector: 'app-root',
  imports: [Header, Map],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
}
