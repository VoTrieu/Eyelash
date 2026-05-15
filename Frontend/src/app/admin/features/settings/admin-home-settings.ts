import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { finalize } from 'rxjs';
import { HomePageSettingsService } from '../../../core/services/home-page-settings-service';
import { ToastService } from '../../../core/services/toast-service';
import { UpdateHomePageSettings } from '../../../types/home-page-settings';
import {
  HeroImageType,
  ImageSelectEvent as HeroImageSelectEvent,
  HomeSettingsHeroImages,
} from './components/home-settings-hero-images/home-settings-hero-images';
import {
  GalleryImageType,
  ImageSelectEvent as GalleryImageSelectEvent,
  HomeSettingsGalleryImages,
} from './components/home-settings-gallery-images/home-settings-gallery-images';
import { HomeSettingsHeroCopy } from './components/home-settings-hero-copy/home-settings-hero-copy';
import { HomeSettingsStatsSignature } from './components/home-settings-stats-signature/home-settings-stats-signature';
import { HomeSettingsVisibleSections } from './components/home-settings-visible-sections/home-settings-visible-sections';
import { HomeSettingsContactDetails } from './components/home-settings-contact-details/home-settings-contact-details';

@Component({
  selector: 'app-admin-home-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    HomeSettingsHeroCopy,
    HomeSettingsGalleryImages,
    HomeSettingsStatsSignature,
    HomeSettingsHeroImages,
    HomeSettingsVisibleSections,
    HomeSettingsContactDetails,
  ],
  templateUrl: './admin-home-settings.html',
  styleUrls: ['./admin-home-settings.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminHomeSettings implements OnInit {
  private formBuilder = inject(FormBuilder);
  private homePageSettingsService = inject(HomePageSettingsService);
  private toastService = inject(ToastService);

  loading = signal(false);
  saving = signal(false);
  saveAttempted = signal(false);
  settings = this.homePageSettingsService.settings;
  heroMainImage = signal<File | null>(null);
  heroSecondaryImage = signal<File | null>(null);
  heroLogoImage = signal<File | null>(null);
  heroMainPreview = signal<string | null>(null);
  heroSecondaryPreview = signal<string | null>(null);
  heroLogoPreview = signal<string | null>(null);
  galleryImageOne = signal<File | null>(null);
  galleryImageTwo = signal<File | null>(null);
  galleryImageThree = signal<File | null>(null);
  galleryImageFour = signal<File | null>(null);
  galleryImageFive = signal<File | null>(null);
  galleryImageSix = signal<File | null>(null);
  galleryImageOnePreview = signal<string | null>(null);
  galleryImageTwoPreview = signal<string | null>(null);
  galleryImageThreePreview = signal<string | null>(null);
  galleryImageFourPreview = signal<string | null>(null);
  galleryImageFivePreview = signal<string | null>(null);
  galleryImageSixPreview = signal<string | null>(null);

  form = this.formBuilder.nonNullable.group({
    heroEyebrow: ['', Validators.required],
    heroTitle: ['', Validators.required],
    heroSubtitle: ['', Validators.required],
    primaryButtonLabel: ['', Validators.required],
    primaryButtonLink: ['', Validators.required],
    secondaryButtonLabel: ['', Validators.required],
    secondaryButtonLink: ['', Validators.required],
    heroMainImageUrl: [''],
    heroSecondaryImageUrl: [''],
    heroLogoUrl: [''],
    galleryImageOneUrl: [''],
    galleryImageOneTitle: ['', Validators.required],
    galleryImageTwoUrl: [''],
    galleryImageTwoTitle: ['', Validators.required],
    galleryImageThreeUrl: [''],
    galleryImageThreeTitle: ['', Validators.required],
    galleryImageFourUrl: [''],
    galleryImageFourTitle: ['', Validators.required],
    galleryImageFiveUrl: [''],
    galleryImageFiveTitle: ['', Validators.required],
    galleryImageSixUrl: [''],
    galleryImageSixTitle: ['', Validators.required],
    statOneValue: ['', Validators.required],
    statOneLabel: ['', Validators.required],
    statTwoValue: ['', Validators.required],
    statTwoLabel: ['', Validators.required],
    statThreeValue: ['', Validators.required],
    statThreeLabel: ['', Validators.required],
    signatureTitle: ['', Validators.required],
    signatureBody: ['', Validators.required],
    studioAddress: ['', Validators.required],
    studioLatitude: [43.768588, Validators.required],
    studioLongitude: [-79.4159027, Validators.required],
    studioEmail: ['', [Validators.required, Validators.email]],
    studioPhone: [''],
    showServicesSection: [true],
    showGallerySection: [true],
    showReviewsSection: [true],
    showVisitSection: [true],
  });

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    this.loading.set(true);
    this.homePageSettingsService
      .loadSettings()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (settings) => {
          this.form.patchValue(settings);
          this.clearSelectedImages();
        },
      });
  }

  saveSettings() {
    this.saveAttempted.set(true);

    if(this.form.untouched) {
      this.toastService.showInfo('No changes to save');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.homePageSettingsService
      .updateSettings(this.form.getRawValue() as UpdateHomePageSettings, {
        heroMainImage: this.heroMainImage(),
        heroSecondaryImage: this.heroSecondaryImage(),
        heroLogoImage: this.heroLogoImage(),
        galleryImageOne: this.galleryImageOne(),
        galleryImageTwo: this.galleryImageTwo(),
        galleryImageThree: this.galleryImageThree(),
        galleryImageFour: this.galleryImageFour(),
        galleryImageFive: this.galleryImageFive(),
        galleryImageSix: this.galleryImageSix(),
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (settings) => {
          this.form.patchValue(settings);
          this.clearSelectedImages();
          this.saveAttempted.set(false);
          this.toastService.showSuccess('Home page settings saved');
        },
      });
  }

  previewImage = (url?: string | null, localPreview?: string | null) => {
    if (localPreview) return localPreview;
    return this.homePageSettingsService.resolveImageUrl(url);
  };

  onHeroImageSelected(
    imageType: HeroImageType,
    event: HeroImageSelectEvent
  ) {
    const file = (event.currentFiles || event.files || [])[0] ?? null;
    const preview = file ? URL.createObjectURL(file) : null;

    if (imageType === 'main') {
      this.heroMainImage.set(file);
      this.heroMainPreview.set(preview);
      return;
    }

    if (imageType === 'secondary') {
      this.heroSecondaryImage.set(file);
      this.heroSecondaryPreview.set(preview);
      return;
    }

    this.heroLogoImage.set(file);
    this.heroLogoPreview.set(preview);
  }

  onGalleryImageSelected(
    imageType: GalleryImageType,
    event: GalleryImageSelectEvent
  ) {
    const file = (event.currentFiles || event.files || [])[0] ?? null;
    const preview = file ? URL.createObjectURL(file) : null;

    if (imageType === 'one') {
      this.galleryImageOne.set(file);
      this.galleryImageOnePreview.set(preview);
      return;
    }

    if (imageType === 'two') {
      this.galleryImageTwo.set(file);
      this.galleryImageTwoPreview.set(preview);
      return;
    }

    if (imageType === 'three') {
      this.galleryImageThree.set(file);
      this.galleryImageThreePreview.set(preview);
      return;
    }

    if (imageType === 'four') {
      this.galleryImageFour.set(file);
      this.galleryImageFourPreview.set(preview);
      return;
    }

    if (imageType === 'five') {
      this.galleryImageFive.set(file);
      this.galleryImageFivePreview.set(preview);
      return;
    }

    this.galleryImageSix.set(file);
    this.galleryImageSixPreview.set(preview);
  }

  private clearSelectedImages() {
    this.saveAttempted.set(false);
    this.heroMainImage.set(null);
    this.heroSecondaryImage.set(null);
    this.heroLogoImage.set(null);
    this.heroMainPreview.set(null);
    this.heroSecondaryPreview.set(null);
    this.heroLogoPreview.set(null);
    this.galleryImageOne.set(null);
    this.galleryImageTwo.set(null);
    this.galleryImageThree.set(null);
    this.galleryImageFour.set(null);
    this.galleryImageFive.set(null);
    this.galleryImageSix.set(null);
    this.galleryImageOnePreview.set(null);
    this.galleryImageTwoPreview.set(null);
    this.galleryImageThreePreview.set(null);
    this.galleryImageFourPreview.set(null);
    this.galleryImageFivePreview.set(null);
    this.galleryImageSixPreview.set(null);
  }
}
