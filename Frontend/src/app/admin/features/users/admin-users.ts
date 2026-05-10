import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { finalize } from 'rxjs';
import { AdminUsersService } from '../../../core/services/admin-users-service';
import { ToastService } from '../../../core/services/toast-service';
import { AdminUser, AdminUserFormValue, AdminUserQueryParams } from '../../../types/admin-user';
import { toDateOnly } from '../../../shared/helpers/date-time-helper';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    DatePickerModule,
    InputTextModule,
    MultiSelectModule,
    SelectModule,
    TableModule,
    TagModule,
  ],
  templateUrl: './admin-users.html',
  styleUrls: ['./admin-users.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsers implements OnInit {
  private adminUsersService = inject(AdminUsersService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  users = this.adminUsersService.users;
  roles = this.adminUsersService.roles;
  totalRecords = computed(() => this.adminUsersService.pagination()?.totalItems ?? 0);

  loading = signal(false);
  saving = signal(false);
  displayDialog = signal(false);
  isEditing = signal(false);
  editingId = signal<string | null>(null);

  rows = 10;
  first = 0;
  sortBy = 'created';
  sortDirection: 'asc' | 'desc' = 'desc';

  statusOptions = [
    { label: 'All statuses', value: null },
    { label: 'Active', value: true },
    { label: 'Inactive', value: false },
  ];

  filterForm = this.fb.group({
    search: [''],
    role: [null as string | null],
    isActive: [null as boolean | null],
  });

  userForm = this.fb.group({
    displayName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: [''],
    password: [''],
    gender: [''],
    address: [''],
    dateOfBirth: [null as Date | null],
    isActive: [true],
    roles: [[] as string[], Validators.required],
  });

  ngOnInit() {
    this.loadRoles();
    this.loadUsers();
  }

  loadUsers(params: Partial<AdminUserQueryParams> = {}) {
    this.loading.set(true);

    this.adminUsersService
      .loadUsers({
        pageNumber: Math.floor(this.first / this.rows) + 1,
        pageSize: this.rows,
        search: this.filterForm.value.search?.trim(),
        role: this.filterForm.value.role,
        isActive: this.filterForm.value.isActive,
        sortBy: this.sortBy,
        sortDirection: this.sortDirection,
        ...params,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        error: () => this.toastService.showError('Could not load users'),
      });
  }

  loadRoles() {
    this.adminUsersService.loadRoles().subscribe({
      error: () => this.toastService.showError('Could not load roles'),
    });
  }

  onTableLazyLoad(event: TableLazyLoadEvent) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? this.rows;

    const sortField = Array.isArray(event.sortField) ? event.sortField[0] : event.sortField;
    this.sortBy = sortField || this.sortBy;
    this.sortDirection = event.sortOrder === -1 ? 'desc' : 'asc';

    this.loadUsers();
  }

  applyFilters() {
    this.first = 0;
    this.loadUsers();
  }

  clearFilters() {
    this.filterForm.reset({ search: '', role: null, isActive: null });
    this.first = 0;
    this.loadUsers();
  }

  openNew() {
    this.isEditing.set(false);
    this.editingId.set(null);
    this.userForm.reset({
      displayName: '',
      email: '',
      phoneNumber: '',
      password: '',
      gender: '',
      address: '',
      dateOfBirth: null,
      isActive: true,
      roles: ['Client'],
    });
    this.userForm.controls.password.addValidators(Validators.required);
    this.userForm.controls.password.updateValueAndValidity();
    this.displayDialog.set(true);
  }

  editUser(user: AdminUser) {
    this.isEditing.set(true);
    this.editingId.set(user.id);
    this.userForm.controls.password.removeValidators(Validators.required);
    this.userForm.controls.password.updateValueAndValidity();
    this.userForm.reset({
      displayName: user.displayName,
      email: user.email,
      phoneNumber: user.phoneNumber ?? '',
      password: '',
      gender: user.gender ?? '',
      address: user.address ?? '',
      dateOfBirth: this.toDateValue(user.dateOfBirth),
      isActive: user.isActive,
      roles: user.roles,
    });
    this.displayDialog.set(true);
  }

  saveUser() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const value = this.normalizeFormValue();
    const request = this.isEditing() && this.editingId() !== null
      ? this.adminUsersService.updateUser(this.editingId()!, value)
      : this.adminUsersService.createUser(value);

    this.saving.set(true);
    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.displayDialog.set(false);
        this.toastService.showSuccess(this.isEditing() ? 'User updated' : 'User created');
        this.loadUsers();
      },
      error: () => this.toastService.showError('Could not save user'),
    });
  }

  toggleStatus(user: AdminUser) {
    const action = user.isActive ? 'deactivate' : 'reactivate';
    if (!confirm(`Are you sure you want to ${action} ${user.displayName}?`)) return;

    this.adminUsersService.updateUserStatus(user.id, !user.isActive).subscribe({
      next: () => this.toastService.showSuccess(`User ${user.isActive ? 'deactivated' : 'reactivated'}`),
      error: () => this.toastService.showError(`Could not ${action} user`),
    });
  }

  deleteUser(user: AdminUser) {
    if (!confirm(`Delete ${user.displayName}? This cannot be undone.`)) return;

    this.adminUsersService.deleteUser(user.id).subscribe({
      next: () => {
        this.toastService.showSuccess('User deleted');
        this.loadUsers();
      },
      error: () => this.toastService.showError('Could not delete user'),
    });
  }

  roleOptions() {
    return this.roles().map((role) => ({ label: role, value: role }));
  }

  roleSeverity(role: string) {
    return role === 'Admin' ? 'danger' : role === 'Moderator' ? 'warn' : 'info';
  }

  private normalizeFormValue(): AdminUserFormValue {
    const value = this.userForm.getRawValue();

    return {
      displayName: value.displayName ?? '',
      email: value.email ?? '',
      phoneNumber: value.phoneNumber || null,
      password: value.password || null,
      gender: value.gender || null,
      address: value.address || null,
      dateOfBirth: toDateOnly(value.dateOfBirth),
      isActive: value.isActive ?? true,
      roles: value.roles ?? [],
    };
  }

  private toDateValue(value?: string | null) {
    if (!value) return null;
    return new Date(value);
  }
}
