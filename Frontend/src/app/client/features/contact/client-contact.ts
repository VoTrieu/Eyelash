import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { finalize } from 'rxjs';
import { ContactService } from '../../../core/services/contact-service';
import { ToastService } from '../../../core/services/toast-service';
import { Map } from '../../../shared/map/map';

@Component({
  selector: 'app-client-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    Map,
  ],
  templateUrl: './client-contact.html',
  styleUrls: ['./client-contact.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientContact {
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);
  private toastService = inject(ToastService);

  readonly address = '5150 Yonge St, North York, ON M2N 6L8';
  sending = signal(false);

  contactForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', canadianPhoneValidator],
    message: ['', Validators.required],
  });

  sendMessage() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const value = this.contactForm.getRawValue();

    this.sending.set(true);
    this.contactService
      .sendInquiry({
        name: value.name,
        email: value.email,
        phone: value.phone || null,
        message: value.message,
      })
      .pipe(finalize(() => this.sending.set(false)))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Your message was sent.');
          this.contactForm.reset();
        },
      });
  }

  fieldInvalid(fieldName: keyof typeof this.contactForm.controls) {
    const control = this.contactForm.controls[fieldName];
    return control.invalid && (control.touched || control.dirty);
  }
}

function canadianPhoneValidator(control: AbstractControl): ValidationErrors | null {
  const value = String(control.value ?? '').trim();
  if (!value) return null;

  const canadianPhonePattern = /^(\+?1[\s.-]?)?\(?[2-9]\d{2}\)?[\s.-]?[2-9]\d{2}[\s.-]?\d{4}$/;
  return canadianPhonePattern.test(value) ? null : { canadianPhone: true };
}
