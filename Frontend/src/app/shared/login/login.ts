import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { AccountService } from '../../core/services/account-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardModule, InputTextModule, PasswordModule, ButtonModule, ToastModule],
  templateUrl: './login.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  private accountService = inject(AccountService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);


  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.accountService.login(this.loginForm.value).subscribe({
        next: user => {
          this.toastService.showSuccess('Login successful!');
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

          if(user.roles.includes('Admin')){
            this.router.navigateByUrl(returnUrl || '/admin');
          } else {
            this.router.navigateByUrl(returnUrl || '/');
          }
        },
        error: err => {
          this.toastService.showError('Login failed. Please check your credentials.');
        }
      });
    }
  }
}
