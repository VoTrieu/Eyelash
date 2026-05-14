import { ChangeDetectionStrategy, Component, computed, inject, OnInit, Signal, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { finalize } from 'rxjs';
import { ReviewsService } from '../../../core/services/reviews-service';
import { ServicesService } from '../../../core/services/services-service';
import { ToastService } from '../../../core/services/toast-service';
import { ConfirmDialogService } from '../../../shared/confirm-dialog/confirm-dialog-service';
import { Review, ReviewFormValue, ReviewQueryParams } from '../../../types/review';
import { Photo, Service } from '../../../types/service';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    FileUploadModule,
    InputNumberModule,
    InputTextModule,
    RatingModule,
    SelectModule,
    TableModule,
    TagModule,
    TextareaModule,
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
  private fileUpload: Signal<FileUpload | undefined> = viewChild('uploadFile');

  reviews = this.reviewsService.reviews;
  services = this.servicesService.services;
  totalRecords = computed(() => this.reviewsService.pagination()?.totalItems ?? 0);

  loading = signal(false);
  saving = signal(false);
  displayDialog = signal(false);
  isEditing = signal(false);
  editingId = signal<number | null>(null);
  selectedFiles = signal<File[]>([]);
  existingPhotos = signal<Photo[]>([]);
  deletePhotoIds = signal<number[]>([]);

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

  reviewForm = this.fb.group({
    clientName: ['', Validators.required],
    clientEmail: ['', Validators.email],
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: [''],
    serviceId: [null as number | null, Validators.required],
    appointmentId: [null as number | null],
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
    this.selectedFiles.set([]);
    this.existingPhotos.set([]);
    this.deletePhotoIds.set([]);
    this.fileUpload()?.clear();
    this.reviewForm.reset({
      clientName: '',
      clientEmail: '',
      rating: 5,
      comment: '',
      serviceId: null,
      appointmentId: null,
    });
    this.displayDialog.set(true);
  }

  editReview(review: Review) {
    this.isEditing.set(true);
    this.editingId.set(review.id);
    this.selectedFiles.set([]);
    this.existingPhotos.set(review.photos);
    this.deletePhotoIds.set([]);
    this.fileUpload()?.clear();
    this.reviewForm.reset({
      clientName: review.clientName,
      clientEmail: review.clientEmail ?? '',
      rating: review.rating,
      comment: review.comment ?? '',
      serviceId: review.serviceId,
      appointmentId: review.appointmentId ?? null,
    });
    this.displayDialog.set(true);
  }

  removeExistingPhoto(photo: Photo) {
    this.existingPhotos.update((photos) => photos.filter((p) => p.id !== photo.id));
    this.deletePhotoIds.update((ids) => [...ids, photo.id]);
  }

  onPhotosSelected(event: any) {
    const files = event.currentFiles || event.files || [];
    this.selectedFiles.set([...files]);
  }

  saveReview() {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const value = this.reviewForm.getRawValue() as ReviewFormValue;
    this.saving.set(true);

    const request = this.isEditing() && this.editingId() !== null
      ? this.reviewsService.updateReview(
        this.editingId()!,
        value,
        this.selectedFiles(),
        this.deletePhotoIds()
      )
      : this.reviewsService.createReview(value, this.selectedFiles());

    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.displayDialog.set(false);
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
