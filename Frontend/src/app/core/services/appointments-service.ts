import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Appointment,
  AppointmentFormValue,
  AppointmentQueryParams,
  AppointmentSettings,
} from '../../types/appointment';
import { PaginatedResult } from '../../types/pagination';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private mediaUrl = environment.apiUrl.replace(/api\/?$/, '');
  private hubUrl = this.mediaUrl.replace(/\/$/, '') + '/hubs/appointments';
  private hubConnection?: signalR.HubConnection;

  appointments = signal<Appointment[]>([]);
  pagination = signal<PaginatedResult<Appointment>['metadata'] | null>(null);
  settings = signal<AppointmentSettings | null>(null);
  realtimeConnected = signal(false);
  realtimeAppointmentVersion = signal(0);


  loadAppointments(params: AppointmentQueryParams = {}) {
    return this.http
      .get<PaginatedResult<Appointment>>(this.baseUrl + 'appointments', {
        params: this.buildParams(params),
      })
      .pipe(
        tap((result) => {
          this.appointments.set(result.items);
          this.pagination.set(result.metadata);
        })
      );
  }

  getAppointment(id: number) {
    return this.http.get<Appointment>(this.baseUrl + 'appointments/' + id);
  }

  createAppointment(value: AppointmentFormValue, serviceIds: number[], photos: File[] = []) {
    const formData = new FormData();

    formData.append('clientName', value.clientName);
    formData.append('clientEmail', value.clientEmail);
    formData.append('clientPhone', value.clientPhone ?? '');
    formData.append('appointmentDate', value.appointmentDate);
    formData.append('startTime', value.startTime);
    formData.append('notes', value.notes ?? '');
    serviceIds.forEach((serviceId) => formData.append('serviceIds', String(serviceId)));
    photos.forEach((photo) => formData.append('photos', photo));

    return this.http.post<Appointment>(this.baseUrl + 'appointments', formData);
  }

  confirmAppointment(id: number) {
    return this.http
      .put<Appointment>(this.baseUrl + `appointments/${id}/confirm`, {})
      .pipe(tap((appointment) => this.upsertAppointment(appointment)));
  }

  cancelAppointment(id: number) {
    return this.http
      .put<Appointment>(this.baseUrl + `appointments/${id}/cancel`, {})
      .pipe(tap((appointment) => this.upsertAppointment(appointment)));
  }

  completeAppointment(id: number) {
    return this.http
      .put<Appointment>(this.baseUrl + `appointments/${id}/complete`, {})
      .pipe(tap((appointment) => this.upsertAppointment(appointment)));
  }

  loadSettings() {
    return this.http.get<AppointmentSettings>(this.baseUrl + 'appointments/settings').pipe(
      tap((settings) => this.settings.set(settings))
    );
  }

  updateSettings(settings: AppointmentSettings) {
    return this.http.put<AppointmentSettings>(this.baseUrl + 'appointments/settings', settings).pipe(
      tap((updated) => this.settings.set(updated))
    );
  }

  async startRealtime() {
    if (this.hubConnection) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl)
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('AppointmentCreated', (appointment: Appointment) => {
      this.upsertAppointment(appointment);
      this.realtimeAppointmentVersion.update((v) => v + 1);
    });

    this.hubConnection.on('AppointmentUpdated', (appointment: Appointment) => {
      this.upsertAppointment(appointment);
      this.realtimeAppointmentVersion.update((v) => v + 1);
    });

    this.hubConnection.on('AppointmentSettingsUpdated', (settings: AppointmentSettings) => {
      this.settings.set(settings);
    });

    this.hubConnection.onreconnected(() => this.realtimeConnected.set(true));
    this.hubConnection.onclose(() => this.realtimeConnected.set(false));

    try {
      await this.hubConnection.start();
      this.realtimeConnected.set(true);
    } catch {
      this.realtimeConnected.set(false);
      this.hubConnection = undefined;
    }
  }

  async stopRealtime() {
    if (!this.hubConnection) return;

    await this.hubConnection.stop();
    this.hubConnection = undefined;
    this.realtimeConnected.set(false);
  }

  resolvePhotoUrl(url?: string | null) {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return this.mediaUrl + url.replace(/^\//, '');
  }

  private upsertAppointment(appointment: Appointment) {
    this.appointments.update((appointments) => {
      const exists = appointments.some((item) => item.id === appointment.id);
      if (!exists) return [appointment, ...appointments];

      return appointments.map((item) => (item.id === appointment.id ? appointment : item));
    });
  }

  private buildParams(params: AppointmentQueryParams) {
    const query: Record<string, string> = {};

    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined && value !== '') {
        query[key] = String(value);
      }
    }

    return query;
  }
}
