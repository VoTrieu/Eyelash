import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { finalize } from 'rxjs';
import { ReviewsService } from '../../../core/services/reviews-service';
import { ServicesService } from '../../../core/services/services-service';
import { ToastService } from '../../../core/services/toast-service';
import { ConfirmDialogService } from '../../../shared/confirm-dialog/confirm-dialog-service';
import { ReviewEditorDialog, ReviewEditorSaveEvent } from '../../../shared/review-editor-dialog/review-editor-dialog';
import { Review, ReviewFormValue, ReviewQueryParams } from '../../../types/review';
import { Service } from '../../../types/service';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    RatingModule,
    SelectModule,
    TableModule,
    TagModule,
    ReviewEditorDialog,
  ],
  templateUrl: './admin-reviews.html',
  styleUrls: ['./admin-reviews.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminReviews implements OnInit {
  private reviewsService = inject(ReviewsService);
  private servicesService = inject(ServicesService);
  private toastService = inject(ToastService);
  private confirmDialogService = inject(ConfirmDialogService);
  private fb = inject(FormBuilder);

  reviews = this.reviewsService.reviews;
  services = this.servicesService.services;
  totalRecords = computed(() => this.reviewsService.pagination()?.totalItems ?? 0);

  loading = signal(false);
  saving = signal(false);
  displayDialog = signal(false);
  isEditing = signal(false);
  editingId = signal<number | null>(null);
  editingReview = signal<Review | null>(null);

  rows = 10;
  first = 0;
  sortBy = 'created';
  sortDirection: 'asc' | 'desc' = 'desc';

  ratingOptions = [
    { label: 'All ratings', value: null },
    { label: '5 stars', value: 5 },
    { label: '4 stars', value: 4 },
    { label: '3 stars', value: 3 },
    { label: '2 stars', value: 2 },
    { label: '1 star', value: 1 },
  ];

  filterForm = this.fb.group({
    search: [''],
    serviceId: [null as number | null],
    rating: [null as number | null],
  });

  ngOnInit() {
    this.loadServices();
    this.loadReviews();
  }

  loadReviews(params: Partial<ReviewQueryParams> = {}) {
    this.loading.set(true);

    this.reviewsService
      .loadReviews({
        pageNumber: Math.floor(this.first / this.rows) + 1,
        pageSize: this.rows,
        search: this.filterForm.value.search?.trim(),
        serviceId: this.filterForm.value.serviceId,
        rating: this.filterForm.value.rating,
        sortBy: this.sortBy,
        sortDirection: this.sortDirection,
        ...params,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe();
  }

  loadServices() {
    this.servicesService.loadServices({ pageSize: 50, sortBy: 'name', sortDirection: 'asc' }).subscribe();
  }

  onTableLazyLoad(event: TableLazyLoadEvent) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? this.rows;

    const sortField = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;
    this.sortBy = sortField || this.sortBy;
    this.sortDirection = event.sortOrder === -1 ? 'desc' : 'asc';

    this.loadReviews();
  }

  applyFilters() {
    this.first = 0;
    this.loadReviews();
  }

  clearFilters() {
    this.filterForm.reset({ search: '', serviceId: null, rating: null });
    this.first = 0;
    this.loadReviews();
  }

  openNew() {
    this.isEditing.set(false);
    this.editingId.set(null);
    this.editingReview.set(null);
    this.displayDialog.set(true);
  }

  editReview(review: Review) {
    this.isEditing.set(true);
    this.editingId.set(review.id);
    this.editingReview.set(review);
    this.displayDialog.set(true);
  }

  togglePublished(review: Review) {
    const value: ReviewFormValue = {
      clientName: review.clientName,
      clientEmail: review.clientEmail,
      rating: review.rating,
      comment: review.comment,
      serviceId: review.serviceId,
      appointmentId: review.appointmentId,
      isPublished: !review.isPublished,
    };

    this.reviewsService.updateReview(review.id, value).subscribe({
      next: () => {
        this.toastService.showSuccess(value.isPublished ? 'Review published' : 'Review hidden');
        this.loadReviews();
      }
    });
  }

  saveReview(event: ReviewEditorSaveEvent) {
    this.saving.set(true);

    const request = this.isEditing() && this.editingId() !== null
      ? this.reviewsService.updateReview(
        this.editingId()!,
        event.value,
        event.photos,
        event.deletePhotoIds
      )
      : this.reviewsService.createReview(event.value, event.photos);

    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.displayDialog.set(false);
        this.editingReview.set(null);
        this.toastService.showSuccess(this.isEditing() ? 'Review updated' : 'Review created');
        this.loadReviews();
      }
    });
  }

  async deleteReview(review: Review) {
    const confirmed = await this.confirmDialogService.confirm({
      title: 'Delete review?',
      message: `Delete the review from ${review.clientName}?`,
      details: 'The review and its uploaded photos will be removed permanently.',
      confirmLabel: 'Delete review',
      severity: 'danger',
    });

    if (!confirmed) return;

    this.reviewsService.deleteReview(review.id).subscribe({
      next: () => {
        this.toastService.showSuccess('Review deleted');
        this.loadReviews();
      }
    });
  }

  serviceOptions() {
    return this.services().map((service: Service) => ({
      label: service.name,
      value: service.id,
    }));
  }

  imageUrl(url?: string | null) {
    return this.reviewsService.resolvePhotoUrl(url);
  }
}
