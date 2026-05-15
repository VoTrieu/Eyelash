import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { finalize } from 'rxjs';
import { AdminUsersService } from '../../../core/services/admin-users-service';
import { AccountService } from '../../../core/services/account-service';
import { ToastService } from '../../../core/services/toast-service';
import { AdminUser, AdminUserFormValue, AdminUserQueryParams } from '../../../types/admin-user';
import { toDateOnly } from '../../../shared/helpers/date-time-helper';
import { ConfirmDialogService } from '../../../shared/confirm-dialog/confirm-dialog-service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    AvatarModule,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    DatePickerModule,
    FileUploadModule,
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
  private accountService = inject(AccountService);
  private toastService = inject(ToastService);
  private confirmDialogService = inject(ConfirmDialogService);
  private fb = inject(FormBuilder);

  users = this.adminUsersService.users;
  roles = this.adminUsersService.roles;
  totalRecords = computed(() => this.adminUsersService.pagination()?.totalItems ?? 0);

  loading = signal(false);
  saving = signal(false);
  displayDialog = signal(false);
  isEditing = signal(false);
  editingId = signal<string | null>(null);
  selectedAvatar = signal<File | null>(null);
  avatarPreviewUrl = signal<string | null>(null);
  existingAvatarUrl = signal<string | null>(null);
  showPassword = signal(false);

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
      .subscribe();
  }

  loadRoles() {
    this.adminUsersService.loadRoles().subscribe();
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
    this.clearAvatarSelection();
    this.existingAvatarUrl.set(null);
    this.showPassword.set(false);
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
    this.clearAvatarSelection();
    this.existingAvatarUrl.set(user.imageUrl ?? null);
    this.showPassword.set(false);
    this.displayDialog.set(true);
  }

  saveUser() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const value = this.normalizeFormValue();
    const request = this.isEditing() && this.editingId() !== null
      ? this.adminUsersService.updateUser(this.editingId()!, value, this.selectedAvatar())
      : this.adminUsersService.createUser(value, this.selectedAvatar());

    this.saving.set(true);
    request.pipe(finalize(() => this.saving.set(false))).subscribe({
      next: (savedUser) => {
        if (savedUser.id === this.accountService.currentUser()?.id) {
          this.accountService.updateCurrentUser({
            displayName: savedUser.displayName,
            email: savedUser.email,
            imageUrl: savedUser.imageUrl ?? undefined,
          });
        }

        this.displayDialog.set(false);
        this.clearAvatarSelection();
        this.toastService.showSuccess(this.isEditing() ? 'User updated' : 'User created');
        this.loadUsers();
      }
    });
  }

  async toggleStatus(user: AdminUser) {
    const action = user.isActive ? 'deactivate' : 'reactivate';
    const confirmed = await this.confirmDialogService.confirm({
      title: user.isActive ? 'Deactivate user?' : 'Reactivate user?',
      message: `Are you sure you want to ${action} ${user.displayName}?`,
      details: user.isActive
        ? 'This user will no longer be able to sign in until reactivated.'
        : 'This user will be able to sign in again.',
      confirmLabel: user.isActive ? 'Deactivate' : 'Reactivate',
      severity: user.isActive ? 'warn' : 'success',
      icon: user.isActive ? 'pi pi-user-minus' : 'pi pi-user-plus',
    });

    if (!confirmed) return;

    this.adminUsersService.updateUserStatus(user.id, !user.isActive).subscribe({
      next: () => this.toastService.showSuccess(`User ${user.isActive ? 'deactivated' : 'reactivated'}`)
    });
  }

  async deleteUser(user: AdminUser) {
    const confirmed = await this.confirmDialogService.confirm({
      title: 'Delete user?',
      message: `Delete ${user.displayName}?`,
      details: 'This cannot be undone. The user account will be permanently removed.',
      confirmLabel: 'Delete user',
      severity: 'danger',
    });

    if (!confirmed) return;

    this.adminUsersService.deleteUser(user.id).subscribe({
      next: () => {
        this.toastService.showSuccess('User deleted');
        this.loadUsers();
      }
    });
  }

  roleOptions() {
    return this.roles().map((role) => ({ label: role, value: role }));
  }

  roleSeverity(role: string) {
    return role === 'Admin' ? 'danger' : role === 'Moderator' ? 'warn' : 'info';
  }

  avatarUrl(user: AdminUser) {
    return this.accountService.resolveImageUrl(user.imageUrl);
  }

  currentAvatarPreview() {
    return this.avatarPreviewUrl() ?? this.accountService.resolveImageUrl(this.existingAvatarUrl());
  }

  avatarLabel(user?: AdminUser | null) {
    return user?.displayName?.charAt(0).toUpperCase() || this.userForm.value.displayName?.charAt(0).toUpperCase() || 'U';
  }

  onAvatarSelected(event: { files?: File[]; currentFiles?: File[] }) {
    const file = event.currentFiles?.[0] ?? event.files?.[0] ?? null;
    if (!file) return;

    this.clearAvatarSelection();
    this.selectedAvatar.set(file);
    this.avatarPreviewUrl.set(URL.createObjectURL(file));
  }

  clearAvatarSelection() {
    const previewUrl = this.avatarPreviewUrl();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    this.selectedAvatar.set(null);
    this.avatarPreviewUrl.set(null);
  }

  onDialogVisibleChange(visible: boolean) {
    this.displayDialog.set(visible);

    if (!visible) {
      this.clearAvatarSelection();
      this.showPassword.set(false);
    }
  }

  togglePasswordVisibility() {
    this.showPassword.update((visible) => !visible);
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
