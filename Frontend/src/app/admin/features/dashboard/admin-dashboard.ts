import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { forkJoin, finalize } from 'rxjs';
import { AppointmentsService } from '../../../core/services/appointments-service';
import { ReviewsService } from '../../../core/services/reviews-service';
import { ToastService } from '../../../core/services/toast-service';
import { toDateOnly } from '../../../shared/helpers/date-time-helper';
import { Appointment, AppointmentStatus } from '../../../types/appointment';
import { Review } from '../../../types/review';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterLink, TagModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboard implements OnInit {
  private appointmentsService = inject(AppointmentsService);
  private reviewsService = inject(ReviewsService);
  private toastService = inject(ToastService);

  loading = signal(false);
  todayAppointments = signal<Appointment[]>([]);
  latestReviews = signal<Review[]>([]);
  todayAppointmentCount = signal(0);
  pendingAppointmentCount = signal(0);
  averageLatestRating = signal(0);

  today = toDateOnly(new Date())!;

  private realtimeRefreshEffect = effect(() => {
    const version = this.appointmentsService.realtimeAppointmentVersion();

    if (version > 0) {
      queueMicrotask(() => this.loadDashboard());
    }
  });

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading.set(true);

    forkJoin({
      todayAppointments: this.appointmentsService.loadAppointments({
        pageNumber: 1,
        pageSize: 6,
        fromDate: this.today,
        toDate: this.today,
        sortBy: 'appointmentDate',
        sortDirection: 'asc',
      }),
      pendingAppointments: this.appointmentsService.loadAppointments({
        pageNumber: 1,
        pageSize: 1,
        status: 'Pending',
      }),
      latestReviews: this.reviewsService.loadReviews({
        pageNumber: 1,
        pageSize: 4,
        sortBy: 'created',
        sortDirection: 'desc',
      }),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ todayAppointments, pendingAppointments, latestReviews }) => {
          this.todayAppointments.set(todayAppointments.items);
          this.todayAppointmentCount.set(todayAppointments.metadata.totalItems);
          this.pendingAppointmentCount.set(pendingAppointments.metadata.totalItems);
          this.latestReviews.set(latestReviews.items);
          this.averageLatestRating.set(this.getAverageRating(latestReviews.items));
        },
        error: () => this.toastService.showError('Could not load dashboard'),
      });
  }

  confirmAppointment(appointment: Appointment) {
    this.appointmentsService.confirmAppointment(appointment.id).subscribe({
      next: (updated) => {
        this.todayAppointments.update((appointments) =>
          appointments.map((item) => (item.id === updated.id ? updated : item))
        );
        if (appointment.status === 'Pending') {
          this.pendingAppointmentCount.update((count) => Math.max(0, count - 1));
        }
        this.toastService.showSuccess('Appointment confirmed');
      },
      error: () => this.toastService.showError('Could not confirm appointment'),
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

  servicesLabel(appointment: Appointment) {
    if (!appointment.services.length) return 'No services selected';
    return appointment.services.map((service) => service.name).join(', ');
  }

  private getAverageRating(reviews: Review[]) {
    if (!reviews.length) return 0;
    const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    return Math.round(average * 10) / 10;
  }
}
