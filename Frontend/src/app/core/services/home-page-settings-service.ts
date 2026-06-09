import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  defaultHomePageSettings,
  HomePageSettings,
  UpdateHomePageSettings,
} from '../../types/home-page-settings';
import { resolveMediaUrl } from '../helpers/media-url-helper';

@Injectable({
  providedIn: 'root',
})
export class HomePageSettingsService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private mediaUrl = environment.apiUrl.replace(/api\/?$/, '');

  settings = signal<HomePageSettings>(defaultHomePageSettings);

  loadSettings() {
    return this.http.get<HomePageSettings>(this.baseUrl + 'homepagesettings').pipe(
      tap((settings) => this.settings.set(settings))
    );
  }

  updateSettings(
    settings: UpdateHomePageSettings,
    files: {
      heroMainImage?: File | null;
      heroSecondaryImage?: File | null;
      heroLogoImage?: File | null;
      galleryImageOne?: File | null;
      galleryImageTwo?: File | null;
      galleryImageThree?: File | null;
      galleryImageFour?: File | null;
      galleryImageFive?: File | null;
      galleryImageSix?: File | null;
    } = {}
  ) {
    return this.http.put<HomePageSettings>(this.baseUrl + 'homepagesettings', this.toFormData(settings, files)).pipe(
      tap((updatedSettings) => this.settings.set(updatedSettings))
    );
  }

  resolveImageUrl(url?: string | null) {
    return resolveMediaUrl(url, this.mediaUrl);
  }

  private toFormData(
    settings: UpdateHomePageSettings,
    files: {
      heroMainImage?: File | null;
      heroSecondaryImage?: File | null;
      heroLogoImage?: File | null;
      galleryImageOne?: File | null;
      galleryImageTwo?: File | null;
      galleryImageThree?: File | null;
      galleryImageFour?: File | null;
      galleryImageFive?: File | null;
      galleryImageSix?: File | null;
    }
  ) {
    const formData = new FormData();

    Object.entries(settings).forEach(([key, value]) => {
      if (typeof value === 'boolean') {
        formData.append(key, String(value));
        return;
      }

      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    if (files.heroMainImage) {
      formData.append('heroMainImage', files.heroMainImage);
    }

    if (files.heroSecondaryImage) {
      formData.append('heroSecondaryImage', files.heroSecondaryImage);
    }

    if (files.heroLogoImage) {
      formData.append('heroLogoImage', files.heroLogoImage);
    }

    if (files.galleryImageOne) {
      formData.append('galleryImageOne', files.galleryImageOne);
    }

    if (files.galleryImageTwo) {
      formData.append('galleryImageTwo', files.galleryImageTwo);
    }

    if (files.galleryImageThree) {
      formData.append('galleryImageThree', files.galleryImageThree);
    }

    if (files.galleryImageFour) {
      formData.append('galleryImageFour', files.galleryImageFour);
    }

    if (files.galleryImageFive) {
      formData.append('galleryImageFive', files.galleryImageFive);
    }

    if (files.galleryImageSix) {
      formData.append('galleryImageSix', files.galleryImageSix);
    }

    return formData;
  }
}
