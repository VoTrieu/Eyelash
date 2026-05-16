import type { Review } from './review';

export interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
  durationInMinutes: number;
  isAvailable: boolean;
  created: string;
  mainPhotoUrl?: string | null;
  photos: Photo[];
}

export interface Photo {
  id: number;
  url: string;
  isMain: boolean;
}

export interface ServiceDetail extends Service {
  reviews: Review[];
}

export interface ServiceQueryParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  isAvailable?: boolean | null;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface ServiceFormValue {
  name: string;
  price: number;
  description: string;
  durationInMinutes: number;
  isAvailable: boolean;
}
