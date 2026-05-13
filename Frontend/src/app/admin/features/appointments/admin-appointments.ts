import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { finalize } from 'rxjs';
import { AppointmentsService } from '../../../core/services/appointments-service';
import { ToastService } from '../../../core/services/toast-service';
import { Appointment, AppointmentQueryParams, AppointmentSettings, AppointmentStatus } from '../../../types/appointment';
import { ImageZoomGallery, ImageZoomGalleryItem } from '../../../shared/image-zoom-gallery/image-zoom-gallery';
import { DatePickerModule } from 'primeng/datepicker';
import { toDateOnly } from '../../../shared/helpers/date-time-helper';

@Component({
  selector: 'app-admin-appointments',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    TableModule,
    TagModule,
    ImageZoomGallery,
    DatePickerModule
  ],
  templateUrl: './admin-appointments.html',
  styleUrls: ['./admin-appointments.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminAppointments implements OnInit {
  private appointmentsService = inject(AppointmentsService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  appointments = this.appointmentsService.appointments;
  settings = this.appointmentsService.settings;
  realtimeConnected = this.appointmentsService.realtimeConnected;
  totalRecords = computed(() => this.appointmentsService.pagination()?.totalItems ?? 0);

  loading = signal(false);
  savingSettings = signal(false);
  detailsDialog = signal(false);
  selectedAppointment = signal<Appointment | null>(null);

  rows = 10;
  first = 0;
  sortBy = 'appointmentDate';
  sortDirection: 'asc' | 'desc' = 'desc';

  statusOptions = [
    { label: 'All statuses', value: null },
    { label: 'Pending', value: 'Pending' },
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'Cancelled', value: 'Cancelled' },
    { label: 'Completed', value: 'Completed' },
  ];

  filterForm = this.fb.group({
    search: [''],
    status: [null as AppointmentStatus | null],
    fromDate: [''],
    toDate: [''],
  });

  settingsForm = this.fb.group({
    sendConfirmationNotifications: [true],
    sendEmail: [true],
    sendSms: [false],
  });

  ngOnInit() {
    this.loadAppointments();
    this.loadSettings();
  }

  loadAppointments(params: Partial<AppointmentQueryParams> = {}) {
    this.loading.set(true);

    this.appointmentsService
      .loadAppointments({
        pageNumber: Math.floor(this.first / this.rows) + 1,
        pageSize: this.rows,
        search: this.filterForm.value.search?.trim(),
        status: this.filterForm.value.status,
        fromDate: toDateOnly(this.filterForm.value.fromDate),
        toDate: toDateOnly(this.filterForm.value.toDate),
        sortBy: this.sortBy,
        sortDirection: this.sortDirection,
        ...params,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        error: () => this.toastService.showError('Could not load appointments'),
      });
  }

  loadSettings() {
    this.appointmentsService.loadSettings().subscribe({
      next: (settings) => this.settingsForm.patchValue(settings),
      error: () => this.toastService.showError('Could not load appointment settings'),
    });
  }

  onTableLazyLoad(event: TableLazyLoadEvent) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? this.rows;

    const sortField = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;
    this.sortBy = sortField || this.sortBy;
    this.sortDirection = event.sortOrder === -1 ? 'desc' : 'asc';

    this.loadAppointments();
  }

  applyFilters() {
    this.first = 0;
    this.loadAppointments();
  }

  clearFilters() {
    this.filterForm.reset({ search: '', status: null, fromDate: '', toDate: '' });
    this.first = 0;
    this.loadAppointments();
  }

  saveSettings() {
    this.savingSettings.set(true);
    this.appointmentsService
      .updateSettings(this.settingsForm.getRawValue() as AppointmentSettings)
      .pipe(finalize(() => this.savingSettings.set(false)))
      .subscribe({
        next: () => this.toastService.showSuccess('Appointment settings updated'),
        error: () => this.toastService.showError('Could not update appointment settings'),
      });
  }

  confirm(appointment: Appointment) {
    this.appointmentsService.confirmAppointment(appointment.id).subscribe({
      next: (updated) => {
        this.selectedAppointment.update((selected) => selected?.id === updated.id ? updated : selected);
        this.toastService.showSuccess('Appointment confirmed');
      },
      error: () => this.toastService.showError('Could not confirm appointment'),
    });
  }

  cancel(appointment: Appointment) {
    this.appointmentsService.cancelAppointment(appointment.id).subscribe({
      next: (updated) => {
        this.selectedAppointment.update((selected) => selected?.id === updated.id ? updated : selected);
        this.toastService.showSuccess('Appointment cancelled');
      },
      error: () => this.toastService.showError('Could not cancel appointment'),
    });
  }

  complete(appointment: Appointment) {
    this.appointmentsService.completeAppointment(appointment.id).subscribe({
      next: (updated) => {
        this.selectedAppointment.update((selected) => selected?.id === updated.id ? updated : selected);
        this.toastService.showSuccess('Appointment completed');
      },
      error: () => this.toastService.showError('Could not complete appointment'),
    });
  }

  viewDetails(appointment: Appointment) {
    this.selectedAppointment.set(appointment);
    this.detailsDialog.set(true);
  }

  severity(status: AppointmentStatus) {
    return status === 'Confirmed'
      ? 'success'
      : status === 'Pending'
        ? 'warn'
        : status === 'Cancelled'
          ? 'danger'
          : 'info';
  }

  imageUrl(url?: string | null) {
    return this.appointmentsService.resolvePhotoUrl(url);
  }

  appointmentImages(appointment: Appointment): ImageZoomGalleryItem[] {
    return appointment.photos.map((photo, index) => ({
      src: this.imageUrl(photo.url),
      alt: `Appointment reference ${index + 1}`,
    }));
  }
}
