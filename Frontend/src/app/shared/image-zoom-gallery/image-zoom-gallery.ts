import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';

export interface ImageZoomGalleryItem {
  src: string;
  alt?: string;
}

@Component({
  selector: 'app-image-zoom-gallery',
  standalone: true,
  imports: [CommonModule, GalleriaModule],
  templateUrl: './image-zoom-gallery.html',
  styleUrls: ['./image-zoom-gallery.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageZoomGallery {
  images = input<ImageZoomGalleryItem[]>([]);

  zoomVisible = signal(false);
  zoomX = signal(50);
  zoomY = signal(50);

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 4,
    },
    {
      breakpoint: '640px',
      numVisible: 3,
    },
  ];

  showZoom(event: MouseEvent) {
    this.moveZoom(event);
    this.zoomVisible.set(true);
  }

  moveZoom(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    this.zoomX.set(Math.max(0, Math.min(100, x)));
    this.zoomY.set(Math.max(0, Math.min(100, y)));
  }

  hideZoom() {
    this.zoomVisible.set(false);
  }
}
