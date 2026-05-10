import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Carousel } from "../carousel/carousel";
import { Map } from "../../../shared/map/map";
import { ReviewCard } from "../../components/review-card/review-card";
import { ReviewsService } from "../../../core/services/reviews-service";

@Component({
  selector: 'app-home',
  imports: [Carousel, Map, ReviewCard, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private reviewsService = inject(ReviewsService);

  reviews = this.reviewsService.reviews;
  homeReviews = computed(() => this.reviews().slice(0, 5));
  loadingReviews = signal(false);
  reviewsError = signal(false);

  ngOnInit() {
    this.loadReviews();
  }

  private loadReviews() {
    this.loadingReviews.set(true);
    this.reviewsError.set(false);

    this.reviewsService
      .loadReviews({
        pageNumber: 1,
        pageSize: 6,
        sortBy: 'created',
        sortDirection: 'desc',
      })
      .pipe(finalize(() => this.loadingReviews.set(false)))
      .subscribe({
        error: () => this.reviewsError.set(true),
      });
  }
}
