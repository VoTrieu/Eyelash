import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  Service,
  ServiceDetail,
  ServiceFormValue,
  ServiceQueryParams,
} from '../../types/service';
import { tap } from 'rxjs/internal/operators/tap';
import { PaginatedResult } from '../../types/pagination';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private mediaUrl = environment.apiUrl.replace(/api\/?$/, '');

  services = signal<Service[]>([]);
  pagination = signal<PaginatedResult<Service>['metadata'] | null>(null);

  loadServices(params: ServiceQueryParams = {}) {
    return this.http.get<PaginatedResult<Service>>(this.baseUrl + 'services', { params: this.buildParams(params) }).pipe(
      tap((result) => {
        this.services.set(result.items);
        this.pagination.set(result.metadata);
      })
    );
  }

  getService(id: number) {
    return this.http.get<ServiceDetail>(this.baseUrl + 'services/' + id);
  }

  createService(service: ServiceFormValue, photos: File[] = []) {
    return this.http.post<ServiceDetail>(this.baseUrl + 'services', this.toFormData(service, photos)).pipe(
      tap((newService) => {
        this.services.update((services) => [...services, newService]);
      })
    );
  }

  updateService(id: number, service: ServiceFormValue, photos: File[] = [], deletePhotoIds: number[] = []) {
    return this.http.put<ServiceDetail>(this.baseUrl + 'services/' + id, this.toFormData(service, photos, deletePhotoIds)).pipe(
      tap((updatedService) => {
        this.services.update((services) =>
          services.map((s) => (s.id === id ? updatedService : s))
        );
      })
    );
  }

  deleteService(id: number) {
    return this.http.delete(this.baseUrl + 'services/' + id).pipe(
      tap(() => {
        this.services.update((services) => services.filter((s) => s.id !== id));
      })
    );
  }

  resolvePhotoUrl(url?: string | null) {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return this.mediaUrl + url.replace(/^\//, '');
  }

  private buildParams(params: ServiceQueryParams) {
    const query: Record<string, string> = {};

    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined && value !== '') {
        query[key] = String(value);
      }
    }

    return query;
  }

  private toFormData(service: ServiceFormValue, photos: File[], deletePhotoIds: number[] = []) {
    const formData = new FormData();

    formData.append('name', service.name);
    formData.append('price', String(service.price));
    formData.append('description', service.description);
    formData.append('durationInMinutes', String(service.durationInMinutes));
    formData.append('isAvailable', String(service.isAvailable));
    deletePhotoIds.forEach((id) => formData.append('deletePhotoIds', String(id)));

    photos.forEach((photo) => formData.append('photos', photo));

    return formData;
  }
}
