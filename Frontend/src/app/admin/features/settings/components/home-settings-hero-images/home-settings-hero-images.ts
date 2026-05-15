import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';

export type HeroImageType = 'main' | 'secondary' | 'logo';

export interface ImageSelectEvent {
  currentFiles?: File[];
  files?: File[];
}

@Component({
  selector: 'app-home-settings-hero-images',
  standalone: true,
  imports: [ReactiveFormsModule, CardModule, FileUploadModule],
  templateUrl: './home-settings-hero-images.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeSettingsHeroImages {
  form = input.required<FormGroup>();
  heroMainPreview = input<string | null>(null);
  heroSecondaryPreview = input<string | null>(null);
  heroLogoPreview = input<string | null>(null);
  previewImage = input.required<(url?: string | null, localPreview?: string | null) => string>();

  imageSelected = output<{ imageType: HeroImageType; event: ImageSelectEvent }>();

  selectImage(imageType: HeroImageType, event: ImageSelectEvent) {
    this.imageSelected.emit({ imageType, event });
  }
}
