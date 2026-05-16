import type { Photo } from './service';

export interface Review {
  id: number;
  rating: number;
  comment?: string | null;
  clientName: string;
  clientEmail?: string | null;
  displayName: string;
  created: string;
  isPublished: boolean;
  serviceId: number;
  serviceName: string;
  appointmentId?: number | null;
  photos: Photo[];
}

export interface ReviewQueryParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  serviceId?: number | null;
  rating?: number | null;
  isPublished?: boolean | null;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface ReviewFormValue {
  clientName: string;
  clientEmail?: string | null;
  rating: number;
  comment?: string | null;
  serviceId: number;
  appointmentId?: number | null;
  isPublished?: boolean;
}
