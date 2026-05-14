import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { AvailableAppointmentSlot } from '../../../../../types/availability';
import { Service } from '../../../../../types/service';
import { ServicesService } from '../../../../../core/services/services-service';

@Component({
  selector: 'app-booking-request-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DatePickerModule,
    FileUploadModule,
    InputTextModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './booking-request-form.html',
  styleUrls: ['./booking-request-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingRequestForm {
  private servicesService = inject(ServicesService);

  form = input.required<FormGroup>();
  selectedServiceIds = input.required<number[]>();
  selectedServices = input.required<Service[]>();
  availableSlots = input.required<AvailableAppointmentSlot[]>();
  minAppointmentDate = input.required<Date>();
  selectedFilesCount = input(0);
  loadingSlots = input(false);
  submitting = input(false);
  submitted = input(false);

  submittedForm = output<void>();
  serviceRemoved = output<number>();
  photosSelected = output<File[]>();

  onPhotosSelected(event: { currentFiles?: File[]; files?: File[] }) {
    const files = event.currentFiles || event.files || [];
    this.photosSelected.emit([...files]);
  }

  imageUrl(url?: string | null) {
    return this.servicesService.resolvePhotoUrl(url);
  }
}
