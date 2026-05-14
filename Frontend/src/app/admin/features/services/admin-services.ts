import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TableLazyLoadEvent } from 'primeng/types/table';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { finalize } from 'rxjs';
import { ServicesService } from '../../../core/services/services-service';
import { ToastService } from '../../../core/services/toast-service';
import { Service, ServiceDetail, ServiceQueryParams } from '../../../types/service';
import { ConfirmDialogService } from '../../../shared/confirm-dialog/confirm-dialog-service';
import {
  ServiceEditorDialog,
  ServiceEditorSaveEvent,
} from './components/service-editor-dialog/service-editor-dialog';
import { ServiceDetailsDialog } from './components/service-details-dialog/service-details-dialog';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    SelectModule,
    TagModule,
    ServiceEditorDialog,
    ServiceDetailsDialog,
  ],
  templateUrl: './admin-services.html',
  styleUrls: ['./admin-services.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminServices implements OnInit {
  private servicesService = inject(ServicesService);
  private toastService = inject(ToastService);
  private confirmDialogService = inject(ConfirmDialogService);
  private fb = inject(FormBuilder);

  services = this.servicesService.services;
  totalRecords = computed(() => this.servicesService.pagination()?.totalItems ?? 0);

  loading = signal(false);
  saving = signal(false);
  detailsLoading = signal(false);
  displayDialog = signal(false);
  detailsDialog = signal(false);
  isEditing = signal(false);
  editingService = signal<ServiceDetail | null>(null);
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
      .subscribe();
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
    this.editingService.set(null);
    this.displayDialog.set(true);
  }

  editService(service: Service) {
    this.isEditing.set(true);
    this.editingService.set(null);

    this.servicesService.getService(service.id).subscribe({
      next: (serviceDetail) => {
        this.editingService.set(serviceDetail);
        this.displayDialog.set(true);
      }
    });
  }

  viewDetails(service: Service) {
    this.selectedService.set(null);
    this.detailsDialog.set(true);
    this.detailsLoading.set(true);

    this.servicesService
      .getService(service.id)
      .pipe(finalize(() => this.detailsLoading.set(false)))
      .subscribe({
        next: (serviceDetail) => this.selectedService.set(serviceDetail)
      });
  }

  onEditorVisibleChange(visible: boolean) {
    this.displayDialog.set(visible);

    if (!visible) {
      this.isEditing.set(false);
      this.editingService.set(null);
    }
  }

  async deleteService(service: Service) {
    const confirmed = await this.confirmDialogService.confirm({
      title: 'Delete service?',
      message: `Delete ${service.name}?`,
      details: 'This removes the service from the menu and cannot be undone.',
      confirmLabel: 'Delete service',
      severity: 'danger',
    });

    if (!confirmed) return;

    this.servicesService.deleteService(service.id).subscribe({
      next: () => {
        this.toastService.showSuccess('Service deleted');
        this.loadServices();
      }
    });
  }

  saveService(event: ServiceEditorSaveEvent) {
    const wasEditing = this.isEditing();
    this.saving.set(true);

    const request =
      wasEditing && this.editingService()
        ? this.servicesService.updateService(
          this.editingService()!.id,
          event.value,
          event.photos,
          event.deletePhotoIds
        )
        : this.servicesService.createService(event.value, event.photos);

    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.displayDialog.set(false);
        this.editingService.set(null);
        this.isEditing.set(false);
        this.toastService.showSuccess(wasEditing ? 'Service updated' : 'Service created');
        this.loadServices();
      }
    });
  }

  imageUrl(url?: string | null) {
    return this.servicesService.resolvePhotoUrl(url);
  }
}
