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
    class: 'flex items-center justify-center',
  }
})
export class Carousel {
  products = [
    {
      image: "./image.png",
      title: "Product",
    },
    {
      image: "./image1.png",
      title: "Product 1",
    },
    {
      image: "./image2.png",
      title: "Product 2",
    },
    {
      image: "./image3.png",
      title: "Product 3",
    },
    {
      image: "./image4.png",
      title: "Product 4",
    },
    {
      image: "./image5.png",
      title: "Product 5",
    },
    {
      image: "./image6.png",
      title: "Product 6",
    }

  ]
}
