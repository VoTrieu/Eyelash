import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { finalize } from 'rxjs';
import { HomePageSettingsService } from '../../../core/services/home-page-settings-service';
import { ToastService } from '../../../core/services/toast-service';
import { UpdateHomePageSettings } from '../../../types/home-page-settings';

@Component({
  selector: 'app-admin-home-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    FileUploadModule,
    InputTextModule,
    TextareaModule,
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
  settings = this.homePageSettingsService.settings;
  heroMainImage = signal<File | null>(null);
  heroSecondaryImage = signal<File | null>(null);
  heroLogoImage = signal<File | null>(null);
  heroMainPreview = signal<string | null>(null);
  heroSecondaryPreview = signal<string | null>(null);
  heroLogoPreview = signal<string | null>(null);

  form = this.formBuilder.nonNullable.group({
    heroEyebrow: ['', Validators.required],
    heroTitle: ['', Validators.required],
    heroSubtitle: ['', Validators.required],
    primaryButtonLabel: ['', Validators.required],
    primaryButtonLink: ['', Validators.required],
    secondaryButtonLabel: ['', Validators.required],
    secondaryButtonLink: ['', Validators.required],
    heroMainImageUrl: ['', Validators.required],
    heroSecondaryImageUrl: ['', Validators.required],
    heroLogoUrl: ['', Validators.required],
    statOneValue: ['', Validators.required],
    statOneLabel: ['', Validators.required],
    statTwoValue: ['', Validators.required],
    statTwoLabel: ['', Validators.required],
    statThreeValue: ['', Validators.required],
    statThreeLabel: ['', Validators.required],
    signatureTitle: ['', Validators.required],
    signatureBody: ['', Validators.required],
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
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (settings) => {
          this.form.patchValue(settings);
          this.clearSelectedImages();
          this.toastService.showSuccess('Home page settings saved');
        },
      });
  }

  previewImage(url?: string | null, localPreview?: string | null) {
    if (localPreview) return localPreview;
    return this.homePageSettingsService.resolveImageUrl(url);
  }

  onHeroImageSelected(
    imageType: 'main' | 'secondary' | 'logo',
    event: { currentFiles?: File[]; files?: File[] }
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

  private clearSelectedImages() {
    this.heroMainImage.set(null);
    this.heroSecondaryImage.set(null);
    this.heroLogoImage.set(null);
    this.heroMainPreview.set(null);
    this.heroSecondaryPreview.set(null);
    this.heroLogoPreview.set(null);
  }
}
