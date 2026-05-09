import { Component } from '@angular/core';
import { Carousel } from "../carousel/carousel";
import { Map } from "../../../shared/map/map";

@Component({
  selector: 'app-home',
  imports: [Carousel, Map],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
