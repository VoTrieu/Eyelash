import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  AppointmentAvailabilityFormValue,
  AppointmentAvailabilityQueryParams,
  AppointmentAvalabilityBlock,
  AvailableAppointmentSlot,
} from '../../types/availability';
import { PaginatedResult } from '../../types/pagination';
import { environment } from '../../../environments/environment';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AvailabilityService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  availabilityBlocks = signal<AppointmentAvalabilityBlock[]>([]);
  pagination = signal<PaginatedResult<AppointmentAvalabilityBlock>['metadata'] | null>(null);

  loadAvailabilityBlocks(params: AppointmentAvailabilityQueryParams = {}) {
    return this.http
      .get<
        PaginatedResult<AppointmentAvalabilityBlock>
      >(this.baseUrl + 'appointmentavailability', { params: this.buildParams(params) })
      .pipe(
        tap((result) => {
          this.availabilityBlocks.set(result.items);
          this.pagination.set(result.metadata);
        }),
      );
  }

  loadAvailabilityBlockForDay(date?: string | null){
    return this.http.get<AppointmentAvalabilityBlock[]>(
      this.baseUrl + 'appointmentavailability/day' + date, {params: this.buildParams({ date: date ?? ''})});
  }

  createAvailabilityBlock(block: AppointmentAvailabilityFormValue){
    return this.http.post<AppointmentAvalabilityBlock>(this.baseUrl + 'appointmentavailability', block).pipe(
      tap((newBlock) => {
        this.availabilityBlocks.update((blocks) => [...blocks, newBlock]);
      })
    )
  }

  updateAvailabilityBlock(Id: number, block: AppointmentAvailabilityFormValue){
    return this.http.put<AppointmentAvalabilityBlock>(this.baseUrl + `appointmentavailability/${Id}`, block).pipe(
      tap(updateBlock => {
        this.availabilityBlocks.update((blocks) => blocks.map(b => b.id === updateBlock.id ? updateBlock : b));
      })
    )
  }

  deleteAvailabilityBlock(Id: number){
    return this.http.delete(this.baseUrl + `appointmentavailability/${Id}`).pipe(
      tap(() => {
        this.availabilityBlocks.update((blocks) => blocks.filter(b => b.id !== Id))
      })
    )     
  }

  getAvailableAppointmentSlots(date: string, serviceIds: number[]){
    const params = this.buildParams({ date, serviceIds: serviceIds.join(',') });
    return this.http.get<AvailableAppointmentSlot[]>(this.baseUrl + 'appointmentavailability/slots', { params }).pipe(
      map(slots => slots.map(slot => ({
        startTime: slot.startTime.slice(0, 5),
        endTime: slot.endTime.slice(0, 5)
      })))
    );
  }



  private buildParams(params: object) {
    const query: Record<string, string> = {};

    for (const [key, value] of Object.entries(
      params as Record<string, string | number | null | undefined>,
    )) {
      if (value !== null && value !== undefined && value !== '') {
        query[key] = String(value);
      }
    }

    return query;
  }
}
