import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { ReviewsService } from '../../../core/services/reviews-service';
import { ImageGalleryDialog } from '../../../shared/image-gallery-dialog/image-gallery-dialog';
import { ImageZoomGalleryItem } from '../../../shared/image-zoom-gallery/image-zoom-gallery';
import { Review } from '../../../types/review';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, ImageGalleryDialog, RatingModule, TagModule],
  templateUrl: './review-card.html',
  styleUrls: ['./review-card.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewCard {
  private reviewsService = inject(ReviewsService);

  review = input.required<Review>();
  galleryVisible = signal(false);
  activeImageIndex = signal(0);

  images = computed<ImageZoomGalleryItem[]>(() =>
    this.review().photos.map((photo, index) => ({
      src: this.reviewsService.resolvePhotoUrl(photo.url),
      alt: `${this.review().clientName} review photo ${index + 1}`,
    }))
  );

  openGallery(index: number) {
    this.activeImageIndex.set(index);
    this.galleryVisible.set(true);
  }
}
