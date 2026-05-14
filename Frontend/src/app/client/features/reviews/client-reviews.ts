import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { finalize } from 'rxjs';
import { ReviewCard } from '../../components/review-card/review-card';
import { ReviewsService } from '../../../core/services/reviews-service';
import { ServicesService } from '../../../core/services/services-service';
import { Service } from '../../../types/service';

@Component({
  selector: 'app-client-reviews',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, SelectModule, ReviewCard],
  templateUrl: './client-reviews.html',
  styleUrls: ['./client-reviews.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientReviews implements OnInit {
  private reviewsService = inject(ReviewsService);
  private servicesService = inject(ServicesService);
  private fb = inject(FormBuilder);

  reviews = this.reviewsService.reviews;
  services = this.servicesService.services;
  loading = signal(false);
  totalRecords = computed(() => this.reviewsService.pagination()?.totalItems ?? 0);

  filterForm = this.fb.group({
    serviceId: [null as number | null],
    rating: [null as number | null],
  });

  ratingOptions = [
    { label: 'All ratings', value: null },
    { label: '5 stars', value: 5 },
    { label: '4 stars', value: 4 },
    { label: '3 stars', value: 3 },
    { label: '2 stars', value: 2 },
    { label: '1 star', value: 1 },
  ];

  ngOnInit() {
    this.loadServices();
    this.loadReviews();
  }

  loadReviews() {
    this.loading.set(true);
    this.reviewsService
      .loadReviews({
        pageNumber: 1,
        pageSize: 24,
        serviceId: this.filterForm.value.serviceId,
        rating: this.filterForm.value.rating,
        sortBy: 'created',
        sortDirection: 'desc',
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe();
  }

  loadServices() {
    this.servicesService.loadServices({ pageSize: 50, sortBy: 'name', sortDirection: 'asc' }).subscribe();
  }

  clearFilters() {
    this.filterForm.reset({ serviceId: null, rating: null });
    this.loadReviews();
  }

  serviceOptions() {
    return this.services().map((service: Service) => ({
      label: service.name,
      value: service.id,
    }));
  }
}
