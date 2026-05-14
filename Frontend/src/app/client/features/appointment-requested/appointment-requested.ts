import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { finalize } from 'rxjs';
import { AppointmentsService } from '../../../core/services/appointments-service';
import { ToastService } from '../../../core/services/toast-service';
import { Appointment, AppointmentStatus } from '../../../types/appointment';

@Component({
  selector: 'app-appointment-requested',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterLink, TagModule],
  templateUrl: './appointment-requested.html',
  styleUrls: ['./appointment-requested.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentRequested implements OnInit {
  private route = inject(ActivatedRoute);
  private appointmentsService = inject(AppointmentsService);
  private toastService = inject(ToastService);

  appointment = signal<Appointment | null>(null);
  loading = signal(false);

  servicesLabel = computed(() => {
    const appointment = this.appointment();
    if (!appointment?.services.length) return 'No services selected';
    return appointment.services.map((service) => service.name).join(', ');
  });

  totalDuration = computed(() => {
    const appointment = this.appointment();
    if (!appointment) return 0;
    return appointment.services.reduce((total, service) => total + service.durationInMinutes, 0);
  });

  totalPrice = computed(() => {
    const appointment = this.appointment();
    if (!appointment) return 0;
    return appointment.services.reduce((total, service) => total + service.price, 0);
  });

  ngOnInit() {
    const appointmentId = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(appointmentId) || appointmentId <= 0) {
      this.toastService.showError('Invalid appointment request');
      return;
    }

    this.loading.set(true);
    this.appointmentsService
      .getAppointment(appointmentId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (appointment) => this.appointment.set(appointment)
      });
  }

  statusSeverity(status: AppointmentStatus) {
    return status === 'Confirmed'
      ? 'success'
      : status === 'Pending'
        ? 'warn'
        : status === 'Cancelled'
          ? 'danger'
          : 'info';
  }
}
