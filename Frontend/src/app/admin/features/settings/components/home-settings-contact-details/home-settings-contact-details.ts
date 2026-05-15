import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-home-settings-contact-details',
  standalone: true,
  imports: [ReactiveFormsModule, CardModule, InputTextModule, InputNumberModule],
  templateUrl: './home-settings-contact-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeSettingsContactDetails {
  form = input.required<FormGroup>();
}
