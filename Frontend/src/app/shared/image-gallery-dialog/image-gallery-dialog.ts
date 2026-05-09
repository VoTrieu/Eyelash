import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { ImageZoomGalleryItem } from '../image-zoom-gallery/image-zoom-gallery';

@Component({
  selector: 'app-image-gallery-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, GalleriaModule],
  templateUrl: './image-gallery-dialog.html',
  styleUrls: ['./image-gallery-dialog.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageGalleryDialog {
  visible = model(false);
  images = input<ImageZoomGalleryItem[]>([]);
  activeIndex = model(0);
  header = input('Images');

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '640px',
      numVisible: 3,
    },
  ];
}
