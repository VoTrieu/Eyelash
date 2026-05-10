import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-carousel',
  imports: [ButtonModule, CarouselModule, TagModule],
  templateUrl: './carousel.html',
  styleUrl: './carousel.css',
  host: {
    class: 'flex items-center justify-center my-6',
  },
})
export class Carousel {
  products = [
    {
      image: './image.png',
      title: 'Product',
    },
    {
      image: './image1.png',
      title: 'Product 1',
    },
    {
      image: './image2.png',
      title: 'Product 2',
    },
    {
      image: './image3.png',
      title: 'Product 3',
    },
    {
      image: './image4.png',
      title: 'Product 4',
    },
    {
      image: './image5.png',
      title: 'Product 5',
    },
    {
      image: './image6.png',
      title: 'Product 6',
    },
  ];

  responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '1199px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '767px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '575px',
      numVisible: 1,
      numScroll: 1,
    },
  ];
}
