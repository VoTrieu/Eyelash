import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Carousel } from '../../features/carousel/carousel';

@Component({
  selector: 'app-home-gallery-section',
  standalone: true,
  imports: [Carousel],
  templateUrl: './home-gallery-section.html',
  styleUrls: ['./home-gallery-section.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeGallerySection {}
