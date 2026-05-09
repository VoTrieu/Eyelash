import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { ServicesService } from '../../../core/services/services-service';
import { ImageGalleryDialog } from '../../../shared/image-gallery-dialog/image-gallery-dialog';
import { ImageZoomGalleryItem } from '../../../shared/image-zoom-gallery/image-zoom-gallery';
import { ServiceDetail } from '../../../types/service';

@Component({
  selector: 'app-service-card',
  imports: [CommonModule, FormsModule, ButtonModule, CheckboxModule, ImageGalleryDialog],
  templateUrl: './service-card.html',
  styleUrl: './service-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceCard {
  private servicesService = inject(ServicesService);

  service = input.required<ServiceDetail>();
  selected = input(false);
  bookNow = output<number>();
  selectedChange = output<{ serviceId: number; selected: boolean }>();
  galleryVisible = false;
  galleryActiveIndex = 0;

  images = computed<ImageZoomGalleryItem[]>(() => {
    const service = this.service();

    if (service.photos.length) {
      return service.photos.map((photo, index) => ({
        src: this.resolvePhotoUrl(photo.url),
        alt: `${service.name} photo ${index + 1}`,
      }));
    }

    if (service.mainPhotoUrl) {
      return [{ src: this.resolvePhotoUrl(service.mainPhotoUrl), alt: service.name }];
    }

    return [];
  });

  mainImage = computed(() => this.images()[0] ?? null);

  previewPhotos = computed(() => this.images().slice(1, 4));

  onBookNow() {
    this.bookNow.emit(this.service().id);
  }

  onSelectedChange(event: CheckboxChangeEvent) {
    this.selectedChange.emit({
      serviceId: this.service().id,
      selected: !!event.checked,
    });
  }

  openGallery(index: number) {
    if (!this.images().length) return;

    this.galleryActiveIndex = index;
    this.galleryVisible = true;
  }

  resolvePhotoUrl(url?: string | null) {
    return this.servicesService.resolvePhotoUrl(url);
  }
}
