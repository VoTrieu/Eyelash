import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReviewCard } from '../review-card/review-card';
import { Review } from '../../../types/review';

@Component({
  selector: 'app-home-reviews-preview',
  standalone: true,
  imports: [ReviewCard, RouterLink],
  templateUrl: './home-reviews-preview.html',
  styleUrls: ['./home-reviews-preview.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeReviewsPreview {
  reviews = input.required<Review[]>();
  loading = input(false);
  error = input(false);
}
