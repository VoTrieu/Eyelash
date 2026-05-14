import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AppointmentsService } from '../../../core/services/appointments-service';
import { ServicesService } from '../../../core/services/services-service';
import { ToastService } from '../../../core/services/toast-service';
import { AppointmentFormValue } from '../../../types/appointment';
import { AvailabilityService } from '../../../core/services/availability-service';
import { AvailableAppointmentSlot } from '../../../types/availability';
import { toDateOnly } from '../../../shared/helpers/date-time-helper';
import { BookingHero } from './components/booking-hero/booking-hero';
import { BookingServiceSelector } from './components/booking-service-selector/booking-service-selector';
import { BookingRequestForm } from './components/booking-request-form/booking-request-form';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [
    CommonModule,
    BookingHero,
    BookingServiceSelector,
    BookingRequestForm,
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
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  services = this.servicesService.services;
  selectedServiceIds = signal<number[]>([]);
  selectedFiles = signal<File[]>([]);
  loadingServices = signal(false);
  submitting = signal(false);
  submitted = signal(false);
  availableSlots = signal<AvailableAppointmentSlot[]>([]);
  loadingSlots = signal(false);
  routeServiceIds = signal<number[]>([]);
  minAppointmentDate = new Date();
  visibleServices = computed(() => {
    const ids = this.routeServiceIds();
    if (!ids.length) return this.services();

    return this.services().filter((service) => ids.includes(service.id));
  });

  selectedServices = computed(() => {
    const ids = this.selectedServiceIds();
    return this.services().filter((service) => ids.includes(service.id));
  });

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
    appointmentDate: [new Date(), Validators.required],
    startTime: ['', Validators.required],
    notes: [''],
  });

  ngOnInit() {
    const routeIds = this.readServiceIdsFromRoute();
    this.routeServiceIds.set(routeIds);
    this.selectedServiceIds.set(routeIds);

    this.loadingServices.set(true);
    this.servicesService
      .loadServices({ pageNumber: 1, pageSize: 50, isAvailable: true, sortBy: 'name' })
      .pipe(finalize(() => this.loadingServices.set(false)))
      .subscribe({
        next: () => {
          if (routeIds.length) {
            this.loadAvailableSlots();
          }
        },
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

  submit() {
    if (this.bookingForm.invalid || this.selectedServiceIds().length === 0) {
      this.bookingForm.markAllAsTouched();
      if (this.selectedServiceIds().length === 0) {
        this.toastService.showWarn('Select at least one service');
      }
      return;
    }

    const formValue = {...this.bookingForm.getRawValue(), 
      appointmentDate: toDateOnly(this.bookingForm.value.appointmentDate)} as AppointmentFormValue;

    this.submitting.set(true);
    this.appointmentsService
      .createAppointment(
        formValue,
        this.selectedServiceIds(),
        this.selectedFiles()
      )
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (appointment) => {
          this.submitted.set(true);
          this.bookingForm.reset();
          this.selectedServiceIds.set([]);
          this.selectedFiles.set([]);
          this.toastService.showSuccess('Appointment request sent');
          void this.router.navigate(['/appointment-requested', appointment.id]);
        },
        error: () => this.toastService.showError('Could not send appointment request'),
      });
  }

  private readServiceIdsFromRoute() {
    const values = this.route.snapshot.queryParamMap.getAll('serviceIds');

    return values
      .flatMap((value) => value.split(','))
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value) && value > 0);
  }

  loadAvailableSlots() {
    const date = toDateOnly(this.bookingForm.value.appointmentDate);
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
