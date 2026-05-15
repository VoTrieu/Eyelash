import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Carousel } from '../../components/carousel/carousel';
import { Footer } from '../footer/footer';
import { Map } from '../../../shared/map/map';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-main',
  imports: [Header, Footer, RouterOutlet],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {}
