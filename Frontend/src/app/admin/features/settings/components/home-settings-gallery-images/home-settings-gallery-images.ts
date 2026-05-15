import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';

export type GalleryImageType = 'one' | 'two' | 'three' | 'four' | 'five' | 'six';

export interface ImageSelectEvent {
  currentFiles?: File[];
  files?: File[];
}

interface GalleryImageSlot {
  imageType: GalleryImageType;
  title: string;
  titleControl: string;
  urlControl: string;
}

@Component({
  selector: 'app-home-settings-gallery-images',
  standalone: true,
  imports: [ReactiveFormsModule, CardModule, FileUploadModule, InputTextModule],
  templateUrl: './home-settings-gallery-images.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeSettingsGalleryImages {
  form = input.required<FormGroup>();
  galleryImageOnePreview = input<string | null>(null);
  galleryImageTwoPreview = input<string | null>(null);
  galleryImageThreePreview = input<string | null>(null);
  galleryImageFourPreview = input<string | null>(null);
  galleryImageFivePreview = input<string | null>(null);
  galleryImageSixPreview = input<string | null>(null);
  previewImage = input.required<(url?: string | null, localPreview?: string | null) => string>();

  imageSelected = output<{ imageType: GalleryImageType; event: ImageSelectEvent }>();

  slots: GalleryImageSlot[] = [
    { imageType: 'one', title: 'Image 1 title', titleControl: 'galleryImageOneTitle', urlControl: 'galleryImageOneUrl' },
    { imageType: 'two', title: 'Image 2 title', titleControl: 'galleryImageTwoTitle', urlControl: 'galleryImageTwoUrl' },
    { imageType: 'three', title: 'Image 3 title', titleControl: 'galleryImageThreeTitle', urlControl: 'galleryImageThreeUrl' },
    { imageType: 'four', title: 'Image 4 title', titleControl: 'galleryImageFourTitle', urlControl: 'galleryImageFourUrl' },
    { imageType: 'five', title: 'Image 5 title', titleControl: 'galleryImageFiveTitle', urlControl: 'galleryImageFiveUrl' },
    { imageType: 'six', title: 'Image 6 title', titleControl: 'galleryImageSixTitle', urlControl: 'galleryImageSixUrl' },
  ];

  selectImage(imageType: GalleryImageType, event: ImageSelectEvent) {
    this.imageSelected.emit({ imageType, event });
  }

  previewFor(imageType: GalleryImageType) {
    if (imageType === 'one') return this.galleryImageOnePreview();
    if (imageType === 'two') return this.galleryImageTwoPreview();
    if (imageType === 'three') return this.galleryImageThreePreview();
    if (imageType === 'four') return this.galleryImageFourPreview();
    if (imageType === 'five') return this.galleryImageFivePreview();
    return this.galleryImageSixPreview();
  }
}
