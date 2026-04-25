import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Service } from '../../types/service';
import { tap } from 'rxjs/internal/operators/tap';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  services = signal<Service[]>([]);

  loadServices() {
    return this.http.get<Service[]>(this.baseUrl + 'services').pipe(
      tap((services) => {
        this.services.set(services);
      })
    );
  }

  createService(service: Omit<Service, 'id' | 'created'>) {
    return this.http.post<Service>(this.baseUrl + 'services', service).pipe(
      tap((newService) => {
        this.services.update((services) => [...services, newService]);
      })
    );
  }

  updateService(id: number, service: Omit<Service, 'id' | 'created'>) {
    return this.http.put<Service>(this.baseUrl + 'services/' + id, service).pipe(
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
}
