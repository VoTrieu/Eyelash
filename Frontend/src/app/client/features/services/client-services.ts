import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { finalize, forkJoin, of, switchMap } from 'rxjs';
import { ServicesService } from '../../../core/services/services-service';
import { ToastService } from '../../../core/services/toast-service';
import { ServiceDetail } from '../../../types/service';
import { ServiceCard } from '../../components/service-card/service-card';

@Component({
  selector: 'app-client-services',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, DataViewModule, InputTextModule, IconFieldModule, InputIconModule, ServiceCard],
  templateUrl: './client-services.html',
  styleUrls: ['./client-services.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientServices implements OnInit {
  private servicesService = inject(ServicesService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  services = signal<ServiceDetail[]>([]);
  selectedServiceIds = signal<number[]>([]);
  searchTerm = signal('');
  loading = signal(false);

  selectedCount = computed(() => this.selectedServiceIds().length);
  selectedTotal = computed(() =>
    this.services()
      .filter((service) => this.selectedServiceIds().includes(service.id))
      .reduce((total, service) => total + service.price, 0)
  );
  filteredServices = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return this.services();

    return this.services().filter((service) =>
      `${service.name} ${service.description}`.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.loading.set(true);

    this.servicesService
      .loadServices({ pageNumber: 1, pageSize: 50, isAvailable: true, sortBy: 'name' })
      .pipe(
        switchMap((result) => {
          const services = result.items;
          if (!services.length) return of([]);

          return forkJoin(services.map((service) => this.servicesService.getService(service.id)));
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (services) => this.services.set(services),
        error: () => this.toastService.showError('Could not load services'),
      });
  }

  toggleBookingList(serviceId: number) {
    this.selectedServiceIds.update((ids) =>
      ids.includes(serviceId) ? ids.filter((id) => id !== serviceId) : [...ids, serviceId]
    );
  }

  setBookingListSelection(event: { serviceId: number; selected: boolean }) {
    this.selectedServiceIds.update((ids) => {
      if (event.selected) {
        return ids.includes(event.serviceId) ? ids : [...ids, event.serviceId];
      }

      return ids.filter((id) => id !== event.serviceId);
    });
  }

  isSelected(serviceId: number) {
    return this.selectedServiceIds().includes(serviceId);
  }

  bookNow(serviceId: number) {
    void this.navigateToBooking([serviceId]);
  }

  bookSelected() {
    const serviceIds = this.selectedServiceIds();
    if (!serviceIds.length) return;

    void this.navigateToBooking(serviceIds);
  }

  onSearch(value: string) {
    this.searchTerm.set(value);
  }

  private navigateToBooking(serviceIds: number[]) {
    return this.router.navigate(['/book-appointment'], {
      queryParams: { serviceIds },
    });
  }
}
