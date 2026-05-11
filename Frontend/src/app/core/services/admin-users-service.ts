import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminUser, AdminUserFormValue, AdminUserQueryParams } from '../../types/admin-user';
import { PaginatedResult } from '../../types/pagination';

@Injectable({
  providedIn: 'root',
})
export class AdminUsersService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  users = signal<AdminUser[]>([]);
  pagination = signal<PaginatedResult<AdminUser>['metadata'] | null>(null);
  roles = signal<string[]>([]);

  loadUsers(params: AdminUserQueryParams = {}) {
    return this.http
      .get<PaginatedResult<AdminUser>>(this.baseUrl + 'adminusers', {
        params: this.buildParams(params),
      })
      .pipe(
        tap((result) => {
          this.users.set(result.items);
          this.pagination.set(result.metadata);
        })
      );
  }

  loadRoles() {
    return this.http.get<string[]>(this.baseUrl + 'adminusers/roles').pipe(
      tap((roles) => this.roles.set(roles))
    );
  }

  createUser(user: AdminUserFormValue, avatar?: File | null) {
    return this.http.post<AdminUser>(this.baseUrl + 'adminusers', this.toFormData(user, avatar)).pipe(
      tap((createdUser) => {
        this.users.update((users) => [createdUser, ...users]);
      })
    );
  }

  updateUser(id: string, user: AdminUserFormValue, avatar?: File | null) {
    return this.http.put<AdminUser>(this.baseUrl + `adminusers/${id}`, this.toFormData(user, avatar)).pipe(
      tap((updatedUser) => {
        this.users.update((users) =>
          users.map((user) => (user.id === id ? updatedUser : user))
        );
      })
    );
  }

  updateUserStatus(id: string, isActive: boolean) {
    return this.http.put<AdminUser>(this.baseUrl + `adminusers/${id}/status`, { isActive }).pipe(
      tap((updatedUser) => {
        this.users.update((users) =>
          users.map((user) => (user.id === id ? updatedUser : user))
        );
      })
    );
  }

  deleteUser(id: string) {
    return this.http.delete(this.baseUrl + `adminusers/${id}`).pipe(
      tap(() => {
        this.users.update((users) => users.filter((user) => user.id !== id));
      })
    );
  }

  private buildParams(params: AdminUserQueryParams) {
    const query: Record<string, string> = {};

    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined && value !== '') {
        query[key] = String(value);
      }
    }

    return query;
  }

  private toFormData(user: AdminUserFormValue, avatar?: File | null) {
    const formData = new FormData();

    formData.append('displayName', user.displayName);
    formData.append('email', user.email);
    formData.append('phoneNumber', user.phoneNumber ?? '');
    formData.append('password', user.password ?? '');
    formData.append('gender', user.gender ?? '');
    formData.append('address', user.address ?? '');
    formData.append('dateOfBirth', user.dateOfBirth ?? '');
    formData.append('isActive', String(user.isActive));
    user.roles.forEach((role) => formData.append('roles', role));

    if (avatar) {
      formData.append('avatar', avatar);
    }

    return formData;
  }
}
