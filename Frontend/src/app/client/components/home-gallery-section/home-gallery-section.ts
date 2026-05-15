import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HomePageSettings } from '../../../types/home-page-settings';
import { Carousel, HomeGalleryItem } from '../carousel/carousel';

@Component({
  selector: 'app-home-gallery-section',
  standalone: true,
  imports: [Carousel],
  templateUrl: './home-gallery-section.html',
  styleUrls: ['./home-gallery-section.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeGallerySection {
  settings = input.required<HomePageSettings>();

  galleryItems = computed<HomeGalleryItem[]>(() => {
    const settings = this.settings();

    return [
      { image: settings.galleryImageOneUrl, title: settings.galleryImageOneTitle },
      { image: settings.galleryImageTwoUrl, title: settings.galleryImageTwoTitle },
      { image: settings.galleryImageThreeUrl, title: settings.galleryImageThreeTitle },
      { image: settings.galleryImageFourUrl, title: settings.galleryImageFourTitle },
      { image: settings.galleryImageFiveUrl, title: settings.galleryImageFiveTitle },
      { image: settings.galleryImageSixUrl, title: settings.galleryImageSixTitle },
    ].filter((item) => item.image);
  });
}
