import { Component, inject, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { HomePageSettingsService } from '../../../core/services/home-page-settings-service';

export interface HomeGalleryItem {
  image: string;
  title: string;
}

const defaultGalleryItems: HomeGalleryItem[] = [
  {
    image: '/brand/kims-brow-lash-client-hero.png',
    title: "Kim's Brow & Lash Studio",
  },
  {
    image: '/brand/kims-brow-lash-service-result.png',
    title: 'Brow & Lash Results',
  },
  {
    image: '/brand/kims-brow-lash-logo.png',
    title: 'Luxury Beauty Care',
  },
  {
    image: '/brand/kims-brow-lash-client-hero.png',
    title: 'Soft Lash Styling',
  },
  {
    image: '/brand/kims-brow-lash-service-result.png',
    title: 'Defined Brows',
  },
  {
    image: '/brand/kims-brow-lash-logo.png',
    title: 'Natural Enhancements',
  },
];

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
  private homePageSettingsService = inject(HomePageSettingsService);

  galleryItems = input<HomeGalleryItem[]>(defaultGalleryItems);

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

  imageUrl(url?: string | null) {
    return this.homePageSettingsService.resolveImageUrl(url);
  }
}
