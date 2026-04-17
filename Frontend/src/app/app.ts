import { Component } from '@angular/core';
import { Header } from './client/layout/header/header';
import { Map } from "./shared/map/map";
import { Carousel } from "./client/features/carousel/carousel";
import { Footer } from './client/layout/footer/footer';


@Component({
  selector: 'app-root',
  imports: [Header, Map, Carousel, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
}
