import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { ReviewsService } from "../../../core/services/reviews-service";
import { HomeGallerySection } from "../../components/home-gallery-section/home-gallery-section";
import { HomeHero } from "../../components/home-hero/home-hero";
import { HomeReviewsPreview } from "../../components/home-reviews-preview/home-reviews-preview";
import { HomeServicesPreview } from "../../components/home-services-preview/home-services-preview";
import { HomeVisitSection } from "../../components/home-visit-section/home-visit-section";

@Component({
  selector: 'app-home',
  imports: [
    HomeHero,
    HomeServicesPreview,
    HomeGallerySection,
    HomeReviewsPreview,
    HomeVisitSection
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private reviewsService = inject(ReviewsService);

  homeReviews = this.reviewsService.reviews;
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
