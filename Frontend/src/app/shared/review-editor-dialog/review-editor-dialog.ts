import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal, effect, inject, input, output, signal, untracked, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ReviewsService } from '../../core/services/reviews-service';
import { Review, ReviewFormValue } from '../../types/review';
import { Photo, Service } from '../../types/service';

export interface ReviewEditorSaveEvent {
  value: ReviewFormValue;
  photos: File[];
  deletePhotoIds: number[];
}

@Component({
  selector: 'app-review-editor-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    FileUploadModule,
    InputNumberModule,
    InputTextModule,
    RatingModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './review-editor-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewEditorDialog {
  private fb = inject(FormBuilder);
  private reviewsService = inject(ReviewsService);
  private fileUpload: Signal<FileUpload | undefined> = viewChild('uploadFile');

  visible = input(false);
  header = input('Review');
  review = input<Review | null>(null);
  services = input<Service[]>([]);
  saving = input(false);
  submitLabel = input('Save');
  showPublishedControl = input(false);
  showAppointmentId = input(false);
  showPhotos = input(false);
  maxPhotoCount = input<number | null>(null);
  defaultPublished = input(false);

  visibleChange = output<boolean>();
  save = output<ReviewEditorSaveEvent>();

  selectedFiles = signal<File[]>([]);
  existingPhotos = signal<Photo[]>([]);
  deletePhotoIds = signal<number[]>([]);
  private wasVisible = false;
  private resetReviewId: number | null = null;

  reviewForm = this.fb.group({
    clientName: ['', Validators.required],
    clientEmail: ['', Validators.email],
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', Validators.required],
    service: [null as Service | null, Validators.required],
    appointmentId: [null as number | null],
    isPublished: [false],
  });

  constructor() {
    effect(() => {
      const visible = this.visible();
      const review = this.review();
      const reviewId = review?.id ?? null;
      const shouldReset = visible && (!this.wasVisible || this.resetReviewId !== reviewId);

      if (shouldReset) {
        untracked(() => this.resetForm(review));
      }

      this.wasVisible = visible;
      this.resetReviewId = visible ? reviewId : null;
    });
  }

  onVisibleChange(visible: boolean) {
    this.visibleChange.emit(visible);
  }

  onPhotosSelected(event: { currentFiles?: File[]; files?: File[] }) {
    const files = [...(event.currentFiles || event.files || [])];
    const maxPhotoCount = this.maxPhotoCount();

    this.selectedFiles.set(maxPhotoCount ? files.slice(0, maxPhotoCount) : files);
  }

  removeExistingPhoto(photo: Photo) {
    this.existingPhotos.update((photos) => photos.filter((p) => p.id !== photo.id));
    this.deletePhotoIds.update((ids) => [...ids, photo.id]);
  }

  submit() {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const value = this.reviewForm.getRawValue();
    const service = value.service;
    if (!service) return;

    this.save.emit({
      value: {
        clientName: value.clientName ?? '',
        clientEmail: value.clientEmail,
        rating: value.rating ?? 5,
        comment: value.comment,
        serviceId: service.id,
        appointmentId: value.appointmentId,
        isPublished: value.isPublished ?? false,
      },
      photos: this.selectedFiles(),
      deletePhotoIds: this.deletePhotoIds(),
    });
  }

  imageUrl(url?: string | null) {
    return this.reviewsService.resolvePhotoUrl(url);
  }

  private resetForm(review: Review | null) {
    this.selectedFiles.set([]);
    this.existingPhotos.set(review?.photos ?? []);
    this.deletePhotoIds.set([]);
    this.fileUpload()?.clear();

    this.reviewForm.reset({
      clientName: review?.clientName ?? '',
      clientEmail: review?.clientEmail ?? '',
      rating: review?.rating ?? 5,
      comment: review?.comment ?? '',
      service: this.findService(review?.serviceId),
      appointmentId: review?.appointmentId ?? null,
      isPublished: review?.isPublished ?? this.defaultPublished(),
    });
  }

  private findService(serviceId?: number | null) {
    if (!serviceId) return null;

    return this.services().find((service) => service.id === serviceId) ?? null;
  }
}
