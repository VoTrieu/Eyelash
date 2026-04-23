import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { AccountService } from '../../core/services/account-service';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../core/services/toast-service';
import { RegisterCreds } from '../../types/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    DatePickerModule,
    PasswordModule,
    ButtonModule,
    SelectModule,
    ToastModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  private accountService = inject(AccountService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  protected genders = [
    { name: 'Male', code: 'male' },
    { name: 'Female', code: 'female' },
    { name: 'Other', code: 'other' }
  ];

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      address: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      // Format date to string if it's a Date object
      if (formValue.dateOfBirth instanceof Date) {
        formValue.dateOfBirth = formValue.dateOfBirth.toISOString().split('T')[0];
      }

      // Remove confirmPassword from the submission data
      const { confirmPassword, ...registerData } = formValue;

      this.accountService.register(registerData as RegisterCreds).subscribe({
        next: user => {
          this.toastService.showSuccess('Registration successful! Please login.');
          this.router.navigate(['/admin/login']);
        },
        error: err => {
          this.toastService.showError('Registration failed. Please try again.');
        }
      });
    } else {
      this.toastService.showError('Please fill in all required fields correctly.');
    }
  }
}