import { Component } from '@angular/core';
import { Header } from './client/layout/header/header';
import { Map } from "./shared/map/map";
import { Carousel } from "./client/features/carousel/carousel";


@Component({
  selector: 'app-root',
  imports: [Header, Map, Carousel],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
}
