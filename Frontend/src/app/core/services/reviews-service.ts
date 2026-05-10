import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedResult } from '../../types/pagination';
import { Review, ReviewFormValue, ReviewQueryParams } from '../../types/review';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private mediaUrl = environment.apiUrl.replace(/api\/?$/, '');

  reviews = signal<Review[]>([]);
  pagination = signal<PaginatedResult<Review>['metadata'] | null>(null);

  loadReviews(params: ReviewQueryParams = {}) {
    return this.http
      .get<PaginatedResult<Review>>(this.baseUrl + 'reviews', {
        params: this.buildParams(params),
      })
      .pipe(
        tap((result) => {
          this.reviews.set(result.items);
          this.pagination.set(result.metadata);
        })
      );
  }

  getReview(id: number) {
    return this.http.get<Review>(this.baseUrl + `reviews/${id}`);
  }

  createReview(review: ReviewFormValue, photos: File[] = []) {
    return this.http.post<Review>(this.baseUrl + 'reviews', this.toFormData(review, photos)).pipe(
      tap((createdReview) => {
        this.reviews.update((reviews) => [createdReview, ...reviews]);
      })
    );
  }

  updateReview(id: number, review: ReviewFormValue, photos: File[] = [], deletePhotoIds: number[] = []) {
    return this.http.put<Review>(this.baseUrl + `reviews/${id}`, this.toFormData(review, photos, deletePhotoIds)).pipe(
      tap((updatedReview) => {
        this.reviews.update((reviews) =>
          reviews.map((review) => (review.id === id ? updatedReview : review))
        );
      })
    );
  }

  deleteReview(id: number) {
    return this.http.delete(this.baseUrl + `reviews/${id}`).pipe(
      tap(() => {
        this.reviews.update((reviews) => reviews.filter((review) => review.id !== id));
      })
    );
  }

  resolvePhotoUrl(url?: string | null) {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return this.mediaUrl + url.replace(/^\//, '');
  }

  private buildParams(params: ReviewQueryParams) {
    const query: Record<string, string> = {};

    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined && value !== '') {
        query[key] = String(value);
      }
    }

    return query;
  }

  private toFormData(review: ReviewFormValue, photos: File[], deletePhotoIds: number[] = []) {
    const formData = new FormData();

    formData.append('clientName', review.clientName);
    formData.append('clientEmail', review.clientEmail ?? '');
    formData.append('rating', String(review.rating));
    formData.append('comment', review.comment ?? '');
    formData.append('serviceId', String(review.serviceId));

    if (review.appointmentId) {
      formData.append('appointmentId', String(review.appointmentId));
    }

    deletePhotoIds.forEach((id) => formData.append('deletePhotoIds', String(id)));
    photos.forEach((photo) => formData.append('photos', photo));

    return formData;
  }
}
