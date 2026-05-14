import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { ServicesService } from '../../../../../core/services/services-service';
import { ServiceDetail } from '../../../../../types/service';

@Component({
  selector: 'app-service-details-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ProgressSpinnerModule, TagModule],
  templateUrl: './service-details-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceDetailsDialog {
  private servicesService = inject(ServicesService);

  visible = input(false);
  loading = input(false);
  service = input<ServiceDetail | null>(null);

  visibleChange = output<boolean>();

  imageUrl(url?: string | null) {
    return this.servicesService.resolvePhotoUrl(url);
  }
}
