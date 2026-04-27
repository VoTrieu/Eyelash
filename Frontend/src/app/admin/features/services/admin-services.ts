import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TableLazyLoadEvent } from 'primeng/types/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { finalize } from 'rxjs';
import { ServicesService } from '../../../core/services/services-service';
import { ToastService } from '../../../core/services/toast-service';
import { Service, ServiceDetail, ServiceFormValue, ServiceQueryParams } from '../../../types/service';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    SelectModule,
    TagModule,
    TextareaModule,
    FileUploadModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './admin-services.html',
  styleUrls: ['./admin-services.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminServices implements OnInit {
  private servicesService = inject(ServicesService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  services = this.servicesService.services;
  totalRecords = computed(() => this.servicesService.pagination()?.totalItems ?? 0);

  loading = signal(false);
  saving = signal(false);
  detailsLoading = signal(false);
  displayDialog = signal(false);
  detailsDialog = signal(false);
  isEditing = signal(false);
  editingId = signal<number | null>(null);
  selectedFiles = signal<File[]>([]);
  selectedService = signal<ServiceDetail | null>(null);

  rows = 10;
  first = 0;
  sortBy = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  statusOptions = [
    { label: 'All statuses', value: null },
    { label: 'Available', value: true },
    { label: 'Unavailable', value: false },
  ];

  filterForm = this.fb.group({
    search: [''],
    isAvailable: [null as boolean | null],
  });

  serviceForm = this.fb.group({
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    description: ['', Validators.required],
    durationInMinutes: [30, [Validators.required, Validators.min(1)]],
    isAvailable: [true],
  });

  ngOnInit() {
    this.loadServices();
  }

  loadServices(params: Partial<ServiceQueryParams> = {}) {
    this.loading.set(true);

    this.servicesService
      .loadServices({
        pageNumber: Math.floor(this.first / this.rows) + 1,
        pageSize: this.rows,
        search: this.filterForm.value.search?.trim(),
        isAvailable: this.filterForm.value.isAvailable,
        sortBy: this.sortBy,
        sortDirection: this.sortDirection,
        ...params,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        error: () => this.toastService.showError('Could not load services'),
      });
  }

  onTableLazyLoad(event: TableLazyLoadEvent) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? this.rows;

    const sortField = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;
    this.sortBy = sortField || this.sortBy;
    this.sortDirection = event.sortOrder === -1 ? 'desc' : 'asc';

    this.loadServices();
  }

  applyFilters() {
    this.first = 0;
    this.loadServices();
  }

  clearFilters() {
    this.filterForm.reset({ search: '', isAvailable: null });
    this.first = 0;
    this.loadServices();
  }

  openNew() {
    this.isEditing.set(false);
    this.editingId.set(null);
    this.selectedFiles.set([]);
    this.serviceForm.reset({
      name: '',
      price: 0,
      description: '',
      durationInMinutes: 30,
      isAvailable: true,
    });
    this.displayDialog.set(true);
  }

  editService(service: Service) {
    this.isEditing.set(true);
    this.editingId.set(service.id);
    this.selectedFiles.set([]);
    this.serviceForm.patchValue({
      name: service.name,
      price: service.price,
      description: service.description,
      durationInMinutes: service.durationInMinutes,
      isAvailable: service.isAvailable,
    });
    this.displayDialog.set(true);
  }

  viewDetails(service: Service) {
    this.selectedService.set(null);
    this.detailsDialog.set(true);
    this.detailsLoading.set(true);

    this.servicesService
      .getService(service.id)
      .pipe(finalize(() => this.detailsLoading.set(false)))
      .subscribe({
        next: (serviceDetail) => this.selectedService.set(serviceDetail),
        error: () => this.toastService.showError('Could not load service details'),
      });
  }

  onPhotosSelected(event: { files: File[] }) {
    this.selectedFiles.set(event.files ?? []);
  }

  clearSelectedPhotos() {
    this.selectedFiles.set([]);
  }

  deleteService(service: Service) {
    if (!confirm(`Delete ${service.name}?`)) return;

    this.servicesService.deleteService(service.id).subscribe({
      next: () => {
        this.toastService.showSuccess('Service deleted');
        this.loadServices();
      },
      error: () => this.toastService.showError('Could not delete service'),
    });
  }

  saveService() {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }

    const formValue = this.serviceForm.getRawValue() as ServiceFormValue;
    this.saving.set(true);

    const request =
      this.isEditing() && this.editingId() !== null
        ? this.servicesService.updateService(this.editingId()!, formValue, this.selectedFiles())
        : this.servicesService.createService(formValue, this.selectedFiles());

    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.displayDialog.set(false);
        this.toastService.showSuccess(this.isEditing() ? 'Service updated' : 'Service created');
        this.loadServices();
      },
      error: () => this.toastService.showError('Could not save service'),
    });
  }

  imageUrl(url?: string | null) {
    return this.servicesService.resolvePhotoUrl(url);
  }
}
