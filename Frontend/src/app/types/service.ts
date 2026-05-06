export interface Service {
  id: number;
  name: string;
  price: number;
  description: string;
  durationInMinutes: number;
  isAvailable: boolean;
  created: string;
  mainPhotoUrl?: string | null;
}

export interface Photo {
  id: number;
  url: string;
  isMain: boolean;
}

export interface Review {
  id: number;
  rating: number;
  comment?: string | null;
  created: string;
  displayName: string;
  photos: Photo[];
}

export interface ServiceDetail extends Service {
  photos: Photo[];
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
