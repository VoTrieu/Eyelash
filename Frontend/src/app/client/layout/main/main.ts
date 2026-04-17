import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Carousel } from '../../features/carousel/carousel';
import { Footer } from '../footer/footer';
import { Map } from '../../../shared/map/map';


@Component({
  selector: 'app-main',
  imports: [Header, Carousel, Footer, Map],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {}
