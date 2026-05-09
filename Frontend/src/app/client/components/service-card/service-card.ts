import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { ServicesService } from '../../../core/services/services-service';
import { ServiceDetail } from '../../../types/service';

@Component({
  selector: 'app-service-card',
  imports: [CommonModule, FormsModule, ButtonModule, CheckboxModule],
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

  images = computed(() => {
    const service = this.service();

    if (service.photos.length) {
      return service.photos;
    }

    return [];
  });

  mainPhotoUrl = computed(() => {
    const service = this.service();
    const url = service.photos[0]?.url ?? service.mainPhotoUrl ?? null;

    return this.resolvePhotoUrl(url);
  });

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

  resolvePhotoUrl(url?: string | null) {
    return this.servicesService.resolvePhotoUrl(url);
  }
}
