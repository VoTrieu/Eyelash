export interface AdminUser {
  id: string;
  displayName: string;
  email: string;
  phoneNumber?: string | null;
  imageUrl?: string | null;
  gender?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
  created: string;
  lastActive: string;
  isActive: boolean;
  roles: string[];
}

export interface AdminUserQueryParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  role?: string | null;
  isActive?: boolean | null;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface AdminUserFormValue {
  displayName: string;
  email: string;
  phoneNumber?: string | null;
  password?: string | null;
  gender?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
  isActive: boolean;
  roles: string[];
}
