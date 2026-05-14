import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { ServicesService } from '../../../../../core/services/services-service';
import { Service } from '../../../../../types/service';

export interface ServiceToggleEvent {
  serviceId: number;
  checked: boolean;
}

@Component({
  selector: 'app-booking-service-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CheckboxModule],
  templateUrl: './booking-service-selector.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingServiceSelector {
  private servicesService = inject(ServicesService);

  services = input.required<Service[]>();
  selectedServiceIds = input.required<number[]>();
  loading = input(false);

  serviceToggled = output<ServiceToggleEvent>();

  isSelected(serviceId: number) {
    return this.selectedServiceIds().includes(serviceId);
  }

  serviceCardClass(serviceId: number) {
    return this.isSelected(serviceId)
      ? 'border-rose-300 bg-rose-50/80 shadow-md shadow-rose-100/60 ring-1 ring-rose-200/80 dark:border-rose-400/60 dark:bg-rose-400/10 dark:shadow-black/20 dark:ring-rose-400/20'
      : 'border-stone-200 dark:border-slate-800';
  }

  imageUrl(url?: string | null) {
    return this.servicesService.resolvePhotoUrl(url);
  }

  toggleService(serviceId: number, checked: boolean) {
    this.serviceToggled.emit({ serviceId, checked });
  }
}
