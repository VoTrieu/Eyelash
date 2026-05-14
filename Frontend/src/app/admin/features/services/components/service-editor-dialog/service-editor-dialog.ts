import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ServicesService } from '../../../../../core/services/services-service';
import { Photo, ServiceDetail, ServiceFormValue } from '../../../../../types/service';

export interface ServiceEditorSaveEvent {
  value: ServiceFormValue;
  photos: File[];
  deletePhotoIds: number[];
}

@Component({
  selector: 'app-service-editor-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    FileUploadModule,
    InputNumberModule,
    InputTextModule,
    TextareaModule,
  ],
  templateUrl: './service-editor-dialog.html',
  styleUrls: ['./service-editor-dialog.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceEditorDialog {
  private fb = inject(FormBuilder);
  private servicesService = inject(ServicesService);
  private fileUpload: Signal<FileUpload | undefined> = viewChild('uploadFile');
  private resetKey = '';

  visible = input(false);
  service = input<ServiceDetail | null>(null);
  saving = input(false);

  visibleChange = output<boolean>();
  save = output<ServiceEditorSaveEvent>();

  selectedFiles = signal<File[]>([]);
  existingPhotos = signal<Photo[]>([]);
  deletePhotoIds = signal<number[]>([]);
  isEditing = computed(() => !!this.service());

  serviceForm = this.fb.group({
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    description: ['', Validators.required],
    durationInMinutes: [30, [Validators.required, Validators.min(1)]],
    isAvailable: [true],
  });

  constructor() {
    effect(() => {
      const visible = this.visible();
      const service = this.service();
      const key = visible ? `${service?.id ?? 'new'}:${visible}` : 'closed';

      if (this.resetKey === key) return;
      this.resetKey = key;

      if (visible) {
        queueMicrotask(() => this.resetForm(service));
      }
    });
  }

  onVisibleChange(visible: boolean) {
    this.visibleChange.emit(visible);
  }

  onPhotosSelected(event: { currentFiles?: File[]; files?: File[] }) {
    const files = event.currentFiles || event.files || [];
    this.selectedFiles.set([...files]);
  }

  removeExistingPhoto(photo: Photo) {
    this.existingPhotos.update((photos) => photos.filter((p) => p.id !== photo.id));
    this.deletePhotoIds.update((ids) => [...ids, photo.id]);
  }

  submit() {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    this.save.emit({
      value: this.serviceForm.getRawValue() as ServiceFormValue,
      photos: this.selectedFiles(),
      deletePhotoIds: this.deletePhotoIds(),
    });
  }

  imageUrl(url?: string | null) {
    return this.servicesService.resolvePhotoUrl(url);
  }

  private resetForm(service: ServiceDetail | null) {
    this.selectedFiles.set([]);
    this.deletePhotoIds.set([]);
    this.existingPhotos.set(service?.photos ?? []);
    this.fileUpload()?.clear();

    this.serviceForm.reset({
      name: service?.name ?? '',
      price: service?.price ?? 0,
      description: service?.description ?? '',
      durationInMinutes: service?.durationInMinutes ?? 30,
      isAvailable: service?.isAvailable ?? true,
    });
  }
}
