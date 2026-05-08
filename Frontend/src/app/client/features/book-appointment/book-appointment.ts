import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { finalize } from 'rxjs';
import { AppointmentsService } from '../../../core/services/appointments-service';
import { ServicesService } from '../../../core/services/services-service';
import { ToastService } from '../../../core/services/toast-service';
import { AppointmentFormValue } from '../../../types/appointment';
import { Service } from '../../../types/service';
import { Header } from '../../layout/header/header';
import { Footer } from '../../layout/footer/footer';
import { AvailabilityService } from '../../../core/services/availability-service';
import { AvailableAppointmentSlot } from '../../../types/availability';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    FileUploadModule,
    InputTextModule,
    TextareaModule,
    Header,
    Footer,
    SelectModule
  ],
  templateUrl: './book-appointment.html',
  styleUrls: ['./book-appointment.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookAppointment implements OnInit {
  private appointmentsService = inject(AppointmentsService);
  private servicesService = inject(ServicesService);
  private toastService = inject(ToastService);
  private availabilityService = inject(AvailabilityService);
  private fb = inject(FormBuilder);

  services = this.servicesService.services;
  selectedServiceIds = signal<number[]>([]);
  selectedFiles = signal<File[]>([]);
  loadingServices = signal(false);
  submitting = signal(false);
  submitted = signal(false);
  availableSlots = signal<AvailableAppointmentSlot[]>([]);
  loadingSlots = signal(false);

  totalDuration = computed(() =>
    this.selectedServices().reduce((total, service) => total + service.durationInMinutes, 0)
  );

  totalPrice = computed(() =>
    this.selectedServices().reduce((total, service) => total + service.price, 0)
  );

  bookingForm = this.fb.group({
    clientName: ['', Validators.required],
    clientEmail: ['', [Validators.required, Validators.email]],
    clientPhone: ['', [Validators.required, Validators.pattern(/^(\+1\s?)?(\(?[2-9][0-9]{2}\)?[\s.-]?)?[2-9][0-9]{2}[\s.-]?[0-9]{4}$/)]],
    appointmentDate: ['', Validators.required],
    startTime: ['', Validators.required],
    notes: [''],
  });

  ngOnInit() {
    this.loadingServices.set(true);
    this.servicesService
      .loadServices({ pageNumber: 1, pageSize: 50, isAvailable: true, sortBy: 'name' })
      .pipe(finalize(() => this.loadingServices.set(false)))
      .subscribe({
        error: () => this.toastService.showError('Could not load services'),
      });
    this.bookingForm.controls.appointmentDate.valueChanges.subscribe(() => this.loadAvailableSlots());
  }

  toggleService(serviceId: number, checked: boolean) {
    this.selectedServiceIds.update((ids) =>
      checked ? [...new Set([...ids, serviceId])] : ids.filter((id) => id !== serviceId)
    );
    this.loadAvailableSlots();
  }

  isSelected(serviceId: number) {
    return this.selectedServiceIds().includes(serviceId);
  }

  onPhotosSelected(event: any) {
  const files = event.currentFiles || event.files || [];
  this.selectedFiles.set([...files]);

  console.log('Selected:', this.selectedFiles());
  }

  clearSelectedPhotos() {
    this.selectedFiles.set([]);
  }

  submit() {
    if (this.bookingForm.invalid || this.selectedServiceIds().length === 0) {
      this.bookingForm.markAllAsTouched();
      if (this.selectedServiceIds().length === 0) {
        this.toastService.showWarn('Select at least one service');
      }
      return;
    }

    this.submitting.set(true);
    this.appointmentsService
      .createAppointment(
        this.bookingForm.getRawValue() as AppointmentFormValue,
        this.selectedServiceIds(),
        this.selectedFiles()
      )
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.submitted.set(true);
          this.bookingForm.reset();
          this.selectedServiceIds.set([]);
          this.selectedFiles.set([]);
          this.toastService.showSuccess('Appointment request sent');
        },
        error: () => this.toastService.showError('Could not send appointment request'),
      });
  }

  imageUrl(url?: string | null) {
    return this.servicesService.resolvePhotoUrl(url);
  }

  serviceCardClass(serviceId: number) {
    return this.isSelected(serviceId)
      ? 'border-rose-500 dark:border-rose-400'
      : 'border-slate-200 dark:border-slate-800';
  }

  private selectedServices(): Service[] {
    const ids = this.selectedServiceIds();
    return this.services().filter((service) => ids.includes(service.id));
  }

  loadAvailableSlots() {
    const date = this.bookingForm.value.appointmentDate as string;
    const serviceIds = this.selectedServiceIds();
    if (!date || serviceIds.length === 0) {
      this.toastService.showWarn('Select at least one service and appointment date first');
      this.availableSlots.set([]);
      return;
    }

    this.loadingSlots.set(true);
    this.availabilityService.getAvailableAppointmentSlots(date, serviceIds)
      .pipe(finalize(() => this.loadingSlots.set(false)))
      .subscribe({
        next: (slots) => {
          this.availableSlots.set(slots);
          if (!slots.some(slot => slot.startTime === this.bookingForm.value.startTime)) {
            this.bookingForm.patchValue({ startTime: '' });
          }
          if (slots.length === 0) {
            this.toastService.showInfo('No available slots for the selected date and services');
          }
        },
        error: () => this.toastService.showError('Could not load available slots'),
      });
  }
}
