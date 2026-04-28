import { Photo, Service } from './service';

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';

export interface Appointment {
  id: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  notes?: string | null;
  status: AppointmentStatus;
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
  confirmationNotificationSent: boolean;
  confirmedAt?: string | null;
  created: string;
  services: Service[];
  photos: Photo[];
}

export interface AppointmentSettings {
  sendConfirmationNotifications: boolean;
  sendSms: boolean;
  sendEmail: boolean;
}

export interface AppointmentQueryParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  status?: AppointmentStatus | '' | null;
  fromDate?: string | null;
  toDate?: string | null;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface AppointmentFormValue {
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
  appointmentDate: string;
  startTime: string;
  notes?: string | null;
}
